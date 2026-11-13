# Ideamart MCP — User Guide

Connect your AI coding assistant to Ideamart APIs via MCP. Send SMS, manage subscriptions, handle USSD sessions, charge subscribers, query locations, and verify identities via OTP.

**MCP URL:** `https://mcp.ideamart.io/ideamart/mcp`

---

## Ask the Ideamart Docs Assistant

The documentation site includes an **Ask Ideamart** chatbot in the bottom-right corner.
It discovers the `ideamart_docs` MCP tool and uses it to look up guidance about APIs,
callbacks, status codes, number masking, and integration rules.

The assistant is documentation-only: it does not send SMS, change subscriptions, or
charge a subscriber. The static webpage sends requests to a same-origin
`/api/ideamart-mcp` proxy, which adds MCP authorization server-side. Configure the
deployment secret `IDEAMART_MCP_AUTHORIZATION` as `Bearer <your-mcp-token>`; never put
that value in browser JavaScript, Markdown, or the repository. The VS Code MCP clients
can continue using the prompted token in `.vscode/mcp.json`.

If MCP is temporarily unavailable, the assistant falls back to the generated MkDocs search
index and returns relevant passages from this documentation. This fallback is local to the
site and does not require another API key or plugin.

---

## Prerequisites

1. **MCP Token** — Get one at `https://mcp.ideamart.io/auth/login`
2. **Ideamart Application ID** — Your registered app ID from Ideamart portal
3. **Application Password** — Your app's password
4. **IP Whitelist** — MCP server IP `54.255.44.189` must be whitelisted for your app

---

## Critical Rules

These are non-negotiable. Getting any wrong causes real damage:

1. **Branch on `statusCode`, NEVER HTTP status** — Ideamart returns HTTP 200 for failures. Always check `statusCode === "S1000"`.
2. **`destinationAddresses` is ALWAYS an ARRAY** — Even for one recipient. Sending a string fails silently.
3. **Never hardcode `applicationId` or `password`** — Environment variables only.
4. **Never retry a debit with a fresh `externalTrxId`** — Double-charges a real person.
5. **Never call Ideamart from client-side code** — Backend only. IP whitelisting is enforced.
6. **Treat `subscriberId` as opaque** — With masking, it's a hash. Don't parse or assume format.
7. **Acknowledge callbacks BEFORE doing work** — Respond `{"statusCode":"S1000"}` immediately.
8. **Never disable TLS verification** — No `rejectUnauthorized: false`.
9. **Guard `tel:all` broadcasts** — Sanity-check base size first.
10. **Set explicit timeouts** — 10-15 seconds on every HTTP call.
11. **Never log secrets** — Never log password, OTP, referenceNo, or unmasked subscriberId.
12. **Use decimal types for money** — Never binary float.
13. **Retry only transient codes** — Exponential backoff with jitter, capped, then dead-letter.

---

## Setup

Add to your MCP client config (Kiro, Claude Desktop, Cursor, VS Code):

```json
{
  "mcpServers": {
    "ideamart": {
      "url": "https://mcp.ideamart.io/ideamart/mcp",
      "headers": { "Authorization": "Bearer mcp_your_token_here" }
    }
  }
}
```

---

## Credential Model

Every Ideamart API call carries credentials in the JSON body (not headers):
- `applicationId` — Your app ID
- `password` — Your app password

No OAuth, no tokens, no Authorization header. Just these two fields in every request.

---

## Available Tools (11)

| Tool | Purpose |
|------|---------|
| `ideamart_sms_send` | Send SMS to subscribers |
| `ideamart_sms_receive_parse` | Parse inbound SMS webhook payload |
| `ideamart_subscription_subscribe` | Subscribe a user (opt-in) |
| `ideamart_subscription_status_check` | Check subscription status |
| `ideamart_subscription_unsubscribe` | Unsubscribe a user (opt-out) |
| `ideamart_query_base` | Query subscriber base count |
| `ideamart_lbs_query` | Query subscriber location |
| `ideamart_ussd_send` | Send/respond to USSD session |
| `ideamart_ussd_receive_parse` | Parse inbound USSD webhook payload |
| `ideamart_ip_check` | Check MCP server's outgoing IP |
| `ideamart_docs` | Get API documentation by topic |

---

## Number Masking

By DEFAULT, all Ideamart apps have number masking ENABLED. You never see real phone numbers.

