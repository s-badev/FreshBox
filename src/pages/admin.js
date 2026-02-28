import '../base.js';
import { renderNavbar } from '../ui/components/navbar.js';

// Render navbar
document.querySelector('#nav').innerHTML = renderNavbar('admin');

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="my-4">
    <h1 class="mb-4">Админ панел</h1>
    <div class="alert alert-warning">
      <strong>Забележка:</strong> Тази страница ще бъде видима само за администратори след имплементация на автентикация.
    </div>
    <div class="alert alert-info">
      <h5>Съдържание на страницата:</h5>
      <ul class="mb-0">
        <li>Управление на продукти (добавяне, редактиране, изтриване)</li>
        <li>Преглед на всички поръчки</li>
        <li>Управление на потребители</li>
      </ul>
    </div>
  </div>
`;
