import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { fetchCategories, fetchProducts, getProductImageUrl } from '../services/catalogService.js';

// Render navbar (async)
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('landing');
  setupNavbarHandlers();
})();

// Category emoji map (fallback for categories without custom icons)
const categoryIcons = {
  'Зеленчуци': '🥦',
  'Плодове': '🍎',
  'Млечни': '🧀',
  'Месо': '🥩',
  'Напитки': '🥤',
  'Хляб': '🍞',
  'Подправки': '🌿',
  'Замразени': '🧊',
};

function getCategoryIcon(name) {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '🛒';
}

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="landing-page">
    <!-- Hero Section -->
    <div class="text-center hero-section">
      <h1 class="display-4">🥬 Добре дошли във FreshBox</h1>
      <p class="lead">Пресни продукти доставени до вашата врата — бързо, удобно, качествено.</p>
      <div class="hero-features">
        <span class="hero-feature-item"><span class="hero-feature-icon">🚚</span> Бърза доставка</span>
        <span class="hero-feature-item"><span class="hero-feature-icon">✅</span> Гарантирана свежест</span>
        <span class="hero-feature-item"><span class="hero-feature-icon">💰</span> Отлични цени</span>
      </div>
      <div class="hero-cta-group">
        <a href="/catalog.html" class="btn btn-hero-primary btn-lg">Разгледай каталога</a>
        <a href="/orders.html" class="btn btn-hero-secondary btn-lg">Моите поръчки</a>
      </div>
    </div>

    <!-- Category Tiles -->
    <section class="mb-5">
      <h2 class="landing-section-title">Разгледай по категории</h2>
      <p class="landing-section-subtitle">Избери категория и открий любимите си продукти</p>
      <div id="categoryTiles" class="category-tiles-grid">
        <!-- Loaded dynamically -->
      </div>
    </section>

    <!-- Popular Products -->
    <section class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h2 class="landing-section-title mb-0">Популярни продукти</h2>
        <a href="/catalog.html" class="landing-view-all">Виж всички →</a>
      </div>
      <p class="landing-section-subtitle">Най-търсените продукти от нашите клиенти</p>
      <div id="popularProducts" class="popular-products-grid">
        <!-- Loaded dynamically -->
      </div>
    </section>
  </div>
`;

// ---- Load dynamic content ----
(async () => {
  try {
    const [categories, products] = await Promise.all([
      fetchCategories(),
      fetchProducts()
    ]);

    // Render category tiles
    const tilesContainer = document.querySelector('#categoryTiles');
    if (categories.length > 0) {
      tilesContainer.innerHTML = categories.map(cat => `
        <a href="/catalog.html?category=${cat.id}" class="category-tile">
          <span class="category-tile-icon">${getCategoryIcon(cat.name)}</span>
          <span class="category-tile-name">${cat.name}</span>
        </a>
      `).join('');
    } else {
      tilesContainer.innerHTML = '<p class="text-fb-muted">Няма налични категории</p>';
    }

    // Render popular products (first 4 in-stock products)
    const popularContainer = document.querySelector('#popularProducts');
    const popular = products.filter(p => p.in_stock).slice(0, 4);

    if (popular.length > 0) {
      popularContainer.innerHTML = popular.map(product => {
        const imageHtml = product.image_path
          ? `<img src="${getProductImageUrl(product.image_path)}" class="card-img-top" alt="${product.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'product-img-placeholder\\'>📷</div>';">`
          : `<div class="product-img-placeholder">📷</div>`;

        return `
          <a href="/catalog.html" class="card text-decoration-none">
            ${imageHtml}
            <div class="card-body">
              <h6 class="card-title">${product.name}</h6>
              <span class="product-price">${Number(product.price).toFixed(2)} <span class="product-unit">лв/${product.unit}</span></span>
            </div>
          </a>
        `;
      }).join('');
    } else {
      popularContainer.innerHTML = '<p class="text-fb-muted">Няма налични продукти</p>';
    }
  } catch (error) {
    console.error('Landing load error:', error);
  }
})();
