import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { getSession } from '../services/authService.js';
import { isAdmin } from '../services/roleService.js';

// Initialize page
(async () => {
  // Render navbar
  document.querySelector('#nav').innerHTML = await renderNavbar('admin');
  setupNavbarHandlers();
  
  // Check authentication and authorization
  const appDiv = document.querySelector('#app');
  
  try {
    const session = await getSession();
    
    // Guard 1: No session - require login
    if (!session) {
      appDiv.innerHTML = `
        <div class="my-5 text-center">
          <div class="alert alert-warning d-inline-block">
            <h4 class="alert-heading">Моля, влез.</h4>
            <p class="mb-3">Трябва да влезеш в профила си, за да достъпиш админ панела.</p>
            <a href="/login.html" class="btn btn-success">Вход</a>
          </div>
        </div>
      `;
      return;
    }
    
    // Guard 2: Has session but not admin - deny access
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      appDiv.innerHTML = `
        <div class="my-5 text-center">
          <div class="alert alert-danger d-inline-block">
            <h4 class="alert-heading">Нямаш достъп.</h4>
            <p class="mb-3">Тази страница е достъпна само за администратори.</p>
            <a href="/catalog.html" class="btn btn-primary">Към каталога</a>
          </div>
        </div>
      `;
      return;
    }
    
    // Guard 3: User is admin - show admin panel
    appDiv.innerHTML = `
      <div class="my-4">
        <h1 class="mb-4">Админ панел</h1>
        <div class="alert alert-success">
          <strong>Добре дошъл, администратор!</strong>
        </div>
        <div class="alert alert-info">
          <h5>Функционалности (очаквани):</h5>
          <ul class="mb-0">
            <li>Управление на продукти (добавяне, редактиране, изтриване)</li>
            <li>Преглед на всички поръчки</li>
            <li>Управление на потребители</li>
          </ul>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Admin page error:', error);
    appDiv.innerHTML = `
      <div class="my-5 text-center">
        <div class="alert alert-danger d-inline-block">
          <h4 class="alert-heading">Грешка</h4>
          <p class="mb-0">Възникна проблем при проверка на достъпа: ${error.message}</p>
        </div>
      </div>
    `;
  }
})();
