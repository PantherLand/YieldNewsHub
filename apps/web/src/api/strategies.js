import { API_BASE, STRATEGY_ENDPOINTS } from '../config/index.js';

export async function fetchStrategies(top = 10) {
  const responses = await Promise.all(
    STRATEGY_ENDPOINTS.map((path) => fetch(`${API_BASE}${path}?top=${top}`))
  );
  const payloads = await Promise.all(responses.map((r) => r.json()));
  return payloads.map((j) => j.data || null).filter(Boolean);
}
