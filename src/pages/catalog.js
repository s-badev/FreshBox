import '../base.js';
import { renderNavbar, setupNavbarHandlers, updateCartBadge } from '../ui/components/navbar.js';
import { fetchCategories, fetchProducts, getProductImageUrl } from '../services/catalogService.js';
import { addToCart, getTotals } from '../services/cartService.js';

// ---- State ----
let allProducts = [];
let allCategories = [];
let selectedCategoryId = null;
let searchQuery = '';

// ---- Init ----
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('catalog');
  setupNavbarHandlers();
  await loadCatalog();
})();

// ---- Render shell (loading state) ----
document.querySelector('#app').innerHTML = `
  <h1 class="page-heading">Каталог продукти</h1>

  <!-- Mobile sidebar toggle -->
  <button class="btn btn-outline-success catalog-sidebar-toggle" id="sidebarToggle">
    ☰ Категории
  </button>

  <div class="catalog-wrapper">
    <!-- Sidebar -->
    <aside class="catalog-sidebar" id="catalogSidebar">
      <div class="catalog-sidebar-title">Категории</div>
      <div id="sidebarCategories">
        <button class="cat-item active" data-cat="">Всички</button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="catalog-main">
      <!-- Filter bar -->
      <div class="catalog-filter-bar">
        <input type="text" id="searchInput" class="form-control"
               placeholder="Търси по име на продукт…">
        <select id="categoryFilter" class="form-select" style="max-width:220px;">
          <option value="">Всички категории</option>
        </select>
      </div>

      <div id="resultsCount" class="catalog-results-count"></div>

      <!-- Product grid -->
      <div id="productGrid" class="product-grid">
        <div class="fb-loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Зареждане...</span>
          </div>
          <span>Зареждане на продукти...</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast container -->
  <div id="toastContainer" class="fb-toast-container"></div>
`;

// ---- Mobile sidebar toggle ----
document.querySelector('#sidebarToggle').addEventListener('click', () => {
  document.querySelector('#catalogSidebar').classList.toggle('show');
});

// ---- Event listeners ----
document.querySelector('#searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderProducts();
});

document.querySelector('#categoryFilter').addEventListener('change', (e) => {
  selectedCategoryId = e.target.value ? Number(e.target.value) : null;
  syncSidebarActive();
  renderProducts();
});

// Sync sidebar active state with dropdown
function syncSidebarActive() {
  document.querySelectorAll('#sidebarCategories .cat-item').forEach(btn => {
    const val = btn.dataset.cat;
    const isActive = (val === '' && !selectedCategoryId) || (val && Number(val) === selectedCategoryId);
    btn.classList.toggle('active', isActive);
  });
}

