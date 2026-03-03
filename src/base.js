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
