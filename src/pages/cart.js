import '../base.js';
import { renderNavbar, setupNavbarHandlers, updateCartBadge } from '../ui/components/navbar.js';
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
  <div id="toastContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;"></div>
`;

// ---- Render cart ----
function renderCart() {
  const cart = getCart();
  const container = document.querySelector('#cartContent');

  // Empty state
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty text-center">
        <span class="cart-empty-icon">🛒</span>
        <p class="mb-3">Кошницата е празна</p>
        <a href="/catalog.html" class="btn btn-success">Разгледай каталога</a>
      </div>
    `;
    updateCartBadge();
    return;
  }

  const { subtotal, itemsCount } = getTotals();

  container.innerHTML = `
    <div class="cart-layout">
      <!-- Cart items -->
      <div class="cart-items-card">
        ${cart.map(item => {
          const imageHtml = item.image_path
            ? `<img src="${getProductImageUrl(item.image_path)}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.outerHTML='<div class=\\'cart-item-img-placeholder\\'>📦</div>';">`
            : `<div class="cart-item-img-placeholder">📦</div>`;

          return `
            <div class="cart-item" data-id="${item.id}">
              ${imageHtml}
              <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-unit-price">${item.price.toFixed(2)} лв/${item.unit}</p>
              </div>
              <div class="cart-item-qty">
                <div class="cart-qty-stepper">
                  <button type="button" class="qty-dec" data-id="${item.id}" aria-label="Намали">−</button>
                  <input type="number" class="qty-input" data-id="${item.id}" value="${item.qty}" min="1" max="99" aria-label="Количество">
                  <button type="button" class="qty-inc" data-id="${item.id}" aria-label="Увеличи">+</button>
                </div>
              </div>
              <div class="cart-item-total">${(item.price * item.qty).toFixed(2)} лв</div>
              <div class="cart-item-remove">
                <button class="remove-btn" data-id="${item.id}" title="Премахни" aria-label="Премахни">✕</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Summary sidebar -->
      <div class="cart-summary">
        <div class="cart-summary-title">Обобщение</div>
        <div class="cart-summary-row">
          <span>Продукти (${itemsCount})</span>
          <span>${subtotal.toFixed(2)} лв</span>
        </div>
        <div class="cart-summary-row">
          <span>Доставка</span>
          <span class="text-success fw-semibold">Безплатна</span>
        </div>
        <div class="cart-summary-row total">
          <span>Общо</span>
          <span class="cart-summary-amount">${subtotal.toFixed(2)} лв</span>
        </div>
        <button id="checkoutBtn" class="btn btn-success">� Поръчай</button>
        <button id="clearCartBtn" class="btn btn-outline-danger btn-sm">� Изчисти кошницата</button>
      </div>
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

  // Update navbar cart badge after every render
  updateCartBadge();
}

// ---- Toast helper (no bootstrap JS dependency) ----
function showToast(text, isError = false) {
  const container = document.querySelector('#toastContainer');
  const toast = document.createElement('div');
  toast.className = `alert ${isError ? 'alert-danger' : 'alert-success'} shadow-sm mb-2 fade show`;
  toast.setAttribute('role', 'alert');
  toast.textContent = text;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ---- Initial render ----
renderCart();

