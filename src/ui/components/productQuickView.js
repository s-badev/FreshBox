/**
 * Product Quick View Modal (eBag-style)
 * Reusable module for Catalog + Landing pages
 *
 * Exports:
 *   openProductQuickView({ product, allProducts, categories, getImageUrl, onAddToCart })
 *   closeProductQuickView()
 */

let backdropEl = null;
let modalEl = null;
let onEscHandler = null;
let previousOverflow = '';

/**
 * Opens the Quick View modal for a given product.
 * @param {Object} opts
 * @param {Object} opts.product         – full product object { id, name, description, price, unit, image_path, category_id, in_stock }
 * @param {Array}  opts.allProducts     – all loaded products (used for "similar" section)
 * @param {Array}  [opts.categories]    – category list [{ id, name }] (optional, for breadcrumb)
 * @param {Function} opts.getImageUrl   – (image_path) => publicUrl
 * @param {Function} opts.onAddToCart   – (product, qty) => void
 */
export function openProductQuickView({ product, allProducts, categories = [], getImageUrl, onAddToCart }) {
  // If already open, just swap content
  if (backdropEl) {
    renderModalContent({ product, allProducts, categories, getImageUrl, onAddToCart });
    // Scroll modal body to top
    const body = modalEl.querySelector('.fb-modal-body');
    if (body) body.scrollTop = 0;
    return;
  }

  // Create backdrop + modal shell
  backdropEl = document.createElement('div');
  backdropEl.className = 'fb-modal-backdrop';

  modalEl = document.createElement('div');
  modalEl.className = 'fb-modal';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');

  backdropEl.appendChild(modalEl);
  document.body.appendChild(backdropEl);

  // Render content
  renderModalContent({ product, allProducts, categories, getImageUrl, onAddToCart });

  // Lock page scroll
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // Backdrop click closes
  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) closeProductQuickView();
  });

  // ESC key closes
  onEscHandler = (e) => {
    if (e.key === 'Escape') closeProductQuickView();
  };
  document.addEventListener('keydown', onEscHandler);

  // Focus close button
  requestAnimationFrame(() => {
    const closeBtn = modalEl.querySelector('.fb-modal-close');
    if (closeBtn) closeBtn.focus();
  });
}

/**
 * Closes the Quick View modal and cleans up.
 */
export function closeProductQuickView() {
  if (!backdropEl) return;

  backdropEl.classList.add('fb-modal-backdrop--closing');
  modalEl.classList.add('fb-modal--closing');

  const onEnd = () => {
    if (backdropEl && backdropEl.parentNode) {
      backdropEl.parentNode.removeChild(backdropEl);
    }
    backdropEl = null;
    modalEl = null;
    document.body.style.overflow = previousOverflow;
    if (onEscHandler) {
      document.removeEventListener('keydown', onEscHandler);
      onEscHandler = null;
    }
  };

  modalEl.addEventListener('animationend', onEnd, { once: true });
  // Fallback in case animationend doesn't fire
  setTimeout(onEnd, 350);
}

/* ---- Internal rendering ---- */

