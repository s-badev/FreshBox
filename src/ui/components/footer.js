/**
 * FreshBox Global Footer Component (production-ready, eBag-inspired)
 *
 * Exports:
 *   renderFooter() -> HTML string
 */

export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <footer class="fb-footer">

      <!-- ═══ Layer 1: Support Strip ═══ -->
      <div class="fb-footer-support">
        <div class="container">
          <div class="fb-support-grid">
            <div class="fb-support-card">
              <div class="fb-support-icon"><i class="bi bi-chat-dots-fill"></i></div>
              <div class="fb-support-body">
                <span class="fb-support-title">Онлайн чат</span>
                <span class="fb-support-sub">Пон – Нед, 08 – 22 ч</span>
              </div>
            </div>
            <div class="fb-support-card">
              <div class="fb-support-icon"><i class="bi bi-telephone-fill"></i></div>
              <div class="fb-support-body">
                <span class="fb-support-title">0700 12 345</span>
                <span class="fb-support-sub">Безплатно обаждане</span>
              </div>
            </div>
            <div class="fb-support-card">
              <div class="fb-support-icon"><i class="bi bi-whatsapp"></i></div>
              <div class="fb-support-body">
                <span class="fb-support-title">+359 88 123 4567</span>
                <span class="fb-support-sub">Viber / WhatsApp</span>
              </div>
            </div>
            <div class="fb-support-card">
              <div class="fb-support-icon"><i class="bi bi-envelope-fill"></i></div>
              <div class="fb-support-body">
                <span class="fb-support-title">info@freshbox.bg</span>
                <span class="fb-support-sub">Отговаряме до 24 ч</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Layer 2: App Banner ═══ -->
      <div class="fb-footer-app">
        <div class="container">
          <div class="fb-app-inner">
            <div class="fb-app-qr" role="img" aria-label="QR код (демо)">
              <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
                <rect width="64" height="64" fill="#fff"/>
                <rect x="4" y="4" width="18" height="18" fill="#0b0f14"/>
                <rect x="7" y="7" width="12" height="12" fill="#fff"/>
                <rect x="10" y="10" width="6" height="6" fill="#0b0f14"/>
                <rect x="42" y="4" width="18" height="18" fill="#0b0f14"/>
                <rect x="45" y="7" width="12" height="12" fill="#fff"/>
                <rect x="48" y="10" width="6" height="6" fill="#0b0f14"/>
                <rect x="4" y="42" width="18" height="18" fill="#0b0f14"/>
                <rect x="7" y="45" width="12" height="12" fill="#fff"/>
                <rect x="10" y="48" width="6" height="6" fill="#0b0f14"/>
                <rect x="26" y="8"  width="4" height="4" fill="#0b0f14"/>
                <rect x="32" y="8"  width="4" height="4" fill="#0b0f14"/>
                <rect x="26" y="14" width="4" height="4" fill="#0b0f14"/>
                <rect x="36" y="14" width="4" height="4" fill="#0b0f14"/>
                <rect x="24" y="22" width="4" height="4" fill="#0b0f14"/>
                <rect x="30" y="22" width="4" height="4" fill="#0b0f14"/>
                <rect x="36" y="22" width="4" height="4" fill="#0b0f14"/>
                <rect x="42" y="22" width="4" height="4" fill="#0b0f14"/>
                <rect x="26" y="30" width="4" height="4" fill="#0b0f14"/>
                <rect x="34" y="30" width="4" height="4" fill="#0b0f14"/>
                <rect x="42" y="30" width="4" height="4" fill="#0b0f14"/>
                <rect x="24" y="36" width="4" height="4" fill="#0b0f14"/>
                <rect x="30" y="36" width="4" height="4" fill="#0b0f14"/>
                <rect x="38" y="36" width="4" height="4" fill="#0b0f14"/>
                <rect x="26" y="44" width="4" height="4" fill="#0b0f14"/>
                <rect x="32" y="44" width="4" height="4" fill="#0b0f14"/>
                <rect x="38" y="44" width="4" height="4" fill="#0b0f14"/>
                <rect x="44" y="44" width="4" height="4" fill="#0b0f14"/>
                <rect x="26" y="50" width="4" height="4" fill="#0b0f14"/>
                <rect x="34" y="50" width="4" height="4" fill="#0b0f14"/>
                <rect x="42" y="50" width="4" height="4" fill="#0b0f14"/>
              </svg>
            </div>
            <div class="fb-app-copy">
              <strong class="fb-app-title">Свали приложението FreshBox</strong>
              <span class="fb-app-sub">Пазарувай бързо и удобно от телефона си</span>
            </div>
            <div class="fb-app-stores">
              <a href="#" class="fb-store-btn"><i class="bi bi-google-play"></i> Google Play</a>
              <a href="#" class="fb-store-btn"><i class="bi bi-apple"></i> App Store</a>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Layer 3: Main Footer ═══ -->
      <div class="fb-footer-main">
        <div class="container">
          <div class="fb-footer-grid">

            <!-- Col 1: Info links -->
            <div class="fb-fcol">
              <h6 class="fb-fcol-heading">Информация</h6>
              <ul class="fb-fcol-links">
                <li><a href="/catalog.html">Каталог</a></li>
                <li><a href="#">Доставка</a></li>
                <li><a href="#">Често задавани въпроси</a></li>
                <li><a href="#">Абонаменти</a></li>
                <li><a href="#">Свържи се с нас</a></li>
              </ul>
            </div>

            <!-- Col 2: About links -->
            <div class="fb-fcol">
              <h6 class="fb-fcol-heading">За нас</h6>
              <ul class="fb-fcol-links">
                <li><a href="#">Нашата история</a></li>
                <li><a href="#">Отзиви</a></li>
                <li><a href="#">Кариери</a></li>
                <li><a href="#">Новини</a></li>
                <li><a href="#">Партньори</a></li>
              </ul>
            </div>

            <!-- Col 3: Social + Payments -->
            <div class="fb-fcol">
              <h6 class="fb-fcol-heading">Последвай ни</h6>
              <div class="fb-social-row">
                <a class="fb-social-link" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a class="fb-social-link" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a class="fb-social-link" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                <a class="fb-social-link" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                <a class="fb-social-link" href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
              </div>

              <h6 class="fb-fcol-heading fb-fcol-heading--mt">Приемаме</h6>
              <div class="fb-pay-row">
                <span class="fb-pay-pill">Visa</span>
                <span class="fb-pay-pill">Mastercard</span>
                <span class="fb-pay-pill">Apple Pay</span>
                <span class="fb-pay-pill">Google Pay</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══ Bottom Bar ═══ -->
      <div class="fb-footer-bottom">
        <div class="container">
          <div class="fb-bottom-inner">
            <span class="fb-bottom-copy">&copy; ${year} FreshBox. Всички права запазени.</span>
            <div class="fb-bottom-legal">
              <a href="#">Общи условия</a>
              <span class="fb-bottom-sep">&middot;</span>
              <a href="#">Политика за поверителност</a>
              <span class="fb-bottom-sep">&middot;</span>
              <a href="#">Бисквитки</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  `;
}
