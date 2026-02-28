import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';

// Render navbar (async)
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('orders');
  setupNavbarHandlers();
})();

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Моите поръчки</h1>
    <div class="alert alert-info">
      <h5>Съдържание на страницата:</h5>
      <ul class="mb-0">
        <li>История на поръчките</li>
        <li>Статус на текущите доставки</li>
        <li>Детайли за всяка поръчка</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-body text-center">
        <p class="text-muted mb-0">Все още нямате направени поръчки</p>
      </div>
    </div>
  </div>
`;
