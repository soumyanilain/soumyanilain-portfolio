/**
 * chat.js — AI chat widget controller
 *
 * Wires together the DOM (defined in index.html), UI helpers (chat/ui.js),
 * and the backend dispatcher (chat/api.js). Handles open/close, message
 * submission, conversation history, and error states.
 */

import { CHAT_CONFIG } from './chat/config.js';
import { getResponse } from './chat/api.js';
import { appendMessage, showTyping, hideTyping } from './chat/ui.js';

export function initChat() {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const suggestions = document.getElementById('chatSuggestions');

  if (!fab || !panel || !form || !input) return;

  // Conversation memory (in-memory only — clears on page reload)
  const conversation = [];

  // ----- Open / close ----------------------------------------------------
  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.add('hidden');
    setTimeout(() => input.focus(), 280);
  }
  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.classList.remove('hidden');
  }
  fab.addEventListener('click', openChat);
  closeBtn?.addEventListener('click', closeChat);

  // ----- Input UX --------------------------------------------------------
  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 96) + 'px';
    sendBtn.disabled = !input.value.trim();
  });

  // Enter to send, Shift+Enter for newline
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // Suggestion chips → populate input and submit
  suggestions?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-suggestion');
    if (!btn) return;
    input.value = btn.dataset.q;
    input.dispatchEvent(new Event('input'));
    form.requestSubmit();
  });

  // ----- Submit handler --------------------------------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Hide suggestion chips after first user message
    if (suggestions) suggestions.style.display = 'none';

    appendMessage(messages, text, 'user');
    conversation.push({ role: 'user', content: text });

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    showTyping(messages);

    try {
      const reply = await getResponse({ messages: conversation });
      hideTyping();
      appendMessage(messages, reply, 'bot');
      conversation.push({ role: 'assistant', content: reply });

      // Cap history length
      if (conversation.length > CHAT_CONFIG.historyLimit) {
        conversation.splice(0, conversation.length - CHAT_CONFIG.historyLimit);
      }
    } catch (err) {
      hideTyping();
      console.error('[chat] error:', err);
      appendMessage(
        messages,
        "Sorry — I had trouble reaching the AI service. You can email Soumyanil directly at soumyanilain@gmail.com.",
        'error'
      );
    }
  });
}
