import { config } from './config/index.js';

let rssExitScheduled = false;

export function getRssMb() {
  return Number((process.memoryUsage().rss / (1024 * 1024)).toFixed(1));
}

export function getRssThresholdMb() {
  return config.monitoring.rssExitThresholdMb;
}

export function isRssThresholdExceeded(rssMb = getRssMb()) {
  const thresholdMb = getRssThresholdMb();
  return Number.isFinite(thresholdMb) && rssMb >= thresholdMb;
}

export function exitIfRssThresholdExceeded(context = 'runtime') {
  const rssMb = getRssMb();
  const thresholdMb = getRssThresholdMb();
  if (!Number.isFinite(thresholdMb) || rssMb < thresholdMb) {
    return { exceeded: false, rssMb, thresholdMb };
  }

  if (!rssExitScheduled) {
    rssExitScheduled = true;
    console.error(
      `[memory] RSS threshold exceeded (${rssMb}MB >= ${thresholdMb}MB) in ${context}. Exiting process...`
    );
    // Exit asynchronously so logs/HTTP response can flush.
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }

  return { exceeded: true, rssMb, thresholdMb };
}

