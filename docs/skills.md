# Ideamart as a Skill

**Give your AI coding assistant the API contracts and implementation rules it needs to build Ideamart integrations.**

Ideamart as a Skill is an agent-ready reference package maintained by **hSenid Mobile Solutions** for Ideamart. It covers telecommunications integrations, OmniAI, error handling, callback processing, and production-readiness checks.

[View the GitHub repository](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill){ .md-button .md-button--primary }
[Explore the API documentation](developer-docs/sms-api.md){ .md-button }

!!! info "At a glance"
    **16 documented endpoints · 5 callbacks · 80+ status codes · 20+ agent integrations · zero-dependency reference CLI**. These figures describe the linked skill repository; check its current release for changes.

## Overview

AI coding assistants can generate API calls quickly, but they may not know Ideamart-specific payload formats, response semantics, provisioning requirements, or charging safeguards. The skill supplies structured API contracts and task-specific guidance so agents can build, review, and debug integrations more reliably.

The package includes:

- **API catalog:** Machine-readable contract in [`catalog/ideamart-api.json`](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/catalog/ideamart-api.json).
- **Reference CLI:** An offline, zero-dependency Node.js tool for API lookup, validation, error explanations, and troubleshooting.
- **Implementation guides:** Endpoint reference, curl examples, callbacks, security, and go-live practices.
- **Agent instructions:** Rules for Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI, and other assistants.
- **Example implementations:** TypeScript/Node.js, Python, Java, Go, PHP, and C#/.NET.

## Supported services

| Service | Included capabilities | Documentation |
| --- | --- | --- |
| SMS | Outbound SMS, broadcast, inbound SMS, delivery reports | [SMS API](developer-docs/sms-api.md) |
| Subscription | Registration, unregistration, subscriber status, base-size query, notifications | [Subscription API](developer-docs/subscription-api.md) |
| USSD | Interactive sessions, screen responses, session lifecycle | [USSD API](developer-docs/ussd-api.md) |
| OTP | Request and verify one-time passwords; masked-number flows | [OTP API](developer-docs/otp-api.md) |
| Charging (CaaS) | Direct debit, balance queries, notifications, reconciliation | [Charging API](developer-docs/charging-api.md) |
| LBS | Location requests, quality-of-service precedence, privacy | [LBS API](developer-docs/lbs-api.md) |
| OmniAI | Chat completions and image generation | [OMNI AI](omni-ai.md) |
| IVR | Extension guidance; not publicly documented in the source repository | [Repository](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill) |

## Installation

Choose the setup that matches your coding assistant. Commands below are from the skill repository; installation options may change between releases.

=== "Claude Code"

    Install via plugin marketplace:

    ```text
    /plugin marketplace add hSenidMobileCPaaS/Ideamart-as-a-Skill
    /plugin install ideamart@ideamart
    ```

    Or clone as a local skill:

    ```bash
    git clone https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill ~/.claude/skills/ideamart
    ```

=== "Cursor"

    ```bash
    git clone https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill .ideamart
    mkdir -p .cursor/rules
    cp .ideamart/.cursor/rules/ideamart.mdc .cursor/rules/
    ```

=== "Codex"

    ```text
    codex plugin marketplace add hSenidMobileCPaaS/Ideamart-as-a-Skill
    codex plugin add ideamart@ideamart
    ```

=== "GitHub Copilot"

    CLI plugin:

    ```bash
    copilot plugin marketplace add hSenidMobileCPaaS/Ideamart-as-a-Skill
    ```

    For an editor-based configuration, clone the repository, then copy its `.github/copilot-instructions.md` into your project's `.github/` directory.

=== "Gemini CLI"

    ```bash
    gemini extensions install https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill
    ```

=== "Other agents"

    The repository includes rules for Windsurf, Cline, Kiro, and Qoder, plus an `AGENTS.md` file for assistants that support project-level instructions.

    ```bash
    git clone https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill .ideamart
    ```

    For assistants that can read a URL without installation, supply:

    ```text
    https://raw.githubusercontent.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/main/AGENTS.md
    ```

    See the [agent compatibility matrix](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/docs/agent-support.md).

