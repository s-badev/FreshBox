import { getSession, signOut } from '../../services/authService.js';
import { isAdmin } from '../../services/roleService.js';
import { getTotals } from '../../services/cartService.js';

export async function renderNavbar(activePage = '') {
  // Check if user is logged in and if they are admin
  let isLoggedIn = false;
  let userIsAdmin = false;
  
  try {
    const session = await getSession();
    isLoggedIn = !!session;
    
    if (isLoggedIn) {
      userIsAdmin = await isAdmin();
    }
  } catch (error) {
    console.error('Session check error:', error);
  }

  const navItems = [
    { href: '/index.html', label: 'Начало', page: 'landing' },
    { href: '/catalog.html', label: 'Каталог', page: 'catalog' },
    { href: '/cart.html', label: 'Кошница', page: 'cart' },
    { href: '/orders.html', label: 'Моите поръчки', page: 'orders' }
  ];
  
  // Add admin link only for admins
  if (userIsAdmin) {
    navItems.push({ href: '/admin.html', label: 'Админ', page: 'admin' });
  }

  return `
    <nav class="freshbox-nav navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="/index.html">🥬 FreshBox</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            ${navItems.map(item => {
              const isCart = item.page === 'cart';
              const badge = isCart ? `<span class="nav-cart-badge" id="cartBadge">${getTotals().itemsCount || ''}</span>` : '';
              return `
              <li class="nav-item">
                <a class="nav-link ${activePage === item.page ? 'active' : ''}" href="${item.href}">${item.label}${badge}</a>
              </li>
            `;}).join('')}
            ${isLoggedIn ? `
              <li class="nav-item">
                <button class="nav-link btn btn-link nav-logout-btn" id="logoutBtn">Изход</button>
              </li>
            ` : `
              <li class="nav-item">
                <a class="nav-link ${activePage === 'login' ? 'active' : ''}" href="/login.html">Вход</a>
              </li>
            `}
          </ul>
        </div>
      </div>
    </nav>
  `;
}

// Setup logout handler after navbar is rendered
export function setupNavbarHandlers() {
  const logoutBtn = document.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut();
        window.location.href = '/index.html';
      } catch (error) {
        console.error('Logout error:', error);
        alert('Грешка при изход: ' + error.message);
      }
    });
  }
}

/**
 * Обновява бройката на cart badge в навигацията
 */
export function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = getTotals().itemsCount;
    badge.textContent = count || '';
  }
}
