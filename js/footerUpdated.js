/**
 * footerUpdated.js — "Page updated" info button in the footer
 *
 * The footer shows a small info icon. Clicking it slides out
 * "Page updated <date>"; clicking it again, clicking anywhere else, or
 * pressing Escape hides it. The date itself is stamped at deploy time by
 * scripts/stamp-updated-date.sh (Netlify runs it, see netlify.toml).
 */

export function initFooterUpdated() {
  const button = document.getElementById('footerUpdated');
  if (!button) return;

  const setOpen = (open) => button.setAttribute('aria-expanded', open ? 'true' : 'false');

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
