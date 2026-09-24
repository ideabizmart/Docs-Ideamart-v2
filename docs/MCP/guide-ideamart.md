# Ideamart MCP — User Guide

A practical guide for using the Ideamart MCP tools from your AI assistant.

## Prerequisites

1. **MCP Token** — Get one at `https://mcp.ideamart.io/auth/login`
2. **Ideamart Application ID** — Your registered app ID from Ideamart portal
3. **Application Password** — Your app's password/access token
4. **IP Whitelist** — Your MCP server's outgoing IP must be whitelisted for each app (contact Ideamart support)

## Important: Number Masking

By default, Ideamart apps have **number masking enabled**. This means:
- MSISDNs in API responses are **hashed/anonymized** (not real numbers)
- Inbound SMS/USSD payloads will contain masked sender numbers
- To get real MSISDNs, disable masking in your Ideamart app settings

The MCP server handles masked numbers as-is — you'll see them in tool responses.

## Setup

Add to your MCP client config (Kiro, Claude Desktop, Cursor):

```json
{
  "mcpServers": {
    "ideamart": {
      "type": "streamable-http",
      "url": "https://mcp.ideamart.io/ideamart/mcp",
      "headers": { "Authorization": "Bearer mcp_your_token_here" }
    }
  }
}
```

## Credential Model

Unlike Ideabiz (which uses OAuth2 tokens), Ideamart uses **per-request credentials**:
- Every tool call requires `application_id` + `password`
- No separate token renewal step
- The AI will include these in each call

---

## Common Workflows

### Send an SMS

```
You: "Send SMS 'Welcome to our service' to 94771234567 using app APP001"

AI calls:
ideamart_sms_send → {
  to_msisdn: "tel:+94771234567",
  message: "Welcome to our service",
  application_id: "APP001",
  password: "your_app_password"
}
```

### Parse an Incoming SMS

When you receive an inbound SMS webhook payload from Ideamart:

```
You: "Parse this incoming SMS payload: { sourceAddress: 'tel:+94771234567', message: 'SUBSCRIBE', applicationId: 'APP001', requestId: 'req123' }"

AI calls:
ideamart_sms_receive_parse → {
  raw_payload: { sourceAddress: "tel:+94771234567", message: "SUBSCRIBE", applicationId: "APP001", requestId: "req123" }
}

Returns: from_msisdn, message, application_id, request_id, timestamp
```

### Subscribe a User

```
You: "Subscribe 94771234567 to app APP001"

AI calls:
ideamart_subscription_subscribe → {
  msisdn: "tel:+94771234567",
  application_id: "APP001",
  password: "your_app_password",
  action: "SUBSCRIBE"
}
```

### Check Subscription Status

```
You: "Is 94771234567 subscribed to APP001?"

AI calls:
ideamart_subscription_status_check → {
  msisdn: "tel:+94771234567",
  application_id: "APP001",
  password: "your_app_password"
}
```

### Unsubscribe a User

```
You: "Unsubscribe 94771234567 from APP001, reason: user requested"

AI calls:
ideamart_subscription_unsubscribe → {
  msisdn: "tel:+94771234567",
  application_id: "APP001",
  password: "your_app_password",
  reason: "user requested"
}
```

### Query Subscriber Base

```
You: "Show me all subscribed users for APP001"

AI calls:
ideamart_query_base → {
  application_id: "APP001",
  password: "your_app_password",
  query_type: "SUBSCRIBED",
  limit: 50
}
```

Available query types: `REGISTERED`, `SUBSCRIBED`, `UNSUBSCRIBED`

### Query Location (LBS)

```
You: "Get location of 94771234567"

AI calls:
ideamart_lbs_query → {
  msisdn: "tel:+94771234567",
  application_id: "APP001",
  password: "your_app_password"
}
```

Note: Location may not be available for all subscribers. Results depend on network capabilities.

### USSD Session

#### Send/respond to USSD

```
You: "Send USSD menu to 94771234567, session abc123, message '1. Balance\n2. Help'"

AI calls:
ideamart_ussd_send → {
  session_id: "abc123",
  msisdn: "tel:+94771234567",
  application_id: "APP001",
  message: "1. Balance\n2. Help",
  operation: "mt-cont",
  password: "your_app_password"
}
```

USSD operations:
- `mt-cont` — Continue session (show menu, wait for input)
- `mt-fin` — End session (final message)

#### Parse Incoming USSD

```
You: "Parse this USSD payload: { sessionId: 'abc123', sourceAddress: 'tel:+94771234567', message: '1', applicationId: 'APP001', ussdOperation: 'mo-init' }"

AI calls:
ideamart_ussd_receive_parse → {
  raw_payload: { sessionId: "abc123", sourceAddress: "tel:+94771234567", message: "1", applicationId: "APP001", ussdOperation: "mo-init" }
}

Returns: session_id, msisdn, user_input, application_id, operation, timestamp
```

---

## MSISDN Format

Ideamart accepts:
- `tel:+94771234567` (preferred)
- `+94771234567`
- `94771234567`
- `0771234567`
- Masked/hashed strings (if number masking enabled)

## Environments

All tools accept an optional `environment` parameter:
- `prod` (default) — Production (`ideamart.io`)
- `uat` — UAT environment
- `dev` — Development

## Error Handling

| Status Code | Meaning | Fix |
|-------------|---------|-----|
| S1000 | Success | Request processed successfully |
| E1303 | IP not whitelisted | Add server IP to app's allowed hosts in Ideamart portal |
| E1351 | Already registered | User is already subscribed |
| E1367 | QOS not supported | LBS not enabled for this app |
| Unauthorized | MCP token invalid/expired | Get new token at `/auth/login` |
| Invalid credentials | Wrong app_id or password | Check Ideamart portal for correct values |

> **Note:** Ideamart returns HTTP 200 even on errors. Always check the `statusCode` field in the response body.

## API Endpoints Reference

| Tool | Endpoint | Method |
|------|----------|--------|
| SMS Send | `/sms/send` | POST |
| Subscription (subscribe/unsubscribe) | `/subscription/send` | POST |
| Subscription Status | `/subscription/getStatus` | POST |
| Query Base | `/subscription/query-base` | POST |
| LBS Location | `/lbs/locate` | POST |
| USSD Send | `/ussd/send` | POST |

Base URL: `https://api.ideamart.io`

## Tips

- You can provide `application_id` and `password` once — the AI remembers them during the session
- Parsing tools (`sms_receive_parse`, `ussd_receive_parse`) are offline — they don't make API calls, just parse JSON
- If you're getting masked MSISDNs and need real ones, ask your Ideamart admin to disable number masking for your app
- The AI can chain workflows (e.g., parse incoming SMS → check subscription → send reply)
- Use `query_base` to list all subscribers for an app

## IP Whitelisting

Each Ideamart app must have the MCP server's outgoing IP registered. Without this:
- All API calls return error `E1303`: "IP address not listed in allowed-host-address list"
- This is per-app — you need to whitelist for each `application_id` you use
- Check your server's outgoing IP: https://ip.idmrt.dev/json
- Current MCP server IP: `54.255.44.189`
- Go to **Ideamart Portal → Your App → Settings → Allowed IPs** to add it
