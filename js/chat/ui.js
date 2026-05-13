/**
 * chat/ui.js — Pure UI helpers for the chat widget
 *
 * Anything that touches the DOM but doesn't talk to the network lives here.
 */

/**
 * Format a message string into safe HTML.
 *   • escapes <, >, & to prevent XSS
 *   • converts **bold** to <strong>
 *   • turns http(s) URLs into anchor tags
 *   • splits on blank lines into <p>, single \n into <br>
 */
export function formatMessage(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .split(/\n\n+/)
    .map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>')
    .join('');
}

/** Append a chat message bubble. Returns the created element. */
export function appendMessage(container, text, role) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + role;
  div.innerHTML = formatMessage(text);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

/** Show the three-dot typing indicator. Returns the element. */
export function showTyping(container) {
  const t = document.createElement('div');
  t.className = 'chat-typing';
  t.id = 'chatTyping';
  t.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(t);
  container.scrollTop = container.scrollHeight;
  return t;
}

/** Remove the typing indicator if present. */
export function hideTyping() {
  document.getElementById('chatTyping')?.remove();
}
