/**
 * FreshBox Global Footer Component (eBag-inspired)
 *
 * Exports:
 *   renderFooter() -> HTML string
 */

export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="fb-footer">

      <!-- ── Contact chips row ── -->
      <div class="fb-footer-top">
        <div class="container">
          <div class="fb-footer-chips">
            <div class="fb-footer-chip">
              <span class="fb-footer-chip-icon"><i class="bi bi-chat-dots"></i></span>
              <div class="fb-footer-chip-text">
                <span class="fb-footer-chip-label">Онлайн чат</span>
                <span class="fb-footer-chip-sub">Пон – Нед, 08 – 22ч</span>
              </div>
            </div>
            <div class="fb-footer-chip">
              <span class="fb-footer-chip-icon"><i class="bi bi-telephone"></i></span>
              <div class="fb-footer-chip-text">
                <span class="fb-footer-chip-label">0700 12 345</span>
                <span class="fb-footer-chip-sub">Безплатно обаждане</span>
              </div>
            </div>
            <div class="fb-footer-chip">
              <span class="fb-footer-chip-icon"><i class="bi bi-phone"></i></span>
              <div class="fb-footer-chip-text">
                <span class="fb-footer-chip-label">+359 88 123 4567</span>
                <span class="fb-footer-chip-sub">Viber / WhatsApp</span>
              </div>
            </div>
            <div class="fb-footer-chip">
              <span class="fb-footer-chip-icon"><i class="bi bi-envelope"></i></span>
              <div class="fb-footer-chip-text">
                <span class="fb-footer-chip-label">info@freshbox.bg</span>
                <span class="fb-footer-chip-sub">Отговаряме до 24ч</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── App promo strip ── -->
      <div class="fb-footer-app">
        <div class="container">
          <div class="fb-footer-app-inner">
            <div class="fb-footer-qr" aria-label="QR код">QR</div>
            <div class="fb-footer-app-text">
              <span class="fb-footer-app-title">Свали приложението FreshBox</span>
              <span class="fb-footer-app-sub">Пазарувай бързо и удобно от телефона си</span>
            </div>
            <div class="fb-footer-app-badges">
              <span class="fb-footer-badge">▶ Google Play</span>
              <span class="fb-footer-badge"> App Store</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Link columns ── -->
      <div class="fb-footer-links">
        <div class="container">
          <div class="fb-footer-links-grid">
            <div class="fb-footer-col">
              <h6 class="fb-footer-col-title">Информация</h6>
              <ul class="fb-footer-col-list">
                <li><a href="/catalog.html">Каталог</a></li>
                <li><a href="#">Доставка</a></li>
                <li><a href="#">Често задавани въпроси</a></li>
                <li><a href="#">Абонаменти</a></li>
                <li><a href="#">Свържи се с нас</a></li>
              </ul>
            </div>
            <div class="fb-footer-col">
              <h6 class="fb-footer-col-title">За нас</h6>
              <ul class="fb-footer-col-list">
                <li><a href="#">Нашата история</a></li>
                <li><a href="#">Отзиви</a></li>
                <li><a href="#">Кариери</a></li>
                <li><a href="#">Новини</a></li>
                <li><a href="#">Партньори</a></li>
              </ul>
            </div>
            <div class="fb-footer-col">
              <h6 class="fb-footer-col-title">Последвай ни</h6>
              <div class="fb-footer-social-row">
                <a class="fb-social" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a class="fb-social" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a class="fb-social" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                <a class="fb-social" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                <a class="fb-social" href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
              </div>
            </div>
            <div class="fb-footer-col">
              <h6 class="fb-footer-col-title">Приемаме</h6>
              <div class="fb-footer-payments">
                <span class="fb-pay-pill">VISA</span>
                <span class="fb-pay-pill">Mastercard</span>
                <span class="fb-pay-pill">Apple Pay</span>
                <span class="fb-pay-pill">Google Pay</span>
                <span class="fb-pay-pill">Наложен платеж</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Bottom legal bar ── -->
      <div class="fb-footer-bottom">
        <div class="container">
          <div class="fb-footer-bottom-inner">
            <span class="fb-footer-copy">© ${year} FreshBox. Всички права запазени.</span>
            <div class="fb-footer-legal">
              <a href="#">Общи условия</a>
              <span class="fb-footer-dot">·</span>
              <a href="#">Политика за поверителност</a>
              <span class="fb-footer-dot">·</span>
              <a href="#">Бисквитки</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  `;
}