!!! tip "Using Windows PowerShell?"
    The `cp` commands are written in Unix shell style. In PowerShell, use `Copy-Item`, for example `Copy-Item .ideamart/.cursor/rules/ideamart.mdc .cursor/rules/` after creating the destination directory.

## Quick start

### 1. Configure your Ideamart application

Create your environment configuration from the repository template:

```bash
cp templates/.env.example .env
```

Set your application credentials and only the endpoints enabled for your application:

```dotenv
IDEAMART_APP_ID=APP_XXXXXX
IDEAMART_PASSWORD=replace-me

# Enable only APIs provisioned for your application
# IDEAMART_SMS_SEND_URL=https://api.ideamart.io/sms/send
# IDEAMART_SUBSCRIPTION_SEND_URL=https://api.ideamart.io/subscription/send
# IDEAMART_CAAS_DEBIT_URL=https://api.ideamart.io/caas/direct/debit
```

### 2. Check server IP whitelisting

Run this **on the deployed backend server**, not on your development laptop:

```bash
curl -4 https://myip.ideamart.io
```

Add the resulting public outbound IP to **Allowed Host Addresses** in the Ideamart portal, where required for the provisioned API.

### 3. Run the repository's checks

From the cloned repository:

=== "Linux / macOS"

    ```bash
    ./scripts/smoke-test.sh
    ./scripts/test-callbacks.sh http://localhost:3000
    ```

=== "Windows PowerShell"

    ```powershell
    .\scripts\smoke-test.ps1
    ```

    Refer to the repository for callback-test instructions appropriate to your local shell.

### 4. Ask your coding agent to build the integration

Example prompt:

> Add Ideamart subscription and SMS to my backend. Users should opt in, receive a welcome message, and be able to unsubscribe. Use environment variables for credentials, validate Ideamart application status codes, and handle callbacks safely. Follow the installed Ideamart skill.

For a more comprehensive workflow, see the [implementation playbook](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/references/12-implementation-playbook.md).

## API catalog and CLI

The repository provides an offline CLI over its structured API catalog. It **does not** send API requests or require access to your credentials for reference lookups.

```bash
node tools/ideamart.mjs list
node tools/ideamart.mjs show subscription-query-base
node tools/ideamart.mjs code E1309
node tools/ideamart.mjs checklist
```

| Command | Purpose |
| --- | --- |
| `list [category]` | Discover services and operations |
| `show <id>` | Inspect request parameters and response fields |
| `search "<query>"` | Find relevant endpoints |
| `curl <id> [k=v]` | Generate an example curl request |
| `validate <id> '<json>'` | Check request payload structure |
| `code <statusCode>` | Explain an API status code |
| `diagnose "<symptom>"` | Suggest causes and fixes |
| `practices [severity]` | Review integration rules |
| `checklist` | Check go-live readiness |
| `reference <doc>` | Read an associated guide |
| `platform` | View platform conventions |
| `omniai [models\|errors]` | Inspect OmniAI guidance |

Add `--json` where supported to obtain structured output for automation and agents.

### Example: Validate an SMS payload

```bash
node tools/ideamart.mjs validate sms-send '{"message":"hi","destinationAddresses":"tel:94771234567"}'
```

The validator identifies missing `applicationId` and `password` fields and flags `destinationAddresses` because it must be an **array**, not a string.

For request and response definitions, see the [complete curl reference](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/references/13-curl-reference.md).

## Available task-specific skills

| Skill | When to use it |
| --- | --- |
| `ideamart` | General API guidance and service selection |
| `ideamart-scaffold` | Create a new integration |
| `ideamart-callbacks` | Implement inbound event handlers |
| `ideamart-review` | Review existing integration code |
| `ideamart-debug` | Investigate failing API calls or callbacks |
| `ideamart-golive` | Prepare for production |
| `ideamart-omniai` | Integrate chat or image generation |
| `ideamart-help` | Quick usage reference |

