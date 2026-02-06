import { prisma } from './db.js';
import { DEFAULT_NEWS_SOURCES } from './constants/index.js';

/**
 * Ensure seed data exists in the database
 * - News sources: sync to add new sources while keeping existing ones
 * - APY sources: create default DeFiLlama source if none exists
 */
export async function ensureSeedData() {
  // News sources - sync to add new sources while keeping existing ones
  console.log('[bootstrap] Syncing news sources...');
  const existingSources = await prisma.newsSource.findMany();
  const existingNames = new Set(existingSources.map(s => s.name));

  for (const source of DEFAULT_NEWS_SOURCES) {
    if (!existingNames.has(source.name)) {
      await prisma.newsSource.create({ data: source });
      console.log(`[bootstrap] + Added news source: ${source.name}`);
    }
  }

  const totalSources = await prisma.newsSource.count();
  console.log(`[bootstrap] ✓ ${totalSources} news sources ready`);

  // APY sources
  const apyExisting = await prisma.apySource.count();
  if (apyExisting === 0) {
    await prisma.apySource.createMany({
      data: [
        { name: 'DeFiLlama', url: 'https://yields.llama.fi/pools', enabled: true },
      ],
    });
    console.log('[bootstrap] + Added APY source: DeFiLlama');
  }
}

export default ensureSeedData;
