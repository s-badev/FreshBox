const CART_KEY = 'freshbox_cart';

/**
 * Връща текущото съдържание на кошницата
 * @returns {Array} - Списък с артикули
 */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Запазва кошницата в localStorage
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Добавя продукт в кошницата или увеличава количеството
 * @param {{ id, name, price, unit, image_path }} product
 */
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      unit: product.unit,
      image_path: product.image_path || null,
      qty: 1
    });
  }

  saveCart(cart);
}

/**
 * Задава конкретно количество за артикул (qty <= 0 => премахва)
 * @param {number} productId
 * @param {number} qty
 */
export function updateQty(productId, qty) {
  let cart = getCart();

  if (qty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else {
    const item = cart.find(item => item.id === productId);
    if (item) item.qty = qty;
  }

  saveCart(cart);
}

/**
 * Премахва артикул от кошницата
 * @param {number} productId
 */
export function removeItem(productId) {
  saveCart(getCart().filter(item => item.id !== productId));
}

/**
 * Изчиства цялата кошница
 */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/**
 * Изчислява обща стойност и брой артикули
 * @returns {{ subtotal: number, itemsCount: number }}
 */
export function getTotals() {
  const cart = getCart();
  return {
    subtotal: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    itemsCount: cart.reduce((sum, item) => sum + item.qty, 0)
  };
}
