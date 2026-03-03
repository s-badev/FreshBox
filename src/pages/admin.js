import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { renderFooter } from '../ui/components/footer.js';
import { getSession } from '../services/authService.js';
import { isAdmin } from '../services/roleService.js';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchProducts, createProduct, updateProduct, deleteProduct,
  uploadProductImage, deleteProductImage, getPublicImageUrl
} from '../services/adminService.js';

// ================================================================
//  STATE
// ================================================================
let categories = [];
let products = [];
let activeTab = 'products';
let productSearch = '';
let productCategoryFilter = null;

// ================================================================
//  INIT
// ================================================================
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('admin');
  setupNavbarHandlers();
  document.querySelector('#footer').innerHTML = renderFooter();

  const appDiv = document.querySelector('#app');

  try {
    const session = await getSession();
    if (!session) { window.location.href = '/login.html'; return; }

    const admin = await isAdmin();
    if (!admin) {
      appDiv.innerHTML = `
        <div class="orders-empty">
          <p class="fs-5 mb-3">Нямаш достъп до тази страница.</p>
          <a href="/index.html" class="btn btn-success">Начало</a>
        </div>`;
      return;
    }

    // Admin is authenticated – render shell then load data
    renderShell(appDiv);
    await loadAll();
  } catch (err) {
    console.error('Admin init error:', err);
    appDiv.innerHTML = `<div class="alert alert-danger">Грешка: ${err.message}</div>`;
  }
})();

// ================================================================
//  SHELL
// ================================================================
function renderShell(root) {
  root.innerHTML = `
    <div class="admin-header">
      <h2>Админ панел</h2>
    </div>

    <!-- Tabs -->
    <ul class="admin-tabs" id="adminTabs">
      <li><button class="admin-tab active" data-tab="products">Продукти</button></li>
      <li><button class="admin-tab" data-tab="categories">Категории</button></li>
    </ul>

    <!-- Tab content -->
    <div id="tabContent"></div>

    <!-- Generic dialog backdrop -->
    <div class="admin-dialog-backdrop" id="dialogBackdrop" hidden>
      <div class="admin-dialog" id="dialogBox"></div>
    </div>

    <!-- Toast container -->
    <div id="toastContainer" class="fb-toast-container"></div>
  `;

  // Tab switching
  root.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      root.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b === btn));
      renderActiveTab();
    });
  });
}

