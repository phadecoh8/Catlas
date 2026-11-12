# Catline AI assistant

This note describes the intended Catline experience. The chat UI is a frontend prototype: AI providers, persistent conversation history, and memory are not connected yet. Do not present local UI state as working AI or stored memory.

## Assistant behavior

- Catline is a general-purpose AI assistant, not limited to Catlas documentation. It should answer general questions and also understand Catlas features and campus-navigation context.
- Users will be able to choose a configured provider/model from the Catline model picker.
- **Catlas Auto** will try configured providers in the order selected by the owner and move to the next provider when a request fails because of a rate limit, quota, or provider outage. It should not switch providers after every successful response.
- Keep provider API keys server-side in environment variables. Never expose them in browser code, logs, or committed files.
- Only offer providers whose current API terms and account tier allow the intended use. Free tiers and quotas can change and may restrict public/commercial use; verify each provider's current terms before enabling it in production.
- Gemini, Groq, Mistral, and OpenRouter may offer free or free-model access depending on account, model, region, and current limits. Treat those as candidates to verify, not guaranteed free capacity.
- GitHub Copilot subscriptions do not provide a general-purpose API key for embedding Copilot chat in Catline. GitHub Models is a separate product with its own API access, model availability, quotas, and terms; label it accurately if integrated.
- DeepSeek API access and pricing can change. Do not advertise it as a guaranteed free provider; check current account pricing and API terms before enabling it.
- A provider being listed in the design prototype does not mean it is wired up or available.

## Memory

- Catline should have a dedicated **Memory** section in the conversation sidebar.
- It should show only information the user explicitly chooses to save, with controls to inspect and remove saved items.
- Memory must be transparent and user-controlled. Do not save conversation content or personal information by default.
- The current Catline UI only shows an explanatory empty state. Persistent memory and its controls are not implemented yet.

## Privacy and safety

- Do not send personal student data, credentials, or account details to AI providers.
- Treat user messages as untrusted input. Any Catlas-specific internal knowledge should be supplied as context without restricting Catline from answering general questions.
- Explain provider-specific data handling and any limits before enabling a provider for users.
