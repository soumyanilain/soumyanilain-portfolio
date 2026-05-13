/**
 * chat/config.js — Configuration for the AI chat widget
 *
 * Exposes settings for picking between a hosted backend proxy (recommended
 * for production) or calling the Anthropic API directly from the browser
 * (only for local development — direct browser calls expose the API key).
 */

export const CHAT_CONFIG = {
  // Strategy:
  //   'proxy'    — POST messages to your own backend at PROXY_ENDPOINT
  //                (recommended for production; keeps the API key off the client)
  //   'direct'   — Call Anthropic API directly from the browser using
  //                CLAUDE_API_KEY (for local testing only — never commit a real
  //                key to a public repo)
  //   'fallback' — Skip the API entirely and use rule-based local responses
  //                (default — works out of the box with no setup)
  mode: 'fallback',

  // Used when mode === 'proxy'. Should accept POST { messages: [...] } and
  // return { reply: '...' }. See api/chat-proxy.example.js for a template.
  proxyEndpoint: '/api/chat',

  // Used when mode === 'direct'. Get a key from https://console.anthropic.com.
  // WARNING: anyone viewing the page source can copy this key.
  claudeApiKey: '',

  // Model to use for direct/proxy modes
  model: 'claude-haiku-4-5-20251001',

  // Max tokens per reply
  maxTokens: 600,

  // Cap conversation history (keep last N messages) to control token usage
  historyLimit: 16,
};
