# Soumyanil Ain — Portfolio Website

**Live site:** <https://soumyanilain-portfolio.netlify.app>

My personal portfolio. The layout is modeled on corporate executive bio pages: a photo-and-summary hero, then sections for my background, experience and projects. It's plain HTML, CSS and vanilla JavaScript modules with no framework and no build step. It's hosted on Netlify and redeploys automatically whenever I push to `main`.

## What's on the site

- **Hero:** photo, current role, location, contact, LinkedIn and GitHub
- **About:** a short bio covering PwC, my MS at UNC Charlotte and what I'm looking for next
- **At a glance:** areas of focus, education and certifications (AWS Cloud Practitioner, Azure Fundamentals)
- **Experience:** a timeline, newest first, with current roles highlighted: Graduate Teaching Assistant at UNC Charlotte, MS in Computer Science, and three years at PwC Acceleration Centers
- **Selected work:** live demo and GitHub links for each project
  - [Sourcebook — NotebookLM Clone](https://notebooklm-clone-wbot2pofva-uc.a.run.app): RAG app with cited answers, reports, quizzes and flashcards (Python, ChromaDB, Gradio), deployed to Google Cloud Run with GitHub Actions ([code](https://github.com/soumyanilain/notebooklm-clone))
  - [MotionLCM](https://huggingface.co/spaces/soumyanilain/MotionLCM): real-time text-to-motion generation (ECCV 2024), on Hugging Face Spaces
  - [MatchTARA](https://matchtara.netlify.app/): full-stack TA/RA hiring platform (React, Node.js, PostgreSQL, Prisma)
  - [Netflix Viewing Behavior](https://observable-prep-work.observablehq.cloud/netflix-viewing-behavior-analysis): interactive EDA dashboard (Observable, D3.js)
  - [Tableau Portfolio](https://public.tableau.com/app/profile/soumyanil.ain/vizzes): business analytics dashboards
- **Toolkit and contact:** tech stack and a contact section. I'm seeking 2027 New Grad and Spring 2027 Co-op roles.

## Features

- **Five color themes:** Forest green (default), Orange, Blue, Burgundy and Charcoal. The choice is saved in the browser.
- **"Ask AI" chat widget:** answers common recruiter questions about my experience, projects, stack and job search
- **Scroll extras:** a progress bar along the top, a back-to-top button, and a nav bar that hides while scrolling down
- **Project card animations:** cards fade in as you scroll to them, and this turns off for visitors who prefer reduced motion
- **Responsive:** works from wide desktops down to phones
- **"Page updated" date:** a small info button in the footer; click it to see when the site was last published. The date is stamped automatically on every deploy.
- **Search and link previews:** meta and Open Graph tags, structured data for my profile, `robots.txt` and `sitemap.xml`

## Tech

HTML · CSS (custom properties, grid) · JavaScript ES modules · IBM Plex fonts · Netlify

## Project structure

```
├── index.html                  The whole page: content, meta tags, structured data
├── robots.txt                  Crawler rules + sitemap location
├── sitemap.xml                 Single-page sitemap
├── netlify.toml                Netlify settings: publish folder + the date-stamp build step
├── scripts/
│   └── stamp-updated-date.sh   Writes the deploy date into the page, structured data and sitemap
├── assets/
│   └── profile.jpg             Hero photo (also the chat avatar and favicon)
├── css/                        Loaded in this order from index.html
│   ├── base.css                Color tokens, theme variants, reset, typography
│   ├── layout.css              Nav, hero, footer
│   ├── components.css          Theme picker, buttons, scroll bar, back-to-top
│   ├── sections.css            About, glance, experience timeline, projects, toolkit, contact
│   ├── widgets.css             AI chat widget
│   └── responsive.css          Breakpoints (loaded last so it wins)
├── js/
│   ├── main.js                 Entry point, starts every feature below
│   ├── themePicker.js          Theme dropdown + saved preference
│   ├── scrollFx.js             Progress bar + hide-on-scroll nav
│   ├── backToTop.js            Back-to-top button
│   ├── projectReveal.js        Project card entrance animation
│   ├── footerUpdated.js        Footer info button that reveals the "Page updated" date
│   ├── chat.js                 Chat widget controller
│   └── chat/
│       ├── config.js           Chat mode (fallback / direct / proxy)
│       ├── knowledge.js        Facts about me that the AI uses
│       ├── api.js              Response logic, including the keyword fallback answers
│       └── ui.js               Message rendering helpers
└── api/
    └── chat-proxy.example.js   Example serverless proxy for real AI answers
```

## Running locally

The JavaScript uses ES module imports, so double-clicking `index.html` (a `file://` URL) won't run the scripts. Serve the folder instead:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. `npx serve` or the VS Code Live Server extension work too.

If JavaScript fails to load, all the content still shows; you just lose the animations, themes and chat.

## Updating the site

| To change... | Edit |
|---|---|
| Hero, about, experience, projects, contact | `index.html` |
| Timeline look | `css/sections.css` (`.timeline-*`), plus the phone layout in `css/responsive.css` |
| Theme colors or the default theme | `css/base.css` and `DEFAULT_THEME` in `js/themePicker.js` |
| What the chat knows | `js/chat/knowledge.js` **and** the fallback answers in `js/chat/api.js` |
| Chat quick-question buttons | `index.html`, search for `chat-suggestion` |
| Search result / link preview text | The `<head>` of `index.html` |

The chat runs in fallback mode right now, so visitors see the keyword-matched answers in `api.js`. When something about me changes, update both chat files.

## Deploying

Netlify is connected to this repo, so every push to `main` goes live in about 30 seconds. The only build step is `scripts/stamp-updated-date.sh`, which sets the "Page updated" date, the structured-data `dateModified` and the sitemap `<lastmod>` to the deploy date (US Eastern). You never need to edit those dates by hand:

```bash
git add .
git commit -m "Describe the change"
git push
```

## AI chat modes

Set `mode` in `js/chat/config.js`:

- **`fallback`** (current): keyword-matched answers written in `api.js`. No API key, no network calls, no cost.
- **`direct`**: the browser calls the Anthropic API with a key in `config.js`. For local testing only. Never deploy this, because anyone can read the key from the page source.
- **`proxy`**: the browser calls a serverless function that keeps the API key on the server. `api/chat-proxy.example.js` shows how. Copy it to `api/chat.js`, set `ANTHROPIC_API_KEY` in the host's environment variables, and set `mode: 'proxy'`.

## Contact

Soumyanil Ain · [soumyanilain@gmail.com](mailto:soumyanilain@gmail.com) · [LinkedIn](https://www.linkedin.com/in/soumyanilain) · [GitHub](https://github.com/soumyanilain)

© 2026 Soumyanil Ain
