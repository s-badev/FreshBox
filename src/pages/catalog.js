import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';

// Render navbar (async)
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('catalog');
  setupNavbarHandlers();
})();

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Каталог продукти</h1>
    <div class="alert alert-info">
      <h5>Съдържание на страницата:</h5>
      <ul class="mb-0">
        <li>Списък с налични продукти</li>
        <li>Филтриране по категории</li>
        <li>Добавяне на продукти в кошницата</li>
      </ul>
    </div>
    <div class="row">
      <div class="col-12">
        <p class="text-muted">Продуктите ще бъдат заредени скоро...</p>
      </div>
    </div>
  </div>
`;