// ---- Load data ----
async function loadCatalog() {
  try {
    [allCategories, allProducts] = await Promise.all([
      fetchCategories(),
      fetchProducts()
    ]);

    // Populate category dropdown
    const select = document.querySelector('#categoryFilter');
    allCategories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });

    // Populate sidebar categories
    const sidebar = document.querySelector('#sidebarCategories');
    allCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-item';
      btn.dataset.cat = cat.id;
      btn.textContent = cat.name;
      btn.addEventListener('click', () => {
        selectedCategoryId = Number(cat.id);
        select.value = cat.id;
        syncSidebarActive();
        renderProducts();
      });
      sidebar.appendChild(btn);
    });

    // "All" button handler
    sidebar.querySelector('[data-cat=""]').addEventListener('click', () => {
      selectedCategoryId = null;
      select.value = '';
      syncSidebarActive();
      renderProducts();
    });

    renderProducts();
  } catch (error) {
    console.error('Catalog load error:', error);
    document.querySelector('#productGrid').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          Грешка при зареждане на каталога: ${error.message}
        </div>
      </div>
    `;
  }
}

// ---- Render filtered products ----
function renderProducts() {
  const grid = document.querySelector('#productGrid');

  // Apply filters
  let filtered = allProducts;

  if (selectedCategoryId) {
    filtered = filtered.filter(p => p.category_id === selectedCategoryId);
  }

  if (searchQuery) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery));
  }

  // Empty state
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="text-center py-5" style="grid-column: 1/-1;">
        <p class="text-fb-muted fs-5">Няма намерени продукти</p>
      </div>
    `;
    document.querySelector('#resultsCount').textContent = '';
    return;
  }

  // Results count
  document.querySelector('#resultsCount').textContent = `${filtered.length} продукт${filtered.length === 1 ? '' : 'а'}`;

  // Build category lookup
  const catMap = {};
  allCategories.forEach(c => { catMap[c.id] = c.name; });

  // Render cards
  grid.innerHTML = filtered.map(product => {
    const imageHtml = product.image_path
      ? `<img src="${getProductImageUrl(product.image_path)}" class="card-img-top" alt="${product.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'product-img-placeholder\\'>📷</div>';">`
      : `<div class="product-img-placeholder">📷</div>`;

    const categoryLabel = catMap[product.category_id] || '';
    const stockBadge = product.in_stock
      ? '<span class="badge bg-success">В наличност</span>'
      : '<span class="badge bg-secondary">Изчерпан</span>';

    return `
      <div class="card">
        ${imageHtml}
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <small class="text-fb-muted">${categoryLabel}</small>
            ${stockBadge}
          </div>
          <h6 class="card-title">${product.name}</h6>
          <p class="card-text text-fb-muted small flex-grow-1">${product.description || ''}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="product-price">${Number(product.price).toFixed(2)} <span class="product-unit">лв/${product.unit}</span></span>
          </div>
          <div class="product-action-row">
            <div class="product-qty-stepper" data-id="${product.id}">
              <button type="button" class="qty-step-btn qty-step-dec" aria-label="Намали">−</button>
              <input type="number" class="qty-step-input" value="1" min="1" max="99" aria-label="Количество">
              <button type="button" class="qty-step-btn qty-step-inc" aria-label="Увеличи">+</button>
            </div>
            <button class="btn btn-success add-to-cart-btn"
                    data-product='${JSON.stringify({ id: product.id, name: product.name, price: product.price, unit: product.unit, image_path: product.image_path })}'
                    ${!product.in_stock ? 'disabled' : ''}>
              🛒 Добави
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach add-to-cart handlers
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = JSON.parse(btn.dataset.product);
      const stepper = btn.closest('.product-action-row').querySelector('.qty-step-input');
      const qty = Math.max(1, parseInt(stepper.value) || 1);
      addToCart(product, qty);
      stepper.value = 1; // Reset stepper
      const { itemsCount } = getTotals();
      showCartToast(product.name, itemsCount);
      updateCartBadge();
    });
  });

  // Attach qty stepper handlers
  grid.querySelectorAll('.product-qty-stepper').forEach(stepper => {
    const input = stepper.querySelector('.qty-step-input');
    stepper.querySelector('.qty-step-dec').addEventListener('click', () => {
      input.value = Math.max(1, (parseInt(input.value) || 1) - 1);
    });
    stepper.querySelector('.qty-step-inc').addEventListener('click', () => {
      input.value = Math.min(99, (parseInt(input.value) || 1) + 1);
    });
    input.addEventListener('change', () => {
      let v = parseInt(input.value) || 1;
      input.value = Math.max(1, Math.min(99, v));
    });
  });
}

// ---- Toast helper (no bootstrap JS dependency) ----
function showCartToast(productName, itemsCount) {
  const container = document.querySelector('#toastContainer');
  const toast = document.createElement('div');
  toast.className = 'fb-toast success';
  toast.innerHTML = `✅ „${productName}" е добавено <a href="/cart.html" class="fw-semibold">(${itemsCount} арт.)</a>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
    setTimeout(() => toast.remove(), 500);
  }, 1800);
}
