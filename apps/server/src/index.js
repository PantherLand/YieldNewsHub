import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from './db.js';
import { DEFAULT_NEWS_SOURCES } from './sources.js';
import { pollNewsOnce } from './jobs/news.js';
import { pollApyOnce } from './jobs/apy.js';
import { pushTelegram } from './telegram.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: process.env.WEB_ORIGIN || true,
    credentials: true,
  })
);

app.get('/healthz', (_req, res) => res.json({ ok: true }));

// --- APIs
app.get('/api/news', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const minScore = Number(req.query.minScore || 0);
  const items = await prisma.newsItem.findMany({
    where: { score: { gte: minScore } },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    include: { source: true },
  });
  res.json({ items });
});

app.get('/api/apy', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const items = await prisma.apyOpportunity.findMany({
    orderBy: [{ apy: 'desc' }, { tvlUsd: 'desc' }],
    take: limit,
  });
  res.json({ items });
});

app.get('/api/sources', async (_req, res) => {
  const news = await prisma.newsSource.findMany({ orderBy: { name: 'asc' } });
  const apy = await prisma.apySource.findMany({ orderBy: { name: 'asc' } });
  res.json({ news, apy });
});

app.post('/api/integrations/telegram', async (req, res) => {
  const { enabled, botToken, chatId } = req.body || {};
  if (typeof enabled !== 'boolean' || typeof botToken !== 'string' || typeof chatId !== 'string') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const existing = await prisma.telegramIntegration.findFirst();
  const row = await prisma.telegramIntegration.upsert({
    where: { id: existing?.id || '___missing___' },
    update: { enabled, botToken, chatId },
    create: { enabled, botToken, chatId },
  }).catch(async () => {
    // If upsert fails due to missing where id, do a create
    if (existing) return existing;
    return prisma.telegramIntegration.create({ data: { enabled, botToken, chatId } });
  });

  res.json({ ok: true, integration: { id: row.id, enabled: row.enabled, chatId: row.chatId } });
});

app.post('/api/integrations/telegram/test', async (_req, res) => {
  const r = await pushTelegram('YieldNewsHub test message');
  res.json(r);
});

// --- bootstrap
async function ensureSeedData() {
  // News sources
  const existing = await prisma.newsSource.count();
  if (existing === 0) {
    await prisma.newsSource.createMany({ data: DEFAULT_NEWS_SOURCES });
  }

  // APY sources
  const apyExisting = await prisma.apySource.count();
  if (apyExisting === 0) {
    await prisma.apySource.createMany({
      data: [
        { name: 'DeFiLlama', url: 'https://yields.llama.fi/pools', enabled: true },
      ],
    });
  }
}

async function main() {
  await ensureSeedData();

  // Jobs
  const newsCron = process.env.NEWS_POLL_CRON || '*/5 * * * *';
  const apyCron = process.env.APY_POLL_CRON || '0 * * * *';

  cron.schedule(newsCron, async () => {
    await pollNewsOnce({
      pushFn: async ({ title, url, score }) => {
        // For MVP, push to default telegram only if configured.
        await pushTelegram(`📰 ${title}\nscore=${score}\n${url}`);
      },
    });
  });

  cron.schedule(apyCron, async () => {
    await pollApyOnce();
  });

  // kick once at boot
  pollNewsOnce().catch(() => {});
  pollApyOnce().catch(() => {});

  const port = Number(process.env.PORT || 8787);
  app.listen(port, () => console.log(`YieldNewsHub server listening on :${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
