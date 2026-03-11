import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { config } from './config/index.js';
import { errorHandler } from './api-utils.js';
import { ensureSeedData } from './bootstrap.js';
import { startScheduler, runInitialFetch } from './scheduler.js';
import { exitIfRssThresholdExceeded } from './process-monitor.js';

// Routes
import {
  newsRoutes,
  apyRoutes,
  strategyRoutes,
  integrationsRoutes,
  adminRoutes,
} from './routes/index.js';

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: config.webOrigin,
    credentials: true,
  })
);

// Health check
app.get('/healthz', (_req, res) => {
  const threshold = exitIfRssThresholdExceeded('healthz');
  const { rssMb, thresholdMb, exceeded } = threshold;

  if (exceeded) {
    return res.status(507).json({
      success: false,
      data: {
        ok: false,
        reason: 'rss_threshold_exceeded_exit_scheduled',
        rssMb,
        thresholdMb,
      },
    });
  }

  return res.json({
    success: true,
    data: {
      ok: true,
      rssMb,
      thresholdMb,
    },
  });
});

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/apy', apyRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api', adminRoutes); // sources, cex-links, cache, jobs

// Global error handler (must be last middleware)
app.use(errorHandler);

// Bootstrap and start server
async function main() {
  await ensureSeedData();

  // Start scheduled jobs
  startScheduler();

  // Run initial data fetch
  await runInitialFetch();

  // Start listening
  app.listen(config.port, () => {
    console.log(`YieldNewsHub server listening on :${config.port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
