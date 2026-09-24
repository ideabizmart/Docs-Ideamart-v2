# MCP Client Configuration

## Step 1: Get Your Token

1. Visit `https://mcp.ideamart.io/auth/login`
2. Authenticate via Ideamart SSO
3. Copy the generated `mcp_xxxx` token (shown only once)
4. Manage tokens later at `https://mcp.ideamart.io/auth/manage`

---

## Step 2: Configure Your IDE / AI Tool

Replace `mcp_your_token_here` with the token you copied.

---

### Kiro (by AWS)

**File path (per-project):**
```
<your-project>/.kiro/settings/mcp.json
```

**File path (global — applies to all projects):**
```
~/.kiro/settings/mcp.json
```

**Config:**
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

---

### VS Code (GitHub Copilot)

**File path (per-project):**
```
<your-project>/.vscode/mcp.json
```

**Or globally via User Settings** (`settings.json` → add `"mcp"` key).

**Config:**
```json
{
  "mcpServers": {
    "ideabiz": {
      "type": "streamable-http",
      "url": "https://mcp.ideamart.io/ideabiz/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    },
    "ideamart": {
      "type": "streamable-http",
      "url": "https://mcp.ideamart.io/ideamart/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    }
  }
}
```

---

### Cursor

**File path (per-project):**
```
<your-project>/.cursor/mcp.json
```

**File path (global):**
```
~/.cursor/mcp.json
```

**Config:**
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

---

### IntelliJ IDEA / JetBrains IDEs

**Option A — Via UI:**
1. Open **Settings** → **Tools** → **AI Assistant** → **MCP Servers**
2. Click **+ Add** → choose **"As JSON"**
3. Paste the config below

**Option B — File (per-project):**
```
<your-project>/.junie/mcp.json
```

**Config:**
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

---

### Claude Desktop

**File path:**

| OS | Path |
|----|------|
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/claude/claude_desktop_config.json` |

**Config:**
```json
{
  "mcpServers": {
    "ideabiz": {
      "transport": {
        "type": "streamable-http",
        "url": "https://mcp.ideamart.io/ideabiz/mcp"
      },
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    },
    "ideamart": {
      "transport": {
        "type": "streamable-http",
        "url": "https://mcp.ideamart.io/ideamart/mcp"
      },
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    }
  }
}
```

---

### Claude Code (CLI)

Run these commands in your terminal:

```bash
claude mcp add ideabiz --transport streamable-http \
  --header "Authorization: Bearer mcp_your_token_here" \
  https://mcp.ideamart.io/ideabiz/mcp

claude mcp add ideamart --transport streamable-http \
  --header "Authorization: Bearer mcp_your_token_here" \
  https://mcp.ideamart.io/ideamart/mcp
```

---

### Windsurf

**File path (global):**
```
~/.codeium/windsurf/mcp_config.json
```

**Config:**
```json
{
  "mcpServers": {
    "ideabiz": {
      "serverUrl": "https://mcp.ideamart.io/ideabiz/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    },
    "ideamart": {
      "serverUrl": "https://mcp.ideamart.io/ideamart/mcp",
      "headers": {
        "Authorization": "Bearer mcp_your_token_here"
      }
    }
  }
}
```

---

## How Tool-Level Auth Works

The MCP token authenticates **you** to the platform. But each tool also needs **API credentials** for the upstream service:

### Ideabiz Tools

1. First call `ideabiz_token_renew` with your `client_key` + `client_secret`
2. Get back an `access_token`
3. Use that `access_token` in subsequent Ideabiz tool calls

```
AI: "Check subscription status for 94771234567"
→ Tool: ideabiz_subscription_status_check
→ Params: { access_token: "xxx", msisdn: "tel:+94771234567", app_id: "APP001", service_id: "SVC001" }
```

### Ideamart Tools

Each Ideamart tool requires `application_id` + `password` directly:

```
AI: "Send SMS to 94771234567"  
→ Tool: ideamart_sms_send
→ Params: { to_msisdn: "tel:+94771234567", message: "Hello", application_id: "APP001", password: "app_password" }
```

---

## Testing with curl

### Health check
```bash
curl https://mcp.ideamart.io/ideabiz/health
curl https://mcp.ideamart.io/ideamart/health
```

### List tools
```bash
curl -X POST https://mcp.ideamart.io/ideabiz/mcp \
  -H "Authorization: Bearer mcp_your_token" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### Call a tool
```bash
curl -X POST https://mcp.ideamart.io/ideabiz/mcp \
  -H "Authorization: Bearer mcp_your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0","id":2,"method":"tools/call",
    "params":{
      "name":"ideabiz_token_renew",
      "arguments":{
        "client_key":"your_client_key",
        "client_secret":"your_client_secret"
      }
    }
  }'
```

---

## Token Management

### View & revoke tokens
Visit `https://mcp.ideamart.io/auth/manage`

### View audit logs
Same page — click "Audit Logs" tab to see all your tool calls.

### API endpoints (requires web session cookie)
```
GET  /auth/tokens         → List your tokens
POST /auth/tokens/create  → { name, expiresInDays }
POST /auth/tokens/revoke  → { tokenId }
GET  /auth/audit-logs     → Recent tool calls
```
