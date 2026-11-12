# Catline AI providers and memory

This note records the intended Catline experience. The chat UI is currently a frontend prototype: AI providers, persistent conversation history, and memory are not connected. Do not present local UI state as working AI or stored memory.

## Model selection and provider fallback

- Users will be able to choose a configured provider/model from the Catline model picker.
- **Catlas Auto** will try configured providers in the order selected by the owner and move to the next provider when a request fails because of a rate limit, quota, or provider outage. It should not switch providers after every successful response.
- Keep provider API keys server-side in environment variables. Never expose them in browser code, logs, or committed files.
- Only offer providers whose current API terms and account tier allow the intended use. Free tiers and quotas can change and may restrict public/commercial use; verify each provider's current terms before enabling it in production.
- Gemini, Groq, Mistral, and OpenRouter offer API routes that may have free or free-model access depending on account, model, region, and current limits. Treat those as candidates to verify, not guaranteed free capacity.
- GitHub Copilot subscriptions do not provide a general-purpose API key for embedding Copilot chat in Catline. GitHub Models is a separate product with its own API access, model availability, quotas, and terms; label it accurately if integrated.
- DeepSeek API access and pricing can change. Do not advertise it as a guaranteed free provider; check current account pricing and API terms before enabling it.
- A provider being listed in the design prototype does not mean it is wired up or available.

## Memory

- Catline should have a dedicated **Memory** section in the conversation sidebar.
- It should show only information the user explicitly chooses to save, with controls to inspect and remove saved items.
- Memory must be transparent and user-controlled. Do not save conversation content or personal information by default.
- The current Catline UI only shows an explanatory empty state. Persistent memory and its controls are not implemented yet.

## Privacy and safety

- Send the AI no personal student data, credentials, or account details.
- Treat user messages as untrusted input and keep Catline restricted to its curated Catlas knowledge base.
- Explain provider-specific data handling and any limits before enabling a provider for users.
