import { supabase } from './supabaseClient.js';
import { getSession } from './authService.js';

/**
 * Създава поръчка от съдържанието на кошницата
 * @param {Array<{id, name, price, qty}>} cartItems - Артикули от кошницата
 * @returns {Promise<number>} - ID на създадената поръчка
 */
export async function createOrderFromCart(cartItems) {
  // 1) Require auth
  const session = await getSession();
  if (!session) throw new Error('Трябва да сте влезли в профила си');

  const userId = session.user.id;
  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // 2) Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'new',
      total_amount: totalAmount
    })
    .select('id')
    .single();

  if (orderError) throw orderError;

  // 3) Insert order_items
  const items = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.qty,
    unit_price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);

  if (itemsError) throw itemsError;

  return order.id;
}

/**
 * Зарежда поръчките на текущия потребител с артикулите им
 * @returns {Promise<Array>} - Поръчки с вложени order_items + product name
 */
export async function fetchMyOrders() {
  const session = await getSession();
  if (!session) throw new Error('Трябва да сте влезли в профила си');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      note,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        products ( name )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
