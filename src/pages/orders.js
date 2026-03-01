import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { getSession } from '../services/authService.js';
import { fetchMyOrders } from '../services/orderService.js';

// ---- Navbar ----
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('orders');
  setupNavbarHandlers();
})();

// ---- Shell ----
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Моите поръчки</h1>
    <div id="ordersContent">
      <div class="text-center py-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Зареждане...</span>
        </div>
        <p class="text-muted mt-2">Зареждане на поръчки...</p>
      </div>
    </div>
  </div>
`;

// ---- Status badges ----
const STATUS_MAP = {
  new:        { label: 'Нова',       bg: 'primary'   },
  processing: { label: 'Обработва се', bg: 'warning'  },
  done:       { label: 'Изпълнена',  bg: 'success'   },
  cancelled:  { label: 'Отказана',   bg: 'danger'    }
};

// ---- Load orders ----
(async () => {
  const container = document.querySelector('#ordersContent');

  try {
    const session = await getSession();
    if (!session) {
      container.innerHTML = `
        <div class="text-center py-5">
          <p class="fs-5 text-muted mb-3">Моля, влез в профила си, за да видиш поръчките.</p>
          <a href="/login.html" class="btn btn-success">Вход</a>
        </div>
      `;
      return;
    }

    const orders = await fetchMyOrders();

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <p class="fs-5 text-muted mb-3">📦 Нямаш поръчки</p>
          <a href="/catalog.html" class="btn btn-success">Разгледай каталога</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="accordion" id="ordersAccordion">
        ${orders.map((order, idx) => {
          const status = STATUS_MAP[order.status] || { label: order.status, bg: 'secondary' };
          const date = new Date(order.created_at).toLocaleString('bg-BG', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });

          const items = order.order_items || [];
          const itemsTotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

          return `
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button ${idx > 0 ? 'collapsed' : ''}" type="button"
                        data-bs-toggle="collapse" data-bs-target="#order-${order.id}">
                  <div class="d-flex w-100 justify-content-between align-items-center me-3">
                    <span>
                      <strong>Поръчка #${order.id}</strong>
                      <small class="text-muted ms-2">${date}</small>
                    </span>
                    <span>
                      <span class="badge bg-${status.bg} me-2">${status.label}</span>
                      <span class="fw-bold text-success">${Number(order.total_amount).toFixed(2)} лв</span>
                    </span>
                  </div>
                </button>
              </h2>
              <div id="order-${order.id}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}"
                   data-bs-parent="#ordersAccordion">
                <div class="accordion-body p-0">
                  <table class="table table-sm mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Продукт</th>
                        <th class="text-center">Кол.</th>
                        <th class="text-end">Ед. цена</th>
                        <th class="text-end">Сума</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${items.map(item => {
                        const productName = item.products?.name || '(изтрит продукт)';
                        return `
                          <tr>
                            <td>${productName}</td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-end">${Number(item.unit_price).toFixed(2)} лв</td>
                            <td class="text-end fw-semibold">${(item.unit_price * item.quantity).toFixed(2)} лв</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                    <tfoot class="table-light">
                      <tr>
                        <td colspan="3" class="text-end fw-bold">Общо:</td>
                        <td class="text-end fw-bold">${itemsTotal.toFixed(2)} лв</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Orders load error:', error);
    container.innerHTML = `
      <div class="alert alert-danger">
        Грешка при зареждане на поръчките: ${error.message}
      </div>
    `;
  }
})();
