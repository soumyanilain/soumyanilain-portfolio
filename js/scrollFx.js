/**
 * scrollFx.js — Scroll-driven UI effects
 *
 * • Updates the top progress bar to reflect how far the user has scrolled.
 * • Hides the sticky nav on scroll-down past 200px, shows it on scroll-up.
 *
 * Uses requestAnimationFrame so we only do one calculation per frame.
 */

export function initScrollFx() {
  const nav = document.querySelector('.topnav');
  const progressFill = document.getElementById('scrollProgressFill');
  if (!nav && !progressFill) return;

  let lastScroll = 0;
  let ticking = false;

  function update() {
    const cur = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (cur / docHeight) * 100 : 0;

    if (progressFill) {
      progressFill.style.width = progress + '%';
    }

    if (nav) {
      nav.style.transition = 'transform 0.3s ease';
      if (cur > lastScroll && cur > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    }

    lastScroll = cur;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}
