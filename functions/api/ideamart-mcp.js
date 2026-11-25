const UPSTREAM = "https://mcp.ideamart.io/ideamart/mcp";
const AUTHORIZATION = "Bearer mcp_ab85b6946dc5c1e0ca044ca73276cb1b196940246bd65230387736b8bdde933c";

function corsHeaders(request) {
  const headers = new Headers();
  const origin = request.headers.get("Origin");
  if (origin && origin === new URL(request.url).origin) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  headers.set("Access-Control-Allow-Headers", "Content-Type, Mcp-Session-Id");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Vary", "Origin");
  return headers;
}

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {

  const requestHeaders = {
    Authorization: AUTHORIZATION,
    "Content-Type": "application/json",
    Accept: context.request.headers.get("Accept") || "application/json, text/event-stream"
  };
  const sessionId = context.request.headers.get("Mcp-Session-Id");
  if (sessionId) requestHeaders["Mcp-Session-Id"] = sessionId;

  let rpcRequest;
  try {
    rpcRequest = JSON.parse(await context.request.clone().text());
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid MCP JSON request." }), {
      status: 400,
      headers: { ...Object.fromEntries(corsHeaders(context.request)), "Content-Type": "application/json" }
    });
  }

  const allowedMethods = ["initialize", "notifications/initialized", "tools/list", "tools/call"];
  if (!allowedMethods.includes(rpcRequest.method)) {
    return new Response(JSON.stringify({ error: "This proxy only supports documentation requests." }), {
      status: 403,
      headers: { ...Object.fromEntries(corsHeaders(context.request)), "Content-Type": "application/json" }
    });
  }

  if (rpcRequest.method === "tools/call" && rpcRequest.params && rpcRequest.params.name !== "ideamart_docs") {
    return new Response(JSON.stringify({ error: "Only the ideamart_docs tool is available in the docs chatbot." }), {
      status: 403,
      headers: { ...Object.fromEntries(corsHeaders(context.request)), "Content-Type": "application/json" }
    });
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(UPSTREAM, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(rpcRequest)
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to reach the Ideamart MCP server." }), {
      status: 502,
      headers: { ...Object.fromEntries(corsHeaders(context.request)), "Content-Type": "application/json" }
    });
  }

  const responseHeaders = corsHeaders(context.request);
  ["Content-Type", "Mcp-Session-Id", "Cache-Control"].forEach((name) => {
    const value = upstreamResponse.headers.get(name);
    if (value) responseHeaders.set(name, value);
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders
  });
}
