# Troubleshooting Guide

Common issues and solutions for the Ideamart MCP Platform.

---

## Connection & Authentication Issues

### "Unauthorized" or 401 Error

**Cause:** MCP token is invalid, expired, or revoked.

**Fix:**
1. Visit https://mcp.ideamart.io/auth/manage
2. Check if your token is active (not expired/revoked)
3. If expired, generate a new token
4. Update the `Authorization: Bearer mcp_xxxx` in your IDE config

---

### "Connection refused" or timeout when connecting

**Cause:** IDE can't reach the MCP server.

**Fix:**
- Verify you can access https://mcp.ideamart.io/health in your browser
- Check your network/proxy settings aren't blocking outbound HTTPS
- Ensure the URL in your config is exactly `https://mcp.ideamart.io/ideabiz/mcp` or `https://mcp.ideamart.io/ideamart/mcp`

---

### SSO Login fails with "Session Expired"

**Cause:** The login state expired (10 min timeout) before you completed authentication.

**Fix:** Click "Login Again" and complete the SSO flow within 10 minutes.

---

### SSO Login fails with "Connection Timeout"

**Cause:** The MCP server can't reach the SSO identity provider.

**Fix:** This is a server-side network issue. Contact the platform team.

---

## Ideabiz Tool Issues

### "Token expired" error on tool calls

**Cause:** The Ideabiz `access_token` (from `ideabiz_token_renew`) has expired (~1 hour validity).

**Fix:** Ask your AI to call `ideabiz_token_renew` again with your `client_key` and `client_secret`. The AI usually does this automatically.

---

### "Invalid client credentials"

**Cause:** Wrong `client_key` or `client_secret`.

**Fix:**
- Verify credentials in the Ideabiz developer portal
- Ensure you're using the correct environment (`prod` vs `uat` vs `dev`)
- Check there are no extra spaces in your credentials

---

### Tool returns empty or unexpected data

**Cause:** Wrong `app_id`, `service_id`, or `msisdn`.

**Fix:**
- Verify the MSISDN format (use `tel:+94XXXXXXXXX`)
- Confirm the `app_id` and `service_id` are registered and active
- Check if the subscriber actually has the service

---

## Ideamart Tool Issues

### "Connection refused" on Ideamart tools

**Cause:** The MCP server's IP is not whitelisted for your Ideamart application.

**Error response from Ideamart:**
```json
{
  "statusCode": "E1303",
  "statusDetail": "IP address, which the request originates from, is not listed withing the allowed-host-address list.",
  "version": "1.0"
}
```

**Fix:**
1. Check the MCP server's outgoing IP: https://ip.idmrt.dev/json
2. Current server IP: `54.255.44.189`
3. Go to Ideamart Portal → Your App → Settings → Allowed IPs
4. Add the IP from step 1
5. Wait a few minutes for propagation, then retry

> **Note:** This is only needed for Ideamart tools, not Ideabiz tools. Each Ideamart application must separately whitelist the IP.

---

### MSISDNs in responses are hashed/masked

**Cause:** Your Ideamart app has number masking enabled (default behavior).

**Fix:**
- Contact Ideamart support to disable number masking for your app
- Or work with masked numbers as-is (they're consistent per subscriber)

---

### "Invalid credentials" on Ideamart tools

**Cause:** Wrong `application_id` or `password`.

**Fix:**
- Check the Ideamart portal for correct values
- Ensure the password hasn't been rotated
- Verify you're using the correct environment

---

### USSD session errors

**Cause:** Session expired or invalid operation.

**Fix:**
- USSD sessions have a timeout (~2-3 minutes)
- Use `mt-cont` to keep session alive (send menu, wait for input)
- Use `mt-fin` to end session (send final message)
- Session IDs are provided by the inbound USSD webhook — don't fabricate them

---

## IDE Configuration Issues

### Tools not showing up in IDE

**Cause:** Config file path is wrong or JSON is invalid.

**Fix:**
- Verify the config file is in the correct location for your IDE (see Setup Guide tab in dashboard)
- Validate your JSON (no trailing commas, proper quoting)
- Restart your IDE after saving the config
- For VS Code: ensure you have GitHub Copilot with MCP support enabled

---

### "MCP server disconnected" in IDE

**Cause:** Network interruption or server restart.

**Fix:**
- Check https://mcp.ideamart.io/health
- Reconnect MCP in your IDE (usually via command palette or settings)
- For Kiro: check the MCP Server view in the feature panel

---

### IDE shows "streamable-http not supported"

**Cause:** Your IDE/extension version doesn't support the streamable-http transport.

**Fix:**
- Update your IDE to the latest version
- Update GitHub Copilot / AI extension to latest
- For older clients, try adding `"type": "streamable-http"` explicitly

---

## Dashboard Issues

### Audit Logs shows "No calls yet"

**Cause:** No tool calls have been made yet through the MCP platform.

**Fix:** This is normal if you haven't used any tools yet. Make a tool call (e.g., `ideabiz_token_renew`) and check again.

---

### Login History is empty

**Cause:** Login logging was recently deployed; only new logins are recorded.

**Fix:** Log out and log back in — the new login will appear.

---

### Token generation shows briefly then page reloads

**Cause:** Outdated gateway version.

**Fix:** Ensure the latest gateway version is deployed. The token should appear in a modal overlay that stays until you close it.

---

## Testing with curl

### Health check
```bash
curl https://mcp.ideamart.io/health
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

## Getting Help

- **Platform dashboard:** https://mcp.ideamart.io/auth/manage
- **Ideabiz docs:** https://docs.ideabiz.lk
- **Ideamart docs:** https://docs.ideamart.io
- **Health status:** https://mcp.ideamart.io/health

