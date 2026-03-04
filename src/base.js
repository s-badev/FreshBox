import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/app.css';

/* Smooth reveal — remove FOUC hide set by inline <style> in HTML */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () =>
    requestAnimationFrame(() => document.body.classList.add('fb-ready'))
  );
} else {
  requestAnimationFrame(() => document.body.classList.add('fb-ready'));
}

/* Back-to-top button */
(() => {
  const btn = document.createElement('button');
  btn.className = 'fb-back-to-top';
  btn.setAttribute('aria-label', 'Нагоре');
  btn.innerHTML = '&#8679;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