**Masked format:** `tel:hu3b84346f63899a32ec742a666503a02a4dffe4f5`

### How to get a masked MSISDN:

**Method 1 — Mobile-Initiated Request (recommended):**
- Subscriber texts your shortcode → `sourceAddress` in callback = masked MSISDN
- Subscriber dials your USSD code → `sourceAddress` in callback = masked MSISDN
- Use https://echo.idmrt.dev/ to capture without running your own server

**Method 2 — OTP Flow (for web/app users):**
1. Call OTP Request with plain MSISDN → get `referenceNo`
2. Subscriber receives PIN via SMS
3. Call OTP Verify with `referenceNo` + PIN → get masked `subscriberId`

### Key rules:
- You CANNOT construct a masked number — must receive from platform
- Each masked number is unique per-app (same subscriber = different hash per app)
- The masked MSISDN is stable — same subscriber always maps to same hash
- Store masked numbers in your database once obtained

---

## MSISDN Format

- Correct: `tel:94771234567` (no +, no spaces)
- Masked: `tel:hu3b84346f...` (pass as-is, treat as opaque)
- Broadcast: `tel:all` (entire subscriber base — guard carefully)

### Operators (Sri Lanka)

| Operator | Prefixes |
|----------|----------|
| Dialog | 070, 076, 077 |
| Hutch | 072, 078 |
| Airtel | 075 |

---

## SMS Send

Each API call shows **Minimum** (required only) and **Comprehensive** (all fields).

### Minimum:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "message": "Hello",
  "destinationAddresses": ["tel:94771234567"]
}
```

### Comprehensive:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "version": "1.0",
  "message": "Hello world",
  "destinationAddresses": ["tel:94771234567", "tel:94772345678"],
  "sourceAddress": "tel:77123",
  "deliveryStatusRequest": "1",
  "encoding": "240",
  "chargingAmount": "5.00",
  "binaryHeader": "0605040B8423F0"
}
```

### Fields:
| Field | Required | Description |
|-------|----------|-------------|
| applicationId | Yes | App ID |
| password | Yes | App password |
| message | Yes | Message body |
| destinationAddresses | Yes | ARRAY of tel: addresses. `tel:all` = broadcast |
| version | No | API version, defaults to latest |
| sourceAddress | No | Sender shown to user. Must be provisioned alias (E1331 if wrong) |
| deliveryStatusRequest | No | "0"=none (default), "1"=request DLR callback |
| encoding | No | "0"=Text, "240"=Flash, "245"=Binary (hex-encoded) |
| chargingAmount | No | Variable-charge amount per SMS (string, LKR) |
| binaryHeader | No | Hex UDH for binary messages (only with encoding "245") |

### Rules:
- `destinationAddresses` is ALWAYS an array, even for one recipient
- Multi-recipient sends can partially succeed — check each `destinationResponse`
- 160 chars GSM-7, 70 chars Sinhala/Tamil (UCS-2) per segment

---

## SMS Receive (MO Callback)

When a subscriber texts your shortcode:

```json
{
  "message": "SUBSCRIBE",
  "sourceAddress": "tel:hu3b84346f63899a...",
  "applicationId": "APP_XXXXXX",
  "requestId": "22607072011552911",
  "encoding": "0",
  "version": "1.0"
}
```

- `sourceAddress` = masked MSISDN — **store this** for future API calls
- Respond: `{"statusCode": "S1000", "statusDetail": "Success"}`
- Recognise STOP/UNSUB/OFF → call Unregister
- Deduplicate on: `requestId`

Use `ideamart_sms_receive_parse` tool to parse these payloads.

---

## SMS Delivery Report (DLR Callback)

Fires after sending with `deliveryStatusRequest: "1"`:

```json
{
  "destinationAddress": "tel:...",
  "timeStamp": "20120113082110",
  "requestId": "MSG_000111",
  "deliveryStatus": "DELIVERED"
}
```

Status values (accept BOTH forms):
- Long: DELIVERED, EXPIRED, DELETED, UNDELIVERABLE, ACCEPTED, UNKNOWN, REJECTED
- Short (SMPP): DELIVRD, UNDELIV, ACCEPTD, REJECTD

ACCEPTED ≠ DELIVERED. Reports can arrive out of order, late, twice, or never.

---

