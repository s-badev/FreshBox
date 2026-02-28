import '../base.js';
import { renderNavbar } from '../ui/components/navbar.js';

// Render navbar
document.querySelector('#nav').innerHTML = renderNavbar('login');

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="row justify-content-center mt-5">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">Вход</h2>
          <form id="loginForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Парола</label>
              <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-success w-100">Вход</button>
          </form>
          <div class="text-center mt-3">
            <small class="text-muted">Функционалността ще бъде имплементирана скоро</small>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
