import { prisma } from './db.js';
import { fetchWithTimeout } from './http.js';

export async function getTelegramIntegration() {
  // Prefer DB-configured integration; fall back to env.
  const db = await prisma.telegramIntegration.findFirst({ where: { enabled: true } });
  if (db) return { botToken: db.botToken, chatId: db.chatId };

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (botToken && chatId) return { botToken, chatId };
  return null;
}

export async function pushTelegram(text) {
  const integ = await getTelegramIntegration();
  if (!integ) return { ok: false, reason: 'no_telegram_integration' };

  const url = `https://api.telegram.org/bot${integ.botToken}/sendMessage`;
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: integ.chatId, text, disable_web_page_preview: true }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false, status: res.status, body };
  }

  // Ensure response body is consumed so resources are released promptly.
  await res.text().catch(() => '');
  return { ok: true };
}