## USSD Send

### Minimum:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "message": "1. Balance\n2. Help",
  "sessionId": "1330929317043",
  "ussdOperation": "mt-cont",
  "destinationAddress": "tel:94771234567"
}
```

### Comprehensive:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "version": "1.0",
  "message": "1. Balance\n2. Help\n3. Exit",
  "sessionId": "1330929317043",
  "ussdOperation": "mt-cont",
  "destinationAddress": "tel:94771234567",
  "encoding": "440"
}
```

### Operations:
- `mt-init` — App starts a new session to subscriber
- `mt-cont` — Continue session (show menu, wait for input)
- `mt-fin` — End session (final message, close)

### Rules:
- ECHO the platform's `sessionId` — never generate your own
- Terminal screens MUST use `mt-fin` or session hangs
- Plain ASCII only (encoding 440) — no emoji, no Sinhala/Tamil
- Reply FAST — sessions timeout in seconds
- Session state: Redis with ~2 min TTL (NOT in-process Map)

---

## USSD Receive (Callback)

```json
{
  "message": "*789#",
  "sessionId": "1330929317043",
  "sourceAddress": "tel:hu3b84346f...",
  "applicationId": "APP_XXXXXX",
  "ussdOperation": "mo-init",
  "vlrAddress": "tel:...",
  "encoding": "440",
  "requestId": "1330933229901",
  "version": "1.0"
}
```

- `mo-init` = user just dialed your code
- `mo-cont` = user replied to menu
- Respond with S1000, then send screen via `/ussd/send`

Use `ideamart_ussd_receive_parse` tool to parse.

---

## Subscription

### Register (opt-in)

**Minimum:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567",
  "action": "1"
}
```

Response includes `subscriptionStatus`: REGISTERED, UNREGISTERED, PENDING, or PENDING CHARGE.
- E1351 (already registered) = SUCCESS — desired state holds
- PENDING = not active yet, wait for notification
- Only call with explicit recorded consent

### Unregister (opt-out)

```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567",
  "action": "0"
}
```

- E1356 (not registered) = SUCCESS — desired state holds
- Must be as easy as register (STOP/UNSUB/OFF keywords)

### Check Status

```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567"
}
```

Use for reconciliation, not per-request gate. Mirror state from notification callback.

### Query Base

```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password"
}
```

Returns `baseSize` (string — parse before arithmetic). Best smoke test — no subscriber needed.

### Subscription Notification (Callback)

```json
{
  "applicationId": "APP_XXXXXX",
  "subscriberId": "tel:hu3b84346f...",
  "status": "REGISTERED",
  "frequency": "Monthly",
  "version": "1.0",
  "timeStamp": "20260811120000"
}
```

AUTHORITATIVE source of subscription state. Mirror locally.

---

## OTP (One-Time PIN)

Use when subscriber interacts via web/app (not SMS/USSD) and you need their masked MSISDN.

### OTP Request

**Minimum:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567"
}
```

**Comprehensive:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567",
  "applicationHash": "y3b84346f63899a",
  "applicationMetaData": {
    "client": "MOBILEAPP",
    "device": "Samsung S10",
    "os": "android8",
    "appCode": "https://play.google.com/store/apps/details?id=lk.example.app"
  }
}
```

Returns `referenceNo` — keep server-side only, never send to client.

### OTP Verify

```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "referenceNo": "3b84346f63899a32ec742a676532ec74dffe4f5",
  "otp": "123456"
}
```

Returns `subscriberId: "tel:hu3b84346f..."` — the masked MSISDN. Store for all future API calls.

### OTP Rules:
- Rate-limit per number AND per IP (prevents SMS-bombing)
- OTP valid 60 minutes
- Max 3 attempts per OTP
- Never log OTP or referenceNo
- E1850=Invalid, E1851=Expired, E1852=Max attempts, E1853=No active OTP

---

## CaaS (Carrier Billing / Charging)

### Direct Debit

⚠️ **MOVES REAL MONEY**

**Minimum:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "externalTrxId": "unique-id-max-32-chars",
  "subscriberId": "tel:94771234567",
  "amount": "50.00"
}
```

