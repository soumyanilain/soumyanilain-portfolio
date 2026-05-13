/**
 * backToTop.js — Back-to-top button
 *
 * Shows the button once the user has scrolled past 400px. Clicking it smooth-
 * scrolls back to the top of the page.
 */

const SHOW_THRESHOLD = 400;

export function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;

  function update() {
    const cur = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle('visible', cur > SHOW_THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  update();
}
