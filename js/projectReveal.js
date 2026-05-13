/**
 * projectReveal.js — Project cards entrance animation
 *
 * Uses IntersectionObserver to add 'is-visible' to each project card as it
 * enters the viewport. The CSS handles the transform/opacity transition and
 * stagger delay. Reveals once and stops observing the card.
 *
 * Falls back to immediate reveal in browsers without IntersectionObserver.
 */

export function initProjectReveal() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  cards.forEach(card => observer.observe(card));
}
