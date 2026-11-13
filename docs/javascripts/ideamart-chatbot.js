(function () {
  "use strict";

  var MCP_ENDPOINT = window.__IDEAMART_MCP_ENDPOINT__ || "/api/ideamart-mcp";
  var clientRequestId = 0;
  var docsIndexPromise = null;

  function makeId(prefix) {
    clientRequestId += 1;
    return prefix + "-" + Date.now() + "-" + clientRequestId;
  }

  function escapeText(value) {
    return String(value == null ? "" : value);
  }

  function plainText(value) {
    var element = document.createElement("div");
    element.innerHTML = String(value || "");
    return (element.textContent || element.innerText || "").replace(/\s+/g, " ").trim();
  }

  function questionTokens(question) {
    var stopWords = {
      a: true, about: true, an: true, and: true, are: true, can: true, do: true,
      for: true, how: true, i: true, in: true, is: true, it: true, me: true,
      of: true, on: true, please: true, tell: true, the: true, to: true,
      what: true, when: true, with: true
    };

    return question.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(function (token) { return token.length > 2 && !stopWords[token]; });
  }

  function loadDocsIndex() {
    if (!docsIndexPromise) {
      docsIndexPromise = fetch("/search/search_index.json", { cache: "force-cache" })
        .then(function (response) {
          if (!response.ok) throw new Error("Docs search index unavailable");
          return response.json();
        });
    }
    return docsIndexPromise;
  }

  function scoreDoc(doc, tokens, phrase) {
    var title = plainText(doc.title).toLowerCase();
    var text = plainText(doc.text).toLowerCase();
    var score = title.indexOf(phrase) !== -1 ? 18 : 0;

    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) score += 8;
      if (text.indexOf(token) !== -1) score += 2;
    });

    return score;
  }

  function isFallbackDocAllowed(doc) {
    var location = String(doc.location || "").toLowerCase();
    var title = plainText(doc.title).toLowerCase();
    return location.indexOf("mcp/troubleshooting") === -1 && title.indexOf("mcp server disconnected") === -1;
  }

  function docsFallbackAnswer(question) {
    return loadDocsIndex().then(function (index) {
      var tokens = questionTokens(question);
      var phrase = question.toLowerCase().trim();
      var ranked = (index.docs || [])
        .filter(isFallbackDocAllowed)
        .map(function (doc) {
          return { doc: doc, score: scoreDoc(doc, tokens, phrase) };
        })
        .filter(function (item) { return item.score > 0; })
        .sort(function (left, right) { return right.score - left.score; })
        .slice(0, 3);

      if (!ranked.length) return "MCP is unavailable and I could not find a matching passage in the local Ideamart Docs. Try a simpler search such as SMS, USSD, OTP, charging, masking, or status codes.";

      var answer = "Relevant Ideamart Docs:\n\n";
      ranked.forEach(function (item, index) {
        var doc = item.doc;
        var text = plainText(doc.text);
        var lowerText = text.toLowerCase();
        var matchToken = tokens.find(function (token) { return lowerText.indexOf(token) !== -1; });
        var position = matchToken ? lowerText.indexOf(matchToken) : 0;
        var start = Math.max(0, position - 150);
        var snippet = text.slice(start, start + 420).trim();
        if (start > 0) snippet = "…" + snippet;
        if (start + 420 < text.length) snippet += "…";

        var location = doc.location || "";
        var link = location ? new URL(location, window.location.origin).href : window.location.origin;
        answer += (index + 1) + ". " + doc.title + "\n" + snippet + "\nRead more: " + link + "\n\n";
      });

      return answer.trim();
    });
  }

  function getTextFromResult(result) {
    if (!result) return "";

    if (Array.isArray(result.content)) {
      return result.content
        .map(function (item) {
          if (!item) return "";
          if (typeof item.text === "string") return item.text;
          if (item.type === "resource" && item.resource && item.resource.text) {
            return item.resource.text;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    }

    if (result.structuredContent) {
      return JSON.stringify(result.structuredContent, null, 2);
    }

    return typeof result === "string" ? result : JSON.stringify(result, null, 2);
  }

  function parseServerSentEvents(raw) {
    var messages = [];
    var currentData = [];

    raw.split(/\r?\n/).forEach(function (line) {
      if (line.indexOf("data:") === 0) {
        currentData.push(line.slice(5).trimStart());
      } else if (line === "" && currentData.length) {
        var payload = currentData.join("\n");
        if (payload !== "[DONE]") {
          try {
            messages.push(JSON.parse(payload));
          } catch (error) {
            // Ignore non-JSON keep-alive events.
          }
        }
        currentData = [];
      }
    });

    if (currentData.length) {
      try {
        messages.push(JSON.parse(currentData.join("\n")));
      } catch (error) {
        // Ignore an incomplete event.
      }
    }

    return messages;
  }

  async function readRpcResponse(response) {
    var raw = await response.text();
    if (!raw) return {};

    var contentType = response.headers.get("content-type") || "";
    if (contentType.indexOf("text/event-stream") !== -1) {
      var events = parseServerSentEvents(raw);
      return events[events.length - 1] || {};
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error("The MCP server returned an unreadable response.");
    }
  }

  function McpClient() {
    this.endpoint = MCP_ENDPOINT;
    this.sessionId = null;
    this.initialized = false;
    this.tools = null;
  }

  McpClient.prototype.headers = function () {
    var headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream"
    };

    if (this.sessionId) headers["Mcp-Session-Id"] = this.sessionId;
    return headers;
  };

  McpClient.prototype.request = async function (method, params, allowRetry) {
    var requestId = makeId("chat");
    var response;

    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: requestId,
          method: method,
          params: params || {}
        })
      });
    } catch (error) {
      throw new Error("The MCP server could not be reached. Check your connection and try again.");
    }

    var sessionId = response.headers.get("Mcp-Session-Id");
    if (sessionId) this.sessionId = sessionId;

    if (response.status === 401 || response.status === 403) {
      throw new Error("The MCP server connection was not authorized.");
    }

    if (!response.ok) {
      if (allowRetry && (response.status === 400 || response.status === 404 || response.status === 405)) {
        await this.initialize();
        return this.request(method, params, false);
      }
      throw new Error("The MCP server returned HTTP " + response.status + ".");
    }

    var rpc = await readRpcResponse(response);
    if (rpc.error) {
      if (allowRetry && rpc.error.code === -32600) {
        await this.initialize();
        return this.request(method, params, false);
      }
      throw new Error(rpc.error.message || "The MCP request failed.");
    }

    return rpc.result || rpc;
  };

  McpClient.prototype.initialize = async function () {
    if (this.initialized) return;

    await this.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "Ideamart Docs Assistant", version: "1.0.0" }
    }, false);

    this.initialized = true;

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })
      });
    } catch (error) {
      // The initialize response is enough for servers that do not require the notification.
    }
  };

  McpClient.prototype.listTools = async function () {
    if (this.tools) return this.tools;

    try {
      this.tools = await this.request("tools/list", {}, true);
    } catch (error) {
      if (!this.initialized) {
        await this.initialize();
        this.tools = await this.request("tools/list", {}, false);
      } else {
        throw error;
      }
    }

    return this.tools;
  };

  function topicForQuestion(question, schema) {
    var lower = question.toLowerCase();
    var topics = [
      "sms", "ussd", "subscription", "otp", "charging", "caas", "masking",
      "status", "rules", "mistakes", "retry", "lbs", "location", "base"
    ];
    var matchingTopic = topics.find(function (topic) { return lower.indexOf(topic) !== -1; });
    var properties = (schema && schema.properties) || {};
    var propertyName = Object.keys(properties).find(function (name) {
      return ["topic", "query", "question", "search"].indexOf(name) !== -1;
    });

    if (!propertyName) {
      var propertyNames = Object.keys(properties);
      propertyName = propertyNames.length === 1 ? propertyNames[0] : null;
    }

    if (!propertyName) return {};

    var property = properties[propertyName] || {};
    if (Array.isArray(property.enum) && property.enum.length) {
      matchingTopic = property.enum.find(function (item) {
        return String(item).toLowerCase() === String(matchingTopic || "").toLowerCase();
      }) || property.enum[0];
    }

    return { [propertyName]: matchingTopic || question };
  }

  McpClient.prototype.ask = async function (question) {
    var toolResponse = await this.listTools();
    var tools = toolResponse.tools || [];
    var docsTool = tools.find(function (tool) {
      return tool.name === "ideamart_docs" || /docs?/i.test(tool.name);
    });

    if (!docsTool) {
      throw new Error("The connected MCP server does not expose the Ideamart documentation tool.");
    }

    return this.request("tools/call", {
      name: docsTool.name,
      arguments: topicForQuestion(question, docsTool.inputSchema)
    }, false);
  };

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function mount() {
    if (document.getElementById("ideamart-chatbot")) return;

    var client = null;
    var root = createElement("section", "ideamart-chatbot");
    root.id = "ideamart-chatbot";
    root.innerHTML = [
      '<button class="ideamart-chatbot__fab" type="button" aria-expanded="false" aria-controls="ideamart-chatbot-panel">',
      '  <span class="ideamart-chatbot__orb" aria-hidden="true">✦</span>',
      '  <span>Ask Ideamart</span>',
      '</button>',
      '<div class="ideamart-chatbot__panel" id="ideamart-chatbot-panel" aria-hidden="true" hidden>',
      '  <header class="ideamart-chatbot__header">',
      '    <div>',
      '      <p class="ideamart-chatbot__eyebrow">Ideamart AI</p>',
      '      <h2>Ideamart Assistant</h2>',
      '      <p>Ask about APIs, callbacks, status codes, and integration rules.</p>',
      '    </div>',
      '    <button class="ideamart-chatbot__close" type="button" aria-label="Close assistant">×</button>',
      '  </header>',
      '  <div class="ideamart-chatbot__messages" aria-live="polite"></div>',
      '  <form class="ideamart-chatbot__composer">',
      '    <textarea rows="2" maxlength="800" placeholder="e.g. How do I send an SMS?" aria-label="Ask a question"></textarea>',
      '    <div class="ideamart-chatbot__composer-row">',
      '      <span class="ideamart-chatbot__status">Powered by Ideamart MCP</span>',
      '      <button type="submit" class="ideamart-chatbot__send">Send <span aria-hidden="true">↗</span></button>',
      '    </div>',
      '  </form>',
      '</div>'
    ].join("");

    document.body.appendChild(root);

    var fab = root.querySelector(".ideamart-chatbot__fab");
    var panel = root.querySelector(".ideamart-chatbot__panel");
    var close = root.querySelector(".ideamart-chatbot__close");
    var messages = root.querySelector(".ideamart-chatbot__messages");
    var form = root.querySelector(".ideamart-chatbot__composer");
    var input = root.querySelector("textarea");
    var send = root.querySelector(".ideamart-chatbot__send");

    function addMessage(role, content, extraClass) {
      var message = createElement("div", "ideamart-chatbot__message ideamart-chatbot__message--" + role + (extraClass ? " " + extraClass : ""));
      message.textContent = escapeText(content);
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function setPanelOpen(isOpen) {
      panel.hidden = !isOpen;
      panel.setAttribute("aria-hidden", String(!isOpen));
      root.classList.toggle("ideamart-chatbot--open", isOpen);
      fab.setAttribute("aria-expanded", String(isOpen));
    }

    function openPanel() {
      setPanelOpen(true);
      if (!messages.children.length) {
        addMessage("assistant", "Hello! I'm the Ideamart AI assistant. Ask me about Ideamart APIs, callbacks, status codes, and integration rules.");
      }
      input.focus();
    }

    function closePanel() {
      setPanelOpen(false);
    }

    function setBusy(busy) {
      send.disabled = busy;
      input.disabled = busy;
      send.innerHTML = busy ? 'Thinking <span class="ideamart-chatbot__spinner" aria-hidden="true"></span>' : 'Send <span aria-hidden="true">↗</span>';
    }

    fab.addEventListener("click", openPanel);
    close.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closePanel();
        fab.focus();
      }
    });
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var question = input.value.trim();
      if (!question || send.disabled) return;

      addMessage("user", question);
      input.value = "";
      setBusy(true);
      var pending = addMessage("assistant", "Looking that up…", "ideamart-chatbot__message--pending");

      try {
        if (!client) client = new McpClient();
        var result = await client.ask(question);
        pending.textContent = getTextFromResult(result) || "The MCP tool returned no documentation for that question.";
        pending.classList.remove("ideamart-chatbot__message--pending");
      } catch (error) {
        pending.remove();
        try {
          addMessage("assistant", await docsFallbackAnswer(question), "ideamart-chatbot__message--fallback");
        } catch (fallbackError) {
          addMessage("assistant", error.message + " You can also browse the Developer Docs.", "ideamart-chatbot__message--error");
        }
      } finally {
        setBusy(false);
        input.focus();
      }
    });

    document.querySelectorAll("#open-ideamart-chat, #open-ideamart-chat-card").forEach(function (button) {
      button.addEventListener("click", openPanel);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
