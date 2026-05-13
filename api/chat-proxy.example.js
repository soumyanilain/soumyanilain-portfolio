/**
 * api/chat-proxy.example.js
 *
 * Reference implementation of a serverless chat proxy. Drop into your
 * deployment platform's serverless functions folder and rename:
 *
 *   • Vercel:  copy to /api/chat.js (Node.js runtime)
 *   • Netlify: copy to /netlify/functions/chat.js
 *   • Cloudflare Workers: adapt the signature; see Cloudflare docs
 *
 * Why use a proxy?
 *   The Anthropic API key must NEVER be exposed in the browser. This proxy
 *   keeps the key on the server, applies optional rate limiting, and forwards
 *   sanitized requests to Anthropic.
 *
 * Setup (Vercel example):
 *   1. Move this file to /api/chat.js in your project root
 *   2. Set environment variable ANTHROPIC_API_KEY in Vercel dashboard
 *   3. Deploy. Update js/chat/config.js mode to 'proxy' and proxyEndpoint
 *      to '/api/chat'.
 *
 * Note: this file is for reference. It is NOT loaded by index.html.
 */

const KNOWLEDGE = `You are an AI assistant on Soumyanil Ain's portfolio website. ...
[paste the full string from js/chat/knowledge.js here, since this file runs
on the server and can't import the browser-side ESM module directly]`;

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

export default async function handler(req, res) {
  // CORS — only allow your own origin in production; '*' for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured (missing ANTHROPIC_API_KEY)' });
  }

  let body = req.body;
  if (typeof body === 'string') body = JSON.parse(body);
  const { messages } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  // Defensive: cap message count and length to prevent abuse
  const safeMessages = messages.slice(-16).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 4000)
  }));

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: KNOWLEDGE,
        messages: safeMessages
      })
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('Anthropic error:', upstream.status, text);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await upstream.json();
    const reply = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
