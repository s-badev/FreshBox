import { supabase } from './supabaseClient.js';

/**
 * Зарежда всички категории
 * @returns {Promise<Array>} - Списък с категории
 */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  if (error) throw error;
  return data;
}

/**
 * Зарежда всички продукти
 * @returns {Promise<Array>} - Списък с продукти
 */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, category_id, name, description, price, unit, image_path, in_stock')
    .order('name');

  if (error) throw error;
  return data;
}

/**
 * Връща публичен URL за изображение от Storage bucket "product-images"
 * @param {string} imagePath - Име на файла (напр. "bananas.jpg")
 * @returns {string} - Публичен URL
 */
export function getProductImageUrl(imagePath) {
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath);

  return data.publicUrl;
}