On supported hosts, the skills may also be exposed as slash commands, such as `/ideamart-review`.

## Implementation architecture

A recommended structure is:

```text
Web / mobile application
         |
         v
Application backend (holds secrets)
         |
         | HTTPS from approved outbound IP
         v
Ideamart APIs / OmniAI
         |
         v
Subscriber / network services

Ideamart callbacks ---> HTTPS callback route on your backend
```

Keep authentication, response-code parsing, idempotency, callback verification, and subscriber privacy controls inside your backend. For production, use durable storage for USSD session state and transaction identifiers instead of in-memory variables.

## Critical implementation rules

!!! info "OmniAI has a separate credential model"
    Configure `OMNIAI_API_KEY` separately from Ideamart telco credentials. The skill's source documentation specifies passing the key directly in the authorization header, rather than adding a Bearer prefix. Check current [OMNI AI documentation](omni-ai.md) before implementing. Set sensible token and budget limits, and avoid placing subscriber identifiers in model prompts.

## Supported development stacks

| Language / stack | Repository examples |
| --- | --- |
| TypeScript / Node.js | Typed client, config, callback routes, USSD state |
| Python | Client, configuration, FastAPI callback handlers |
| Java | Client, configuration, Spring callback controller |
| Go | HTTP client and callback handlers |
| PHP | Framework-neutral callback examples, Laravel guidance |
| C# / .NET | Typed client, ASP.NET Core callbacks, background work |
| Other languages | Language-neutral [curl reference](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/references/13-curl-reference.md) and [integration guide](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/references/11-any-stack.md) |

The skill is **not** a code generator. Its API contracts and examples help coding agents implement the correct integration in your project's existing stack.

## Troubleshooting

??? question "My request returns HTTP 200, but the operation failed. Why?"
    Inspect the response body's Ideamart `statusCode`. HTTP success alone is not sufficient for traditional telco APIs. Consult [Response Codes](developer-docs/response-codes.md).

??? question "The API works locally but fails in production."
    Verify the outbound IP of the deployed backend, its whitelist entry, provisioned endpoints, and server-side environment variables. You can ask the CLI: `node tools/ideamart.mjs diagnose "works locally, fails in production"`.

??? question "Why did an SMS payload fail validation?"
    Ensure required credential fields are present and `destinationAddresses` is an array. Use `validate sms-send` to inspect the payload before sending it.

??? question "Why does my USSD session stop unexpectedly?"
    Check session IDs, callback response times, session-state persistence, and the documented USSD lifecycle. Never replace a network-provided session ID with a generated one.

??? question "Why do OmniAI requests return 401?"
    Verify that you are using the **OmniAI API key**, not your telco application password, and that the authorization header matches the current OmniAI contract.

For more guidance, see the [MCP troubleshooting guide](MCP/troubleshooting.md) and the [skill's reference repository](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill).

## Security, license and support

The repository identifies the skill as **proprietary**, owned by hSenid Mobile Solutions (Pvt) Ltd. It permits installation and use under its terms but restricts modification, redistribution, and repackaging. Refer to its [LICENSE](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/LICENSE) before copying repository contents beyond permitted use.

- [Repository security policy](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill/blob/main/SECURITY.md)
- [Official Ideamart documentation](https://docs.ideamart.io/)
- **Support email:** [info@ideamart.io](mailto:info@ideamart.io)
- **WhatsApp support:** +94 76 741 2345 (as listed in the skill repository)

For API support requests, provide the relevant **request ID, external transaction ID, session ID, and response status code** where applicable. Never share passwords or API keys.

---

*Source: [hSenidMobileCPaaS / Ideamart-as-a-Skill](https://github.com/hSenidMobileCPaaS/Ideamart-as-a-Skill). API behavior and supported assistants can change; verify billing-, security-, and production-critical behavior against current official documentation before release.*
