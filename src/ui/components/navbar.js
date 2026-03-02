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

  const cartCount = getTotals().itemsCount || '';

  return `
    <header class="fb-header">
      <!-- Row 1: Logo + Search + Icons -->
      <div class="fb-header-row1">
        <a class="fb-header-brand" href="/index.html">🥬 FreshBox</a>

        <div class="fb-header-search">
          <input type="text" id="headerSearchInput" placeholder="Търси продукти..." aria-label="Търсене">
          <button type="button" class="fb-header-search-btn" id="headerSearchBtn" aria-label="Търси">🔍</button>
        </div>

        <div class="fb-header-icons">
          ${isLoggedIn ? `
            <a href="/orders.html" class="fb-header-icon-btn" title="Моите поръчки">📋</a>
          ` : ''}
          <a href="/cart.html" class="fb-header-icon-btn" title="Кошница">
            🛒<span class="fb-header-cart-count" id="cartBadge">${cartCount}</span>
          </a>
          ${!isLoggedIn ? `
            <a href="/login.html" class="fb-header-icon-btn" title="Вход">👤</a>
          ` : ''}
        </div>
      </div>

      <!-- Row 2: Navigation links -->
      <div class="fb-header-row2">
        <nav class="fb-header-row2-inner">
          ${navItems.map(item =>
            `<a class="fb-header-nav-link ${activePage === item.page ? 'active' : ''}" href="${item.href}">${item.label}</a>`
          ).join('')}
          ${isLoggedIn ? `
            <button class="fb-header-logout-btn" id="logoutBtn">Изход</button>
          ` : `
            <a class="fb-header-nav-link ${activePage === 'login' ? 'active' : ''}" href="/login.html">Вход</a>
          `}
        </nav>
      </div>
    </header>
  `;
}

// Setup logout + search handler after navbar is rendered
export function setupNavbarHandlers() {
  // Logout
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

  // Header search
  const searchInput = document.querySelector('#headerSearchInput');
  const searchBtn = document.querySelector('#headerSearchBtn');

  if (searchInput && searchBtn) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (!q) return;

      // If we're on catalog page, update the filter directly
      const catalogSearchInput = document.querySelector('#searchInput');
      if (catalogSearchInput) {
        catalogSearchInput.value = q;
        catalogSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.value = '';
      } else {
        // Navigate to catalog with query param
        window.location.href = `/catalog.html?q=${encodeURIComponent(q)}`;
      }
    };

    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
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
