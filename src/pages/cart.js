import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { getCart, updateQty, removeItem, clearCart, getTotals } from '../services/cartService.js';
import { getProductImageUrl } from '../services/catalogService.js';
import { getSession } from '../services/authService.js';
import { createOrderFromCart } from '../services/orderService.js';

// ---- Navbar ----
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('cart');
  setupNavbarHandlers();
})();

// ---- Render shell ----
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Кошница</h1>
    <div id="cartContent"></div>
  </div>

  <!-- Toast container -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="cartToast" class="toast align-items-center border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body" id="cartToastBody"></div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  </div>
`;

// ---- Render cart ----
function renderCart() {
  const cart = getCart();
  const container = document.querySelector('#cartContent');

  // Empty state
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <p class="fs-5 text-muted mb-3">🛒 Кошницата е празна</p>
        <a href="/catalog.html" class="btn btn-success">Разгледай каталога</a>
      </div>
    `;
    return;
  }

  const { subtotal, itemsCount } = getTotals();

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead class="table-light">
          <tr>
            <th>Продукт</th>
            <th class="text-center">Единична цена</th>
            <th class="text-center" style="width: 160px;">Количество</th>
            <th class="text-end">Сума</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="cartRows">
          ${cart.map(item => {
            const imageHtml = item.image_path
              ? `<img src="${getProductImageUrl(item.image_path)}" alt="${item.name}" width="48" height="48" class="rounded object-fit-cover me-2" style="object-fit:cover;">`
              : `<span class="me-2" style="font-size:2rem;">📦</span>`;

            return `
              <tr data-id="${item.id}">
                <td>
                  <div class="d-flex align-items-center">
                    ${imageHtml}
                    <span class="fw-semibold">${item.name}</span>
                  </div>
                </td>
                <td class="text-center">${item.price.toFixed(2)} лв/${item.unit}</td>
                <td class="text-center">
                  <div class="input-group input-group-sm justify-content-center" style="width:130px; margin: 0 auto;">
                    <button class="btn btn-outline-secondary qty-dec" data-id="${item.id}" type="button">−</button>
                    <input type="number" class="form-control text-center qty-input" data-id="${item.id}"
                           value="${item.qty}" min="1" max="99" style="max-width:50px;">
                    <button class="btn btn-outline-secondary qty-inc" data-id="${item.id}" type="button">+</button>
                  </div>
                </td>
                <td class="text-end fw-semibold">${(item.price * item.qty).toFixed(2)} лв</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}" title="Премахни">✕</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot class="table-light">
          <tr>
            <td colspan="3" class="text-end fw-bold">Общо (${itemsCount} арт.):</td>
            <td class="text-end fw-bold fs-5 text-success">${subtotal.toFixed(2)} лв</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <button id="clearCartBtn" class="btn btn-outline-danger btn-sm">🗑 Изчисти кошницата</button>
      <button id="checkoutBtn" class="btn btn-success px-4">📦 Поръчай</button>
    </div>
  `;

  // ---- Event delegation for qty and remove ----
  container.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = getCart().find(i => i.id === id);
      if (item) updateQty(id, item.qty - 1);
      renderCart();
    });
  });

  container.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = getCart().find(i => i.id === id);
      if (item) updateQty(id, item.qty + 1);
      renderCart();
    });
  });

  container.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = Number(input.dataset.id);
      const qty = parseInt(input.value, 10);
      updateQty(id, isNaN(qty) || qty < 1 ? 1 : qty);
      renderCart();
    });
  });

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeItem(Number(btn.dataset.id));
      renderCart();
    });
  });

  document.querySelector('#clearCartBtn').addEventListener('click', () => {
    if (confirm('Сигурен ли си, че искаш да изчистиш кошницата?')) {
      clearCart();
      renderCart();
    }
  });

  // ---- Checkout handler ----
  document.querySelector('#checkoutBtn').addEventListener('click', async () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Кошницата е празна', true);
      return;
    }

    // Auth check
    const session = await getSession();
    if (!session) {
      showToast('Моля, влез в профила си, за да поръчаш', true);
      setTimeout(() => { window.location.href = '/login.html'; }, 1500);
      return;
    }

    const btn = document.querySelector('#checkoutBtn');
    try {
      btn.disabled = true;
      btn.textContent = 'Изпращане...';

      const orderId = await createOrderFromCart(cart);
      clearCart();
      showToast(`✅ Поръчка #${orderId} е създадена!`, false);

      setTimeout(() => { window.location.href = '/orders.html'; }, 1500);
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Грешка при поръчка: ' + (error.message || 'Опитай отново'), true);
      btn.disabled = false;
      btn.textContent = '📦 Поръчай';
    }
  });
}

// ---- Toast helper ----
function showToast(text, isError = false) {
  const toastEl = document.querySelector('#cartToast');
  const toastBody = document.querySelector('#cartToastBody');
  
  toastEl.classList.remove('text-bg-success', 'text-bg-danger');
  toastEl.classList.add(isError ? 'text-bg-danger' : 'text-bg-success');
  toastBody.textContent = text;

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  toast.show();
}

// ---- Initial render ----
renderCart();

