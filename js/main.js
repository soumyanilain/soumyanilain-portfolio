/**
 * main.js — Entry point
 *
 * Imports each feature module and calls its init() function. Each module is
 * self-contained: it queries its own DOM nodes, attaches its own listeners,
 * and exposes a single init() function. If a feature's DOM nodes are absent,
 * the module silently no-ops, so partial pages still work.
 */

import { initThemePicker } from './themePicker.js';
import { initScrollFx } from './scrollFx.js';
import { initBackToTop } from './backToTop.js';
import { initProjectReveal } from './projectReveal.js';
import { initChat } from './chat.js';
import { initFooterUpdated } from './footerUpdated.js';

document.addEventListener('DOMContentLoaded', () => {
  // Signal to CSS that JS loaded successfully. The reveal-on-scroll animation
  // on project cards is scoped to `body.js-ready` so cards stay visible if JS
  // fails to load (e.g. when index.html is opened via file://).
  document.body.classList.add('js-ready');

  initThemePicker();
  initScrollFx();
  initBackToTop();
  initProjectReveal();
  initChat();
  initFooterUpdated();
});