**Comprehensive:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "externalTrxId": "unique-id-max-32-chars",
  "subscriberId": "tel:94771234567",
  "amount": "50.00",
  "currency": "LKR",
  "paymentInstrument": "MobileAccount",
  "accountId": "12345"
}
```

### Critical charging rules:
- Persist `externalTrxId` BEFORE the HTTP call — it's the idempotency key
- NEVER retry with a fresh `externalTrxId` (double-charge)
- E1379 = already completed = SUCCESS (don't charge again)
- E1406 = user rejected = NEVER retry
- E1378 = insufficient balance — tell user, retry later
- Amount from server config, NEVER from client input
- Use decimal type, never float

### Balance Query

**Minimum:**
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567"
}
```

Returns `chargeableBalance` (string — parse as decimal). Advisory only.

### Charging Notification (Callback)

```json
{
  "externalTrxId": "your-id",
  "internalTrxId": "PAY_00019283",
  "subscriberId": "tel:94771234567",
  "amount": "6.00",
  "currency": "LKR",
  "statusCode": "S1000",
  "statusDetail": "Success",
  "timeStamp": "2026-03-14T09:21:44.000+0530"
}
```

Reconcile by `externalTrxId`. Deduplicate on `externalTrxId + statusCode`.

---

## LBS (Location)

**Endpoint:** `https://api.dialog.lk/lbs/locate` (different host!)

### Minimum:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567",
  "serviceType": "IMMEDIATE"
}
```

### Comprehensive:
```json
{
  "applicationId": "APP_XXXXXX",
  "password": "your-password",
  "subscriberId": "tel:94771234567",
  "serviceType": "IMMEDIATE",
  "version": "2.0",
  "responseTime": "NO_DELAY",
  "horizontalAccuracy": "100",
  "freshness": "HIGH_LOW"
}
```

### Rules:
- Uses `api.dialog.lk`, NOT `api.ideamart.io`
- Omit QoS fields unless you know your provisioned level (E1367 if too high)
- Coordinates are strings, ABSENT on failure
- Sanity-check: Sri Lanka lat ~6-10, lon ~79-82
- Requires explicit location consent (SMS consent ≠ location consent)

---

## Webhook Testing with Echo2

Echo2 (https://echo.idmrt.dev/) captures MO requests without running your own server.

### Capture SMS MO Request:

1. **Create Echo2 session** — Go to https://echo.idmrt.dev/ → Create Session → get unique callback URL
2. **Set in Ideamart Portal** — Your App → Settings → SMS Callback URL → paste Echo2 URL
3. **Trigger** — Text your keyword to your short code from a real phone
4. **View on Echo2** — Payload appears in real-time:
   ```json
   {
     "message": "HELLO",
     "sourceAddress": "tel:hu3b84346f63899a...",
     "applicationId": "APP_XXXXXX",
     "requestId": "22607072011552911",
     "encoding": "0",
     "version": "1.0"
   }
   ```
5. **Extract** — `sourceAddress` is your masked MSISDN. Use it for all API calls.

### Capture USSD MO Request:

1. Set Echo2 URL as USSD Callback URL in portal
2. Dial your USSD code (e.g. `*789#`) from a phone
3. Echo2 captures:
   ```json
   {
     "message": "*789#",
     "sessionId": "1330929317043",
     "sourceAddress": "tel:hu3b84346f...",
     "ussdOperation": "mo-init",
     "applicationId": "APP_XXXXXX"
   }
   ```

### Capture Subscription Notification:

1. Set Echo2 URL as Subscription Notification URL in portal
2. When subscriber registers, Echo2 captures:
   ```json
   {
     "subscriberId": "tel:hu3b84346f...",
     "status": "REGISTERED",
     "frequency": "Monthly"
   }
   ```

---

## Callbacks Summary

| Callback | Dedupe Key | What You Get |
|----------|-----------|--------------|
| SMS MO | requestId | Masked MSISDN + message |
| SMS DLR | requestId + deliveryStatus | Delivery outcome |
| USSD Receive | requestId | Masked MSISDN + sessionId + user input |
| Subscription | subscriberId + status + timeStamp | State changes |
| Charging | externalTrxId + statusCode | Charge reconciliation |

**All callbacks:** Respond `{"statusCode":"S1000"}` immediately → process async → idempotent → validate applicationId.

---

## Status Codes

### Success & Benign:
| Code | Meaning |
|------|---------|
| S1000 | Success |
| E1351 | Already registered (treat as SUCCESS for subscribe) |
| E1356 | Not registered (treat as SUCCESS for unsubscribe) |
| E1379 | Already completed (treat as SUCCESS for debit) |

