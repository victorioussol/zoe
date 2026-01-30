import { Hono } from 'hono';
import type { AppEnv } from '../types';
import { MOLTBOT_PORT } from '../config';
import { findExistingMoltbotProcess } from '../gateway';

/**
 * Public routes - NO Cloudflare Access authentication required
 * 
 * These routes are mounted BEFORE the auth middleware is applied.
 * Includes: health checks, static assets, and public API endpoints.
 */
const publicRoutes = new Hono<AppEnv>();

// GET /sandbox-health - Health check endpoint
publicRoutes.get('/sandbox-health', (c) => {
  return c.json({
    status: 'ok',
    service: 'moltbot-sandbox',
    gateway_port: MOLTBOT_PORT,
  });
});

// GET /logo.png - Serve logo from ASSETS binding
publicRoutes.get('/logo.png', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// GET /logo-small.png - Serve small logo from ASSETS binding
publicRoutes.get('/logo-small.png', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// GET /api/status - Public health check for gateway status (no auth required)
publicRoutes.get('/api/status', async (c) => {
  const sandbox = c.get('sandbox');
  
  try {
    const process = await findExistingMoltbotProcess(sandbox);
    if (!process) {
      return c.json({ ok: false, status: 'not_running' });
    }
    
    // Process exists, check if it's actually responding
    // Try to reach the gateway with a short timeout
    try {
      await process.waitForPort(18789, { mode: 'tcp', timeout: 5000 });
      return c.json({ ok: true, status: 'running', processId: process.id });
    } catch {
      return c.json({ ok: false, status: 'not_responding', processId: process.id });
    }
  } catch (err) {
    return c.json({ ok: false, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// GET /_admin/assets/* - Admin UI static assets (CSS, JS need to load for login redirect)
// Assets are built to dist/client with base "/_admin/"
publicRoutes.get('/_admin/assets/*', async (c) => {
  const url = new URL(c.req.url);
  // Rewrite /_admin/assets/* to /assets/* for the ASSETS binding
  const assetPath = url.pathname.replace('/_admin/assets/', '/assets/');
  const assetUrl = new URL(assetPath, url.origin);
  return c.env.ASSETS.fetch(new Request(assetUrl.toString(), c.req.raw));
});

// POST /api/webhooks/xd5 - XD5 router events (public; auth via X-XD5-Secret header)
// Body: { "events": [ { "type": "disassoc"|"roamast"|"weak_signal", "mac"?: string, "rssi"?: number, "message"?: string } ] }
publicRoutes.post('/api/webhooks/xd5', async (c) => {
  const secret = c.req.header('X-XD5-Secret');
  if (!c.env.XD5_WEBHOOK_SECRET || secret !== c.env.XD5_WEBHOOK_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  if (!c.env.TELEGRAM_BOT_TOKEN || !c.env.XD5_ALERT_CHAT_ID) {
    return c.json({ error: 'XD5 alerts not configured' }, 503);
  }
  let body: { events?: Array<{ type?: string; mac?: string; rssi?: number; message?: string }> };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
  const events = body?.events ?? [];
  if (events.length === 0) {
    return c.json({ ok: true, sent: 0 });
  }
  const lines = events.map((e) => {
    const parts = [e.type ?? 'event', e.mac ?? '', e.rssi != null ? `RSSI ${e.rssi}` : '', e.message ?? ''].filter(Boolean);
    return parts.join(' ');
  });
  const text = `XD5: ${lines.join('\n')}`;
  const chatId = c.env.XD5_ALERT_CHAT_ID;
  const token = c.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[XD5 webhook] Telegram send failed:', res.status, err);
      return c.json({ error: 'Telegram send failed' }, 502);
    }
  } catch (err) {
    console.error('[XD5 webhook] fetch failed:', err);
    return c.json({ error: 'Telegram request failed' }, 502);
  }
  return c.json({ ok: true, sent: 1 });
});

export { publicRoutes };
