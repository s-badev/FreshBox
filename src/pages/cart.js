import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';

// Render navbar (async)
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('cart');
  setupNavbarHandlers();
})();

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Кошница</h1>
    <div class="alert alert-info">
      <h5>Съдържание на страницата:</h5>
      <ul class="mb-0">
        <li>Избрани продукти в кошницата</li>
        <li>Възможност за промяна на количествата</li>
        <li>Финализиране на поръчката</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-body text-center">
        <p class="text-muted mb-0">Кошницата е празна</p>
      </div>
    </div>
  </div>
`;
