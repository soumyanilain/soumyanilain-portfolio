/**
 * chat/api.js — Response strategies for the chat widget
 *
 * Exports a single async getResponse({ messages }) function that dispatches
 * to one of three backends based on CHAT_CONFIG.mode:
 *
 *   • 'proxy'    — POST to your own backend (recommended in production)
 *   • 'direct'   — Call Anthropic directly from the browser (dev only)
 *   • 'fallback' — Local rule-based responses (no API calls)
 */

import { CHAT_CONFIG } from './config.js';
import { KNOWLEDGE } from './knowledge.js';

// ----- Local rule-based fallback ------------------------------------------
function localFallback(question) {
  const q = question.toLowerCase();
  if (/intern|co-?op|new grad|2027|looking for|opportunit|seeking|open to|available/.test(q)) {
    return "He's seeking **2027 New Grad** full-time roles (starting after his May 2027 graduation) and **Spring 2027 Co-op** roles in software engineering, data, cloud, and analytics. He's based in Charlotte, NC and open to relocating anywhere in the US. Reach out at soumyanilain@gmail.com to discuss opportunities.";
  }
  if (/pwc|experience|work|job/.test(q)) {
    return "Soumyanil worked at **PwC Acceleration Centers** for three years (Aug 2022 – Aug 2025) as a Software Development Engineer. He built enterprise full-stack features in Java, Spring Boot, and React, integrated with AWS and Azure, and contributed to data pipelines processing millions of records. He started as an intern in summer 2022 and converted to a return offer. Since September 2026 he's also been a Graduate Teaching Assistant at UNC Charlotte for ITIS 3300: Software Requirements, Analysis & Testing.";
  }
  if (/notebooklm|notebook|sourcebook|\brag\b|retrieval|cloud run/.test(q)) {
    return "**Sourcebook** is his NotebookLM-style RAG app. You add PDFs, slide decks, text files or web pages to a notebook, ask questions and get answers cited down to the page or slide, and generate reports, quizzes and flashcards. It uses hybrid BM25 + vector retrieval (picked after benchmarking four retrieval strategies) and deploys to Google Cloud Run through a GitHub Actions CI/CD pipeline. Try it at https://notebooklm-clone-wbot2pofva-uc.a.run.app (the first load can take ~20 seconds while it wakes up).";
  }
  if (/motionlcm|motion/.test(q)) {
    return "**MotionLCM** is a real-time text-to-motion generation app he built based on the ECCV 2024 paper on latent consistency distillation. It's deployed publicly on Hugging Face Spaces with a Gradio interface, custom example prompts, an architecture diagram, and benchmarking against the base diffusion model. Try it at huggingface.co/spaces/soumyanilain/MotionLCM";
  }
  if (/matchtara|hiring|ta\/ra|platform/.test(q)) {
    return "**MatchTARA** is a full-stack TA/RA hiring platform for university departments. It has a job board, position creation for faculty, student application submission, and authentication. Stack: React + Node.js/Express + PostgreSQL + Prisma in a monorepo. Repo at github.com/soumyanilain/MatchTARA";
  }
  if (/teach|\bta\b|assistant|itis|3300/.test(q)) {
    return "Since September 2026 he's been a **Graduate Teaching Assistant** in UNC Charlotte's Department of Computer Science, supporting ITIS 3300: Software Requirements, Analysis & Testing under Dr. Frazier Smith.";
  }
  if (/tech|stack|skill|language|framework/.test(q)) {
    return "His core stack:\n\n**Languages:** Java, JavaScript/TypeScript, Python, SQL\n**Frameworks:** Spring Boot, React, Angular, Node.js/Express, FastAPI\n**Cloud & Data:** AWS, Azure, Docker, Kubernetes, PostgreSQL, MongoDB, Kafka\n**ML & Visualization:** PyTorch, Hugging Face, Gradio, D3.js, Tableau";
  }
  if (/education|study|university|college|gpa|degree|school/.test(q)) {
    return "He's pursuing an **MS in Computer Science at UNC Charlotte**, graduating May 2027. His undergrad was a B.Tech in Electronics and Communication Engineering from SRM Institute of Science and Technology (2018–2022). He also holds AWS Cloud Practitioner and Azure Fundamentals certifications.";
  }
  if (/contact|email|phone|reach/.test(q)) {
    return "Reach Soumyanil at **soumyanilain@gmail.com** or +1 (980) 406-2716. He's also on LinkedIn (linkedin.com/in/soumyanilain) and GitHub (github.com/soumyanilain).";
  }
  if (/project|portfolio|build/.test(q)) {
    return "His featured projects are:\n\n1. **Sourcebook** — NotebookLM-style RAG app with cited answers (Python, ChromaDB, Cloud Run)\n2. **MotionLCM** — real-time text-to-motion (PyTorch, Gradio, deployed on HF Spaces)\n3. **MatchTARA** — TA/RA hiring platform (React, Node, Postgres, Prisma)\n4. **Netflix Viewing Behavior** — Observable Framework EDA dashboard\n5. **Tableau Portfolio** — public dashboards for business analytics\n\nScroll up to the Selected Work section for details and links.";
  }
  if (/^(hi|hello|hey)/.test(q)) {
    return "Hi there! Ask me anything about Soumyanil's experience, projects, tech stack, or what he's looking for next.";
  }
  return "I have info on Soumyanil's experience at PwC, his projects (Sourcebook, MotionLCM, MatchTARA, Netflix Viewing Behavior, Tableau Portfolio), tech stack, education at UNC Charlotte, his Graduate Teaching Assistant role, and his 2027 New Grad and Spring 2027 Co-op search. What would you like to know? You can also email him directly at soumyanilain@gmail.com.";
}

// ----- Direct call to Anthropic API (browser → API) -----------------------
async function callDirect(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CHAT_CONFIG.claudeApiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CHAT_CONFIG.model,
      max_tokens: CHAT_CONFIG.maxTokens,
      system: KNOWLEDGE,
      messages: messages
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');
}

// ----- Backend proxy call (browser → your backend → Anthropic) ------------
async function callProxy(messages) {
  const res = await fetch(CHAT_CONFIG.proxyEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Proxy error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.reply || '';
}

// ----- Public dispatcher --------------------------------------------------
export async function getResponse({ messages }) {
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const userText = lastUser ? lastUser.content : '';

  switch (CHAT_CONFIG.mode) {
    case 'direct':
      if (!CHAT_CONFIG.claudeApiKey) {
        console.warn('[chat] direct mode but no API key — using fallback');
        await new Promise(r => setTimeout(r, 600));
        return localFallback(userText);
      }
      return callDirect(messages);

    case 'proxy':
      return callProxy(messages);

    case 'fallback':
    default:
      // Add a small artificial delay so the typing indicator feels real
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
      return localFallback(userText);
  }
}
