import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { IMPORTANT_KEYWORDS } from '../sources.js';

const parser = new Parser({
  // Some feeds (e.g. SEC) may require a user agent.
  requestOptions: {
    headers: {
      'User-Agent': 'YieldNewsHub/0.1 (+https://github.com/PantherLand/YieldNewsHub)',
      Accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
    },
  },
});

function scoreItem(title = '', summary = '') {
  const text = `${title} ${summary}`.toLowerCase();
  let score = 0;
  for (const kw of IMPORTANT_KEYWORDS) {
    if (text.includes(kw)) score += 2;
  }
  // Boost for obvious macro keywords
  if (text.includes('fomc') || text.includes('interest rate')) score += 3;
  if (text.includes('hack') || text.includes('exploit')) score += 3;
  return score;
}

function extractTags(title = '', summary = '') {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = [];
  for (const kw of IMPORTANT_KEYWORDS) {
    if (text.includes(kw)) tags.push(kw);
  }
  return Array.from(new Set(tags)).slice(0, 12);
}

export async function pollNewsOnce({ pushFn } = {}) {
  const sources = await prisma.newsSource.findMany({ where: { enabled: true } });

  let totalNew = 0;
  let totalUpdated = 0;
  let sourcesProcessed = 0;
  let sourcesFailed = 0;

  console.log(`[news] Polling ${sources.length} news sources...`);

  for (const s of sources) {
    try {
      // rss-parser uses node-fetch internally; but some feeds need manual fetch. We'll try parser first.
      let feed;
      try {
        feed = await parser.parseURL(s.url);
      } catch {
        const res = await fetch(s.url, {
          headers: {
            'User-Agent': 'YieldNewsHub/0.1',
            Accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
          },
        });
        const xml = await res.text();
        feed = await parser.parseString(xml);
      }

      let newItems = 0;
      let updatedItems = 0;

      for (const item of feed.items || []) {
        const url = item.link || item.guid;
        if (!url) continue;

        const title = item.title || 'Untitled';
        const summary = item.contentSnippet || item.content || '';
        const publishedAt = item.isoDate ? new Date(item.isoDate) : null;

        const score = scoreItem(title, summary);
        const tags = extractTags(title, summary);

        // Check if item exists
        const existing = await prisma.newsItem.findUnique({ where: { url } });

        // upsert by unique url
        await prisma.newsItem.upsert({
          where: { url },
          update: {
            title,
            summary,
            publishedAt,
            tags,
            score,
            sourceId: s.id,
          },
          create: {
            url,
            title,
            summary,
            publishedAt,
            tags,
            score,
            sourceId: s.id,
          },
        });

        if (existing) {
          updatedItems++;
        } else {
          newItems++;

          // Push only if it's fresh and important-ish
          if (pushFn && score >= 6) {
            const ageMs = publishedAt ? Date.now() - publishedAt.getTime() : 0;
            if (!publishedAt || ageMs < 1000 * 60 * 60 * 24) {
              await pushFn({ title, url, score, tags });
            }
          }
        }
      }

      totalNew += newItems;
      totalUpdated += updatedItems;
      sourcesProcessed++;

      console.log(`[news] ✓ ${s.name}: ${newItems} new, ${updatedItems} updated`);
    } catch (e) {
      sourcesFailed++;
      console.warn(`[news] ✗ ${s.name}: ${e?.message || e}`);
    }
  }

  console.log(`[news] Poll complete: ${sourcesProcessed}/${sources.length} sources OK, ${totalNew} new items, ${totalUpdated} updated`);

  return {
    success: true,
    sourcesProcessed,
    sourcesFailed,
    totalNew,
    totalUpdated,
  };
}