async function loadAll() {
  try {
    [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
  } catch (err) {
    console.error('Load error:', err);
    showToast('Грешка при зареждане: ' + err.message, true);
  }
  renderActiveTab();
}

function renderActiveTab() {
  const box = document.querySelector('#tabContent');
  if (!box) return;
  if (activeTab === 'categories') renderCategoriesTab(box);
  else renderProductsTab(box);
}

// ================================================================
//  CATEGORIES TAB
// ================================================================
function renderCategoriesTab(box) {
  box.innerHTML = `
    <div class="admin-card mt-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0 fw-semibold">Категории</h5>
        <button class="btn btn-success btn-sm" id="addCatBtn">+ Добави</button>
      </div>
      ${categories.length === 0
        ? '<p class="text-fb-muted text-center py-4">Няма категории</p>'
        : `<table class="table admin-table">
            <thead><tr><th>Име</th><th style="width:140px">Действия</th></tr></thead>
            <tbody>
              ${categories.map(c => `
                <tr>
                  <td>${esc(c.name)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-success cat-edit" data-id="${c.id}">Редактирай</button>
                    <button class="btn btn-sm btn-outline-danger cat-del" data-id="${c.id}">Изтрий</button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>`
      }
    </div>`;

  box.querySelector('#addCatBtn').addEventListener('click', () => openCategoryDialog());
  box.querySelectorAll('.cat-edit').forEach(b =>
    b.addEventListener('click', () => {
      const cat = categories.find(c => c.id === Number(b.dataset.id));
      if (cat) openCategoryDialog(cat);
    })
  );
  box.querySelectorAll('.cat-del').forEach(b =>
    b.addEventListener('click', () => confirmDeleteCategory(Number(b.dataset.id)))
  );
}

function openCategoryDialog(cat = null) {
  const isEdit = !!cat;
  showDialog(`
    <h5 class="mb-3">${isEdit ? 'Редактирай категория' : 'Нова категория'}</h5>
    <div class="mb-3">
      <label class="form-label">Име</label>
      <input type="text" class="form-control" id="dlgCatName" value="${isEdit ? esc(cat.name) : ''}" required>
    </div>
    <div class="d-flex gap-2 justify-content-end">
      <button class="btn btn-outline-success btn-sm" id="dlgCancel">Отказ</button>
      <button class="btn btn-success btn-sm" id="dlgSave">Запази</button>
    </div>
  `);

  document.querySelector('#dlgCancel').addEventListener('click', closeDialog);
  document.querySelector('#dlgSave').addEventListener('click', async () => {
    const name = document.querySelector('#dlgCatName').value.trim();
    if (!name) { showToast('Моля, въведи име.', true); return; }
    try {
      if (isEdit) await updateCategory(cat.id, { name });
      else await createCategory({ name });
      closeDialog();
      await reloadCategories();
      showToast(isEdit ? 'Категорията е обновена.' : 'Категорията е създадена.');
    } catch (err) {
      showToast('Грешка: ' + err.message, true);
    }
  });
}

async function confirmDeleteCategory(id) {
  // Check if any products use this category
  const used = products.filter(p => p.category_id === id);
  if (used.length > 0) {
    showToast(`Не може да изтриеш – ${used.length} продукт(а) са в тази категория.`, true);
    return;
  }
  if (!confirm('Сигурен ли си, че искаш да изтриеш тази категория?')) return;
  try {
    await deleteCategory(id);
    await reloadCategories();
    showToast('Категорията е изтрита.');
  } catch (err) {
    showToast('Грешка: ' + err.message, true);
  }
}

async function reloadCategories() {
  categories = await fetchCategories();
  renderActiveTab();
}

// ================================================================
//  PRODUCTS TAB
// ================================================================
function renderProductsTab(box) {
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });

  // Apply local filters
  let list = products;
  if (productSearch) list = list.filter(p => p.name.toLowerCase().includes(productSearch));
  if (productCategoryFilter) list = list.filter(p => p.category_id === productCategoryFilter);

  box.innerHTML = `
    <div class="admin-card mt-3">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 class="mb-0 fw-semibold">Продукти <small class="text-fb-muted">(${list.length})</small></h5>
        <button class="btn btn-success btn-sm" id="addProdBtn">+ Добави продукт</button>
      </div>

      <!-- Filters -->
      <div class="d-flex gap-2 mb-3 flex-wrap">
        <input type="text" class="form-control form-control-sm" id="prodSearch"
               placeholder="Търси по име…" value="${esc(productSearch)}" style="max-width:220px;">
        <select class="form-select form-select-sm" id="prodCatFilter" style="max-width:200px;">
          <option value="">Всички категории</option>
          ${categories.map(c => `<option value="${c.id}" ${productCategoryFilter === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
        </select>
      </div>

      ${list.length === 0
        ? '<p class="text-fb-muted text-center py-4">Няма продукти</p>'
        : `<div class="table-responsive">
            <table class="table admin-table align-middle">
              <thead>
                <tr>
                  <th>Снимка</th>
                  <th>Име</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Единица</th>
                  <th>Наличен</th>
                  <th style="width:160px">Действия</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(p => {
                  const thumb = p.image_path
                    ? `<img src="${getPublicImageUrl(p.image_path)}" class="admin-product-thumb" alt="" onerror="this.style.display='none'">`
                    : '<span class="text-fb-muted">—</span>';
                  return `
                    <tr>
                      <td>${thumb}</td>
                      <td class="fw-semibold">${esc(p.name)}</td>
                      <td>${catMap[p.category_id] || '—'}</td>
                      <td>${Number(p.price).toFixed(2)} лв</td>
                      <td>${esc(p.unit)}</td>
                      <td>${p.in_stock ? '<span class="badge bg-success">Да</span>' : '<span class="badge bg-secondary">Не</span>'}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-success prod-edit" data-id="${p.id}">Редактирай</button>
                        <button class="btn btn-sm btn-outline-danger prod-del" data-id="${p.id}">Изтрий</button>
                      </td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>`
      }
    </div>`;

  // Filter handlers
  box.querySelector('#prodSearch').addEventListener('input', e => {
    productSearch = e.target.value.trim().toLowerCase();
    renderProductsTab(box);
  });
  box.querySelector('#prodCatFilter').addEventListener('change', e => {
    productCategoryFilter = e.target.value ? Number(e.target.value) : null;
    renderProductsTab(box);
  });

  // CRUD buttons
  box.querySelector('#addProdBtn').addEventListener('click', () => openProductDialog());
  box.querySelectorAll('.prod-edit').forEach(b =>
    b.addEventListener('click', () => {
      const p = products.find(x => x.id === Number(b.dataset.id));
      if (p) openProductDialog(p);
    })
  );
  box.querySelectorAll('.prod-del').forEach(b =>
    b.addEventListener('click', () => confirmDeleteProduct(Number(b.dataset.id)))
  );
}

// ================================================================
//  PRODUCT DIALOG (create / edit)
// ================================================================
function openProductDialog(prod = null) {
  const isEdit = !!prod;
  const previewSrc = (isEdit && prod.image_path) ? getPublicImageUrl(prod.image_path) : '';

  showDialog(`
    <h5 class="mb-3">${isEdit ? 'Редактирай продукт' : 'Нов продукт'}</h5>
    <div class="mb-2">
      <label class="form-label">Име *</label>
      <input type="text" class="form-control form-control-sm" id="dlgProdName"
             value="${isEdit ? esc(prod.name) : ''}">
    </div>
    <div class="mb-2">
      <label class="form-label">Описание</label>
      <textarea class="form-control form-control-sm" id="dlgProdDesc" rows="2">${isEdit ? esc(prod.description || '') : ''}</textarea>
    </div>
    <div class="row g-2 mb-2">
      <div class="col-6">
        <label class="form-label">Цена (лв) *</label>
        <input type="number" step="0.01" min="0" class="form-control form-control-sm" id="dlgProdPrice"
               value="${isEdit ? prod.price : ''}">
      </div>
      <div class="col-6">
        <label class="form-label">Единица *</label>
        <input type="text" class="form-control form-control-sm" id="dlgProdUnit"
               value="${isEdit ? esc(prod.unit) : 'кг'}" placeholder="кг, бр, л…">
      </div>
    </div>
    <div class="mb-2">
      <label class="form-label">Категория</label>
      <select class="form-select form-select-sm" id="dlgProdCat">
        <option value="">— без категория —</option>
        ${categories.map(c => `<option value="${c.id}" ${isEdit && prod.category_id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
      </select>
    </div>
    ${isEdit ? `
    <div class="mb-2">
      <label class="form-label">Наличен</label>
      <select class="form-select form-select-sm" id="dlgProdStock">
        <option value="true" ${prod.in_stock ? 'selected' : ''}>Да</option>
        <option value="false" ${!prod.in_stock ? 'selected' : ''}>Не</option>
      </select>
    </div>` : ''}
    <div class="mb-3">
      <label class="form-label">Снимка</label>
      <input type="file" accept="image/*" class="form-control form-control-sm" id="dlgProdFile">
      <div id="dlgProdPreview" class="mt-2">
        ${previewSrc ? `<img src="${previewSrc}" class="admin-product-thumb" style="width:80px;height:80px;" alt="preview">` : ''}
      </div>
    </div>
    <div id="dlgProdStatus" class="mb-2"></div>
    <div class="d-flex gap-2 justify-content-end">
      <button class="btn btn-outline-success btn-sm" id="dlgCancel">Отказ</button>
      <button class="btn btn-success btn-sm" id="dlgSave">Запази</button>
    </div>
  `);

  // File preview
  document.querySelector('#dlgProdFile').addEventListener('change', e => {
    const file = e.target.files[0];
    const preview = document.querySelector('#dlgProdPreview');
    if (file) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${url}" class="admin-product-thumb" style="width:80px;height:80px;" alt="preview">`;
    } else {
      preview.innerHTML = previewSrc ? `<img src="${previewSrc}" class="admin-product-thumb" style="width:80px;height:80px;" alt="">` : '';
    }
  });

  document.querySelector('#dlgCancel').addEventListener('click', closeDialog);
  document.querySelector('#dlgSave').addEventListener('click', async () => {
    const name = document.querySelector('#dlgProdName').value.trim();
    const description = document.querySelector('#dlgProdDesc').value.trim();
    const price = parseFloat(document.querySelector('#dlgProdPrice').value);
    const unit = document.querySelector('#dlgProdUnit').value.trim();
    const catVal = document.querySelector('#dlgProdCat').value;
    const category_id = catVal ? Number(catVal) : null;
    const file = document.querySelector('#dlgProdFile').files[0] || null;
    const stockEl = document.querySelector('#dlgProdStock');
    const in_stock = stockEl ? stockEl.value === 'true' : true;

    if (!name || isNaN(price) || price < 0 || !unit) {
      showToast('Моля, попълни задължителните полета (име, цена, единица).', true);
      return;
    }

    const statusDiv = document.querySelector('#dlgProdStatus');
    const saveBtn = document.querySelector('#dlgSave');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Запазване…';

    try {
      if (isEdit) {
        // ---- EDIT FLOW ----
        const fields = { name, description, price, unit, category_id, in_stock };

        if (file) {
          statusDiv.innerHTML = '<small class="text-fb-muted">Качване на снимка…</small>';
          const newPath = await uploadProductImage(file, prod.id);
          fields.image_path = newPath;
          // best-effort delete old image
          if (prod.image_path) deleteProductImage(prod.image_path);
        }

        statusDiv.innerHTML = '<small class="text-fb-muted">Записване…</small>';
        await updateProduct(prod.id, fields);
      } else {
        // ---- CREATE FLOW ----
        statusDiv.innerHTML = '<small class="text-fb-muted">Създаване…</small>';
        const created = await createProduct({ name, description, price, unit, category_id, image_path: null });

        if (file) {
          statusDiv.innerHTML = '<small class="text-fb-muted">Качване на снимка…</small>';
          const imgPath = await uploadProductImage(file, created.id);
          await updateProduct(created.id, { image_path: imgPath });
        }
      }

      closeDialog();
      await reloadProducts();
      showToast(isEdit ? 'Продуктът е обновен.' : 'Продуктът е създаден.');
    } catch (err) {
      console.error('Product save error:', err);
      showToast('Грешка: ' + err.message, true);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Запази';
    }
  });
}

async function confirmDeleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Изтрий „${p.name}"?`)) return;
  try {
    await deleteProduct(id);
    if (p.image_path) deleteProductImage(p.image_path);
    await reloadProducts();
    showToast('Продуктът е изтрит.');
  } catch (err) {
    showToast('Грешка: ' + err.message, true);
  }
}

async function reloadProducts() {
  products = await fetchProducts();
  renderActiveTab();
}

// ================================================================
//  DIALOG HELPERS (custom, no bootstrap Modal JS)
// ================================================================
function showDialog(html) {
  const backdrop = document.querySelector('#dialogBackdrop');
  const box = document.querySelector('#dialogBox');
  box.innerHTML = html;
  backdrop.hidden = false;
  // Close on backdrop click
  backdrop.onclick = (e) => { if (e.target === backdrop) closeDialog(); };
  // Close on Escape
  document.addEventListener('keydown', dialogEscHandler);
}

function closeDialog() {
  const backdrop = document.querySelector('#dialogBackdrop');
  if (backdrop) backdrop.hidden = true;
  document.removeEventListener('keydown', dialogEscHandler);
}

function dialogEscHandler(e) {
  if (e.key === 'Escape') closeDialog();
}

// ================================================================
//  TOAST (reuse existing fb-toast system)
// ================================================================
function showToast(text, isError = false) {
  const container = document.querySelector('#toastContainer');
  if (!container) { alert(text); return; }
  const toast = document.createElement('div');
  toast.className = `fb-toast ${isError ? 'error' : 'success'}`;
  toast.textContent = text;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

// ================================================================
//  UTILITY
// ================================================================
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
