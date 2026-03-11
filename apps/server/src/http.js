import fetch from 'node-fetch';
import { config } from './config/index.js';

export async function fetchWithTimeout(url, options = {}, timeoutMs = config.network.requestTimeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`request timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJsonWithTimeout(url, options = {}, timeoutMs = config.network.requestTimeoutMs) {
  const res = await fetchWithTimeout(url, options, timeoutMs);
  if (!res.ok) {
    throw new Error(`request failed (${res.status}): ${url}`);
  }
  return res.json();
}

export async function fetchTextWithTimeout(url, options = {}, timeoutMs = config.network.requestTimeoutMs) {
  const res = await fetchWithTimeout(url, options, timeoutMs);
  if (!res.ok) {
    throw new Error(`request failed (${res.status}): ${url}`);
  }
  return res.text();
}

