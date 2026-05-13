/**
 * themePicker.js — Color theme selector
 *
 * Toggles a dropdown of color swatches in the top nav. Sets `data-theme` on
 * <html>, which CSS uses to swap accent colors site-wide. Choice persists via
 * localStorage under the key 'portfolio-theme'.
 */

const STORAGE_KEY = 'portfolio-theme';
const DEFAULT_THEME = 'forest';

function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function saveTheme(name) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    /* localStorage may be disabled in private windows — silently ignore */
  }
}

export function initThemePicker() {
  const toggle = document.getElementById('themeToggle');
  const options = document.getElementById('themeOptions');
  if (!toggle || !options) return;

  const swatches = options.querySelectorAll('.theme-swatch');
  const root = document.documentElement;

  function applyTheme(name) {
    if (!name || name === DEFAULT_THEME) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', name);
    }
    swatches.forEach(sw => {
      sw.classList.toggle('active', sw.dataset.theme === (name || DEFAULT_THEME));
    });
    saveTheme(name || DEFAULT_THEME);
  }

  // Apply saved theme on load
  applyTheme(getSavedTheme());

  // Toggle dropdown
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = options.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Swatch click
  swatches.forEach(sw => {
    sw.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTheme(sw.dataset.theme);
      options.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click or Escape
  document.addEventListener('click', () => {
    options.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      options.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