### Configuration (fix portal):
| Code | Meaning |
|------|---------|
| E1303 | IP not whitelisted |
| E1309 | Service not provisioned |
| E1313 | Auth failure (wrong credentials or inactive) |
| E1331 | Source address not provisioned |

### User-state (don't retry in loop):
| Code | Meaning |
|------|---------|
| E1343 | Not whitelisted (Limited Production) |
| E1378 | Insufficient balance |
| E1405 | Charge authorization timed out |
| E1406 | User rejected charge (NEVER retry) |

### OTP:
| Code | Meaning |
|------|---------|
| E1850 | Invalid OTP (max 3 attempts) |
| E1851 | OTP expired (60 min) |
| E1852 | Max attempts reached |
| E1853 | No active OTP for reference |

---

## Common Mistakes

| Mistake | Consequence |
|---------|-------------|
| `if (response.ok) return "sent"` | Every error reported as success |
| `destinationAddresses: "tel:94..."` | Must be ARRAY — fails silently |
| Hardcoded credentials | In git, can charge subscribers |
| Retry debit with new externalTrxId | Double-charges a real person |
| Self-generated USSD sessionId | Sessions orphan, screen blank |
| USSD state in in-process Map | Breaks on scale — use Redis |
| Process before callback ack | Timeouts, duplicates |
| `rejectUnauthorized: false` | Credentials interceptable |
| E1351/E1356/E1379 as failure | Working flows reported broken |

---

## IP Whitelisting

Every Ideamart app requires whitelisting the calling server's IP:
- **MCP Server IP:** `54.255.44.189`
- Check your IP: Use `ideamart_ip_check` tool or `curl -4 https://myip.ideamart.io`
- Add in: Ideamart Portal → Your App → Settings → Allowed Host Addresses
- Without it: all calls fail with E1303

---

## Environment Variables Pattern

```bash
IDEAMART_APP_ID=APP_XXXXXX
IDEAMART_PASSWORD=replace-me

# Uncomment only what is provisioned:
#IDEAMART_SMS_SEND_URL=https://api.ideamart.io/sms/send
#IDEAMART_USSD_SEND_URL=https://api.ideamart.io/ussd/send
#IDEAMART_SUBSCRIPTION_SEND_URL=https://api.ideamart.io/subscription/send
#IDEAMART_CAAS_DEBIT_URL=https://api.ideamart.io/caas/direct/debit
#IDEAMART_LBS_URL=https://api.dialog.lk/lbs/locate
#IDEAMART_OTP_REQUEST_URL=https://api.ideamart.io/subscription/otp/request
#IDEAMART_OTP_VERIFY_URL=https://api.ideamart.io/subscription/otp/verify
```

An unset URL means that API is not enabled — refuse locally rather than getting E1309.

---

## Quick Smoke Test

```bash
curl -sS -X POST https://api.ideamart.io/subscription/query-base \
  -H 'Content-Type: application/json' \
  -d '{"applicationId":"APP_XXXXXX","password":"your-password"}'
```

If you get `S1000` with `baseSize`, credentials and IP are correct.

---

## Retry Discipline

- Retry ONLY transient codes (E1316, E1332, E1341, E1600-E1603) and transport errors
- Exponential backoff: base 1s, factor 2, jitter ±30%, max 5 attempts
- After max → dead-letter queue for manual review
- NEVER retry configuration errors
- NEVER retry user-state errors in tight loop
- NEVER retry debit with new externalTrxId

---

## Tips

- Provide `application_id` and `password` once per session — the AI remembers them
- Parsing tools (`sms_receive_parse`, `ussd_receive_parse`) are offline — no API calls
- Use `ideamart_docs` tool with topic filter for quick reference (topics: sms, otp, charging, masking, status, rules, mistakes, retry)
- Use `ideamart_ip_check` to verify the MCP server's outgoing IP
- The AI can chain workflows (parse SMS → check subscription → send reply → charge)

---

## Support

- **Portal:** https://portal.ideamart.io
- **Docs:** https://docs.ideamart.io
- **Email:** info@ideamart.io
- **WhatsApp:** +94767412345
- Always quote `requestId` / `externalTrxId` / `sessionId` + `statusCode` when contacting support
