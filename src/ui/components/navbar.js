export function renderNavbar(activePage = '') {
  const navItems = [
    { href: '/index.html', label: 'Начало', page: 'landing' },
    { href: '/catalog.html', label: 'Каталог', page: 'catalog' },
    { href: '/cart.html', label: 'Кошница', page: 'cart' },
    { href: '/orders.html', label: 'Моите поръчки', page: 'orders' },
    { href: '/admin.html', label: 'Админ', page: 'admin' },
    { href: '/login.html', label: 'Вход', page: 'login' }
  ];

  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container-fluid">
        <a class="navbar-brand" href="/index.html">🥬 FreshBox</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            ${navItems.map(item => `
              <li class="nav-item">
                <a class="nav-link ${activePage === item.page ? 'active' : ''}" href="${item.href}">${item.label}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </nav>
  `;
}
