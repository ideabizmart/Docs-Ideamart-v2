# Ideamart MCP Platform — Getting Started Guide

Connect your AI coding assistant to Ideabiz and Ideamart telecom APIs using the Model Context Protocol (MCP).

**Platform URL:** https://mcp.ideamart.io

---

## What is MCP?

MCP (Model Context Protocol) lets AI assistants like Kiro, GitHub Copilot, Cursor, and Claude call external tools directly. The Ideamart MCP Platform exposes Ideabiz and Ideamart APIs as MCP tools — so your AI assistant can send SMS, check subscriptions, charge users, query locations, and more without you writing API code.

---

## Quick Start (3 Steps)

### Step 1: Get Your Token

1. Visit https://mcp.ideamart.io/auth/login
2. Authenticate with your Ideamart SSO account
3. Copy the generated `mcp_xxxx` token (shown only once)

### Step 2: Add to Your IDE

Create or edit the MCP config file for your IDE:

| IDE | Config File |
|-----|-------------|
| **Kiro** | `.kiro/settings/mcp.json` (project) or `~/.kiro/settings/mcp.json` (global) |
| **VS Code** | `.vscode/mcp.json` |
| **Cursor** | `.cursor/mcp.json` or `~/.cursor/mcp.json` |
| **IntelliJ / JetBrains** | Settings → Tools → AI Assistant → MCP Servers, or `.junie/mcp.json` |
| **Claude Desktop** | `%APPDATA%\Claude\claude_desktop_config.json` (Win) / `~/.config/claude/claude_desktop_config.json` (Linux) / `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` |

**Config content:**

```json
{
  "mcpServers": {
    "ideabiz": {
      "url": "https://mcp.ideamart.io/ideabiz/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    },
    "ideamart": {
      "url": "https://mcp.ideamart.io/ideamart/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    }
  }
}
```

> **Note:** For VS Code (GitHub Copilot), add `"type": "streamable-http"` to each server entry.

### Step 3: Start Using

Ask your AI assistant to perform telecom operations:

- "Send SMS 'Hello' to 94771234567"
- "Check subscription status for 94771234567"
- "Get location of 94771234567"

---

## Platform Architecture

```
Your IDE (Kiro/VS Code/Cursor/IntelliJ/Claude)
    │
    ▼  MCP Protocol (HTTPS + Bearer Token)
┌─────────────────────────────────────────────┐
│         mcp.ideamart.io (Gateway)           │
│         SSO Auth + Token Management         │
├─────────────────┬───────────────────────────┤
│  /ideabiz/mcp   │     /ideamart/mcp         │
│  11 tools       │     9 tools               │
│  OAuth2 flow    │     Per-request auth      │
└─────────────────┴───────────────────────────┘
    │                       │
    ▼                       ▼
  Ideabiz APIs          Ideamart APIs
```

---

## Authentication Model

There are **two layers** of authentication:

### Layer 1: MCP Token (Platform Auth)

- Obtained via SSO at https://mcp.ideamart.io/auth/login
- Used in the `Authorization: Bearer mcp_xxxx` header
- Identifies **you** to the MCP platform
- One token works for both Ideabiz and Ideamart services
- Expires in 90 days (configurable)
- Manage tokens at https://mcp.ideamart.io/auth/manage

### Layer 2: API Credentials (Tool Auth)

Each tool also needs upstream API credentials:

| Platform | Credentials | How |
|----------|-------------|-----|
| **Ideabiz** | `client_key` + `client_secret` | Call `ideabiz_token_renew` first to get `access_token`, then use it in other tools |
| **Ideamart** | `application_id` + `password` | Provide directly in every tool call |

---

## Available Services

### Ideabiz Tools (11)

| Tool | Purpose |
|------|---------|
| `ideabiz_token_renew` | Get OAuth2 access token |
| `ideabiz_sms_send` | Send SMS |
| `ideabiz_lbs_query` | Query subscriber location |
| `ideabiz_carrier_billing_charge` | Charge subscriber |
| `ideabiz_pin_subscription` | Initiate PIN subscription |
| `ideabiz_pin_verify` | Verify PIN |
| `ideabiz_subscription_subscribe` | Subscribe user |
| `ideabiz_subscription_unsubscribe` | Unsubscribe user |
| `ideabiz_subscription_state_change` | Change subscription state |
| `ideabiz_subscription_status_check` | Check subscription status |
| `ideabiz_subscription_history_query` | Query subscription history |

### Ideamart Tools (9)

| Tool | Purpose |
|------|---------|
| `ideamart_sms_send` | Send SMS |
| `ideamart_sms_receive_parse` | Parse inbound SMS payload |
| `ideamart_subscription_subscribe` | Subscribe user |
| `ideamart_subscription_status_check` | Check subscription status |
| `ideamart_subscription_unsubscribe` | Unsubscribe user |
| `ideamart_query_base` | Query subscriber base |
| `ideamart_lbs_query` | Query subscriber location |
| `ideamart_ussd_send` | Send/respond to USSD |
| `ideamart_ussd_receive_parse` | Parse inbound USSD payload |

---

## MSISDN Format

All tools accept these phone number formats:

- `tel:+94771234567` (preferred, E.164 with tel: prefix)
- `+94771234567`
- `94771234567`
- `0771234567`

---

## Environments

All tools accept an optional `environment` parameter:

| Value | Description |
|-------|-------------|
| `prod` | Production (default) |
| `uat` | User acceptance testing |
| `dev` | Development |

---

## Token Management

- **Generate tokens:** https://mcp.ideamart.io/auth/login
- **View/revoke tokens:** https://mcp.ideamart.io/auth/manage
- **View audit logs:** Same page, "Audit Logs" tab
- **View login history:** Same page, "Login History" tab

---

## Security

- All communication is over HTTPS
- MCP tokens are hashed (SHA-256) at rest — we never store the raw token
- Tokens can be revoked immediately from the dashboard
- All tool calls are logged with user, tool, status, IP, and duration
- Internal endpoints (`/auth/validate`, `/auth/audit`) are blocked from public access
- The platform is behind Imperva WAF for DDoS and bot protection

---

## Support

- Ideabiz documentation: https://docs.ideabiz.lk
- Ideamart documentation: https://docs.ideamart.io
- Platform health: https://mcp.ideamart.io/health

