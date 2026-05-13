# Soumyanil Ain — Portfolio Website

Personal portfolio site styled after PwC's executive bio pages. Built as plain HTML / CSS / vanilla ES modules — no build step, no framework — so it can be hosted on any static host (GitHub Pages, Netlify, Vercel, S3, etc.) without configuration.

## Project structure

```
portfolio/
├── index.html                  Single page — semantic HTML, no logic
├── README.md                   You are here
│
├── assets/
│   └── profile.jpg             Hero photo, also used as chat avatar & favicon
│
├── css/                        Loaded in dependency order from index.html
│   ├── base.css                Design tokens, theme variants, reset, typography
│   ├── layout.css              Page chrome: nav, hero, footer
│   ├── components.css          Reusable: theme picker, buttons, scroll bar, back-to-top
│   ├── sections.css            Per-section: bio, glance, experience, projects, tech, contact
│   ├── widgets.css             AI chat widget (isolated)
│   └── responsive.css          Media queries (loaded last so it overrides)
│
├── js/                         ES modules (`<script type="module">`)
│   ├── main.js                 Entry — imports and inits each feature module
│   ├── themePicker.js          Color theme dropdown + localStorage persistence
│   ├── scrollFx.js             Scroll progress bar + nav hide-on-scroll
│   ├── backToTop.js            Back-to-top button
│   ├── projectReveal.js        IntersectionObserver-driven card entrance
│   ├── chat.js                 Chat widget controller
│   └── chat/
│       ├── config.js           Chat backend mode & settings
│       ├── knowledge.js        System prompt / bio facts
│       ├── api.js              Three response strategies (direct/proxy/fallback)
│       └── ui.js               DOM helpers (rendering, formatting)
│
└── api/
    └── chat-proxy.example.js   Reference serverless function for production
```

## Running locally

Because the JS uses ES module imports, **opening `index.html` directly with `file://` will fail** with a CORS error and several features (theme picker, project animations, chat) will not work. Use any local static server. From inside the project directory:

```bash
# Python (no install needed on most systems)
python3 -m http.server 8000

# Node (if you have it)
npx serve

# Or VS Code Live Server extension
```

Then open <http://localhost:8000>.

> **Note:** The project gracefully degrades if JS fails — content stays visible (just without animations) — but you really do want a local server for development. Open DevTools' Console tab if anything looks broken; CORS errors are the usual cause.

## Customizing

| Want to change... | Edit |
|---|---|
| Hero text, projects, experience, contact info | `index.html` |
| Default theme color or add a new theme | `css/base.css` (the `:root` and `[data-theme="..."]` blocks) |
| Bio facts the AI knows about | `js/chat/knowledge.js` |
| Chat suggestion chips | `index.html`, search `chat-suggestion` |
| Chat backend (fallback / direct API / proxy) | `js/chat/config.js` (`mode` field) |

## AI chat — three modes

The chat widget supports three backends, set in `js/chat/config.js`:

### 1. `mode: 'fallback'` (default — no setup)
Rule-based local responses. Works immediately, no network calls, no key. Covers all common recruiter questions through keyword matching against the bio.

### 2. `mode: 'direct'` (local development only)
Browser calls Anthropic API directly. Set `claudeApiKey` in `config.js`.

⚠️ **Never deploy this mode publicly.** Anyone viewing the page source can copy the key and rack up charges on your account.

### 3. `mode: 'proxy'` (recommended for production)
Browser calls your own backend at `proxyEndpoint`, which holds the API key server-side.

A reference implementation is provided in `api/chat-proxy.example.js`. To deploy on Vercel:
1. Copy `api/chat-proxy.example.js` to `api/chat.js`
2. Paste the contents of `js/chat/knowledge.js` into the `KNOWLEDGE` constant in `chat.js`
3. Set the `ANTHROPIC_API_KEY` environment variable in your Vercel dashboard
4. Set `mode: 'proxy'` and `proxyEndpoint: '/api/chat'` in `js/chat/config.js`
5. Deploy

## Deploying

This is a fully static site — drop the contents of the project folder onto:

- **Netlify Drop** — drag the folder onto <https://app.netlify.com/drop>
- **GitHub Pages** — push to a `username.github.io` repo
- **Vercel** — `vercel deploy` (also gives you serverless functions for the proxy)
- **Cloudflare Pages** — `wrangler pages deploy`
- Any static host (S3, Firebase Hosting, etc.)

## Browser support

- Modern Chrome, Firefox, Safari, Edge
- Uses `IntersectionObserver`, ES modules, CSS custom properties, `:has()` not required
- Graceful degradation: project cards reveal immediately if `IntersectionObserver` is missing; localStorage failures fall back to default theme
- Honors `prefers-reduced-motion`
