import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { fetchCategories, fetchProducts, getProductImageUrl } from '../services/catalogService.js';

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
  <div class="my-4">
    <h1 class="mb-4">Каталог продукти</h1>

    <!-- Search + Filter row -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <input type="text" id="searchInput" class="form-control"
               placeholder="Търси по име на продукт…">
      </div>
      <div class="col-md-4">
        <select id="categoryFilter" class="form-select">
          <option value="">Всички категории</option>
        </select>
      </div>
    </div>

    <!-- Product grid -->
    <div id="productGrid" class="row g-4">
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Зареждане...</span>
        </div>
        <p class="text-muted mt-2">Зареждане на продукти...</p>
      </div>
    </div>
  </div>

  <!-- Toast container -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="cartToast" class="toast align-items-center text-bg-success border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body" id="cartToastBody">Добавено в кошницата</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  </div>
`;

// ---- Event listeners ----
document.querySelector('#searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderProducts();
});

document.querySelector('#categoryFilter').addEventListener('change', (e) => {
  selectedCategoryId = e.target.value ? Number(e.target.value) : null;
  renderProducts();
});

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
      <div class="col-12 text-center py-5">
        <p class="text-muted fs-5">Няма намерени продукти</p>
      </div>
    `;
    return;
  }

  // Build category lookup
  const catMap = {};
  allCategories.forEach(c => { catMap[c.id] = c.name; });

  // Render cards
  grid.innerHTML = filtered.map(product => {
    const imageHtml = product.image_path
      ? `<img src="${getProductImageUrl(product.image_path)}" class="card-img-top" alt="${product.name}" style="height: 180px; object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'bg-light d-flex align-items-center justify-content-center\\' style=\\'height:180px\\'><span class=\\'text-muted\\'>📷 Няма снимка</span></div>';">`
      : `<div class="bg-light d-flex align-items-center justify-content-center" style="height: 180px;">
           <span class="text-muted">📷 Няма снимка</span>
         </div>`;

    const categoryLabel = catMap[product.category_id] || '';
    const stockBadge = product.in_stock
      ? '<span class="badge bg-success">В наличност</span>'
      : '<span class="badge bg-secondary">Изчерпан</span>';

    return `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          ${imageHtml}
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <small class="text-muted">${categoryLabel}</small>
              ${stockBadge}
            </div>
            <h6 class="card-title mb-1">${product.name}</h6>
            <p class="card-text text-muted small flex-grow-1">${product.description || ''}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="fw-bold text-success fs-5">${Number(product.price).toFixed(2)} лв/${product.unit}</span>
              <button class="btn btn-sm btn-outline-success add-to-cart-btn"
                      data-id="${product.id}" data-name="${product.name}"
                      ${!product.in_stock ? 'disabled' : ''}>
                🛒 Добави
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach add-to-cart handlers
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      showCartToast(name);
    });
  });
}

// ---- Toast helper ----
function showCartToast(productName) {
  const toastBody = document.querySelector('#cartToastBody');
  toastBody.textContent = `✅ „${productName}" е добавено в кошницата`;

  const toastEl = document.querySelector('#cartToast');
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2000 });
  toast.show();
}