function renderModalContent({ product, allProducts, categories, getImageUrl, onAddToCart }) {
  const catName = categories.find(c => c.id === product.category_id)?.name || '';

  const imageUrl = product.image_path ? getImageUrl(product.image_path) : '';
  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${esc(product.name)}" class="fb-modal-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'fb-modal-img-placeholder\\'>📷</div>';">`
    : `<div class="fb-modal-img-placeholder">📷</div>`;

  const stockBadge = product.in_stock
    ? '<span class="badge bg-success">В наличност</span>'
    : '<span class="badge bg-secondary">Изчерпан</span>';

  // Similar products: same category, exclude current, max 6
  const similar = allProducts
    .filter(p => p.category_id === product.category_id && p.id !== product.id && p.in_stock)
    .slice(0, 6);

  const similarHtml = similar.length > 0 ? `
    <div class="fb-similar-section">
      <h6 class="fb-similar-title">Подобни в тази категория</h6>
      <div class="fb-similar-row">
        ${similar.map(s => {
          const sImgUrl = s.image_path ? getImageUrl(s.image_path) : '';
          const sImg = sImgUrl
            ? `<img src="${sImgUrl}" alt="${esc(s.name)}" class="fb-similar-card-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'fb-similar-card-img-ph\\'>📷</div>';">`
            : `<div class="fb-similar-card-img-ph">📷</div>`;
          return `
            <button type="button" class="fb-similar-card" data-similar-id="${s.id}">
              ${sImg}
              <span class="fb-similar-card-name">${esc(s.name)}</span>
              <span class="fb-similar-card-price">${Number(s.price).toFixed(2)} лв/${s.unit}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  modalEl.innerHTML = `
    <div class="fb-modal-header">
      <div class="fb-modal-breadcrumb">
        ${catName ? `<span class="text-fb-muted small">${esc(catName)}</span><span class="text-fb-muted small mx-1">›</span>` : ''}
        <span class="small fw-semibold">${esc(product.name)}</span>
      </div>
      <button type="button" class="fb-modal-close" aria-label="Затвори">✕</button>
    </div>
    <div class="fb-modal-body">
      <div class="fb-modal-grid">
        <div class="fb-modal-image-col">
          ${imageHtml}
        </div>
        <div class="fb-modal-details-col">
          <h4 class="fb-modal-product-name">${esc(product.name)}</h4>
          <div class="fb-modal-meta">
            <span class="badge rounded-pill bg-light text-dark border">${esc(product.unit)}</span>
            ${stockBadge}
          </div>
          <div class="fb-modal-price">
            ${Number(product.price).toFixed(2)} <span class="fb-modal-price-unit">лв/${product.unit}</span>
          </div>
          ${product.description ? `<p class="fb-modal-description">${esc(product.description)}</p>` : ''}
          <div class="fb-modal-cart-row">
            <div class="fb-modal-qty-stepper">
              <button type="button" class="qty-step-btn fb-modal-qty-dec" aria-label="Намали">−</button>
              <input type="number" class="fb-modal-qty-input" value="1" min="1" max="99" aria-label="Количество">
              <button type="button" class="qty-step-btn fb-modal-qty-inc" aria-label="Увеличи">+</button>
            </div>
            <button type="button" class="btn btn-success fb-modal-add-btn" ${!product.in_stock ? 'disabled' : ''}>
              🛒 Добави в количка
            </button>
          </div>
        </div>
      </div>
      ${similarHtml}
    </div>
  `;

  // ---- Event handlers inside modal ----

  // Close button
  modalEl.querySelector('.fb-modal-close').addEventListener('click', closeProductQuickView);

  // Qty stepper
  const qtyInput = modalEl.querySelector('.fb-modal-qty-input');
  modalEl.querySelector('.fb-modal-qty-dec').addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value) || 1) - 1);
  });
  modalEl.querySelector('.fb-modal-qty-inc').addEventListener('click', () => {
    qtyInput.value = Math.min(99, (parseInt(qtyInput.value) || 1) + 1);
  });
  qtyInput.addEventListener('change', () => {
    qtyInput.value = Math.max(1, Math.min(99, parseInt(qtyInput.value) || 1));
  });

  // Add to cart
  modalEl.querySelector('.fb-modal-add-btn').addEventListener('click', () => {
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    onAddToCart(product, qty);
  });

  // Similar product cards -> swap modal content
  modalEl.querySelectorAll('.fb-similar-card').forEach(card => {
    card.addEventListener('click', () => {
      const simId = Number(card.dataset.similarId);
      const simProduct = allProducts.find(p => p.id === simId);
      if (simProduct) {
        renderModalContent({ product: simProduct, allProducts, categories, getImageUrl, onAddToCart });
        // Scroll modal body to top
        const body = modalEl.querySelector('.fb-modal-body');
        if (body) body.scrollTop = 0;
      }
    });
  });
}

/** Simple HTML-escape helper */
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
