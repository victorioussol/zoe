---
name: xd5-monitor
description: XD5 WiFi router monitoring. Alerts are sent via webhook to Telegram. Explain how to configure the router or external sender to POST to the worker XD5 webhook.
---

# XD5 Monitor Skill

Monitors Asus ZenWiFi XD5 router for WiFi connectivity issues.

## Overview

XD5 events (disassociation, roaming, weak signal) are sent to Telegram via a webhook. The router or an external service must POST to:

- **URL:** `https://<worker>.<subdomain>.workers.dev/api/webhooks/xd5`
- **Header:** `X-XD5-Secret: <XD5_WEBHOOK_SECRET>`
- **Body (JSON):** `{ "events": [ { "type": "disassoc"|"roamast"|"weak_signal", "mac": "...", "rssi": number, "message": "..." } ] }`

Secrets: `XD5_WEBHOOK_SECRET`, `XD5_ALERT_CHAT_ID` (Telegram chat ID for alerts).

## Commands

- "estado XD5" - Explain XD5 monitoring and webhook setup
- "alertas XD5" - How to get alerts (pair device and set XD5_ALERT_CHAT_ID)
- "configurar XD5 webhook" - Webhook URL and header instructions

## Notes

- Alerts are delivered to the Telegram chat ID set in `XD5_ALERT_CHAT_ID`.
- User can get their chat ID by messaging @userinfobot on Telegram.
