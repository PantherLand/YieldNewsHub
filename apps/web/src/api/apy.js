import { API_BASE, ENDPOINTS } from '../config/index.js';

export async function fetchApyData(limit = 50) {
  const response = await fetch(`${API_BASE}${ENDPOINTS.apy}?limit=${limit}`);
  const json = await response.json();
  return json.data?.items || json.items || [];
}
