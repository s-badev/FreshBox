import '../base.js';
import { renderNavbar, setupNavbarHandlers } from '../ui/components/navbar.js';
import { signUp, signIn } from '../services/authService.js';

// Render navbar (async)
(async () => {
  document.querySelector('#nav').innerHTML = await renderNavbar('login');
  setupNavbarHandlers();
})();

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-card-title">Вход / Регистрация</h2>
      <p class="auth-card-subtitle">Влез в профила си или създай нов акаунт</p>
      <form id="authForm">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" placeholder="example@mail.com" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Парола</label>
          <input type="password" class="form-control" id="password" placeholder="••••••••" required>
        </div>
        <div class="d-grid gap-2">
          <button type="button" id="loginBtn" class="btn btn-success">Вход</button>
          <button type="button" id="registerBtn" class="btn btn-outline-success">Регистрация</button>
        </div>
      </form>
      <div id="message" class="auth-message"></div>
    </div>
  </div>
`;

// Get form elements
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');
const registerBtn = document.querySelector('#registerBtn');
const messageDiv = document.querySelector('#message');

// Helper to show message
function showMessage(text, isError = false) {
  messageDiv.innerHTML = `
    <div class="alert alert-${isError ? 'danger' : 'success'} alert-dismissible fade show" role="alert">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

// Handle Login
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage('Моля, попълни email и парола.', true);
    return;
  }

  try {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Зареждане...';
    
    await signIn(email, password);
    showMessage('Успешен вход!');
    
    setTimeout(() => {
      window.location.href = '/catalog.html';
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Грешка при вход: ' + (error.message || 'Невалиден email или парола'), true);
    loginBtn.disabled = false;
    loginBtn.textContent = 'Вход';
  }
});

// Handle Register
registerBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage('Моля, попълни email и парола.', true);
    return;
  }

  if (password.length < 6) {
    showMessage('Паролата трябва да е поне 6 символа', true);
    return;
  }

  try {
    registerBtn.disabled = true;
    registerBtn.textContent = 'Зареждане...';
    
    await signUp(email, password);
    showMessage('Успешна регистрация! Моля, влез с данните си.');
    
    // Reset button state and clear password field for login
    registerBtn.disabled = false;
    registerBtn.textContent = 'Регистрация';
    passwordInput.value = '';
    passwordInput.focus();
  } catch (error) {
    console.error('Register error:', error);
    showMessage('Грешка при регистрация: ' + (error.message || 'Опитайте отново'), true);
    registerBtn.disabled = false;
    registerBtn.textContent = 'Регистрация';
  }
});
