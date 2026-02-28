import '../base.js';
import { renderNavbar } from '../ui/components/navbar.js';

// Render navbar
document.querySelector('#nav').innerHTML = renderNavbar('landing');

// Render page content
document.querySelector('#app').innerHTML = `
  <div class="text-center my-5">
    <h1 class="display-4 mb-4">🥬 Добре дошли във FreshBox</h1>
    <p class="lead">Пресни продукти доставени до вашата врата</p>
    <div class="mt-4">
      <ul class="list-unstyled text-start mx-auto" style="max-width: 500px;">
        <li class="mb-2">✅ Пресни зеленчуци и плодове всеки ден</li>
        <li class="mb-2">✅ Бърза доставка до вашия адрес</li>
        <li class="mb-2">✅ Качествени продукти на отлични цени</li>
      </ul>
    </div>
    <div class="mt-4">
      <a href="/catalog.html" class="btn btn-success btn-lg">Разгледай каталога</a>
    </div>
  </div>
`;
