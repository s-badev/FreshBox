import { supabase } from './supabaseClient.js';

// ============================================================
// CATEGORIES
// ============================================================

/** Зарежда всички категории (подредени по име) */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, created_at')
    .order('name');
  if (error) throw error;
  return data;
}

/** Създава нова категория */
export async function createCategory({ name }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Обновява категория по id */
export async function updateCategory(id, { name }) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Изтрива категория по id */
export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================
// PRODUCTS
// ============================================================

/**
 * Зарежда продукти с незадължителен филтър.
 * @param {Object} opts
 * @param {string} [opts.search] - частично търсене по име
 * @param {number|null} [opts.categoryId] - филтър по категория
 */
export async function fetchProducts({ search, categoryId } = {}) {
  let query = supabase
    .from('products')
    .select('id, category_id, name, description, price, unit, image_path, in_stock, created_at')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Създава продукт (image_path може да е null) */
export async function createProduct({ name, description, price, unit, category_id, image_path }) {
  const { data, error } = await supabase
    .from('products')
    .insert({ name, description, price, unit, category_id, image_path, in_stock: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Обновява продукт по id */
export async function updateProduct(id, fields) {
  const { data, error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Изтрива продукт по id */
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================
// STORAGE – product-images bucket
// ============================================================

/**
 * Качва изображение за продукт.
 * @param {File} file - File обект от <input type="file">
 * @param {number|string} productId
 * @returns {string} image_path – пътя, който се записва в products.image_path
 */
export async function uploadProductImage(file, productId) {
  // Sanitize filename: keep extension, replace spaces/special chars
  const ext = file.name.split('.').pop() || 'jpg';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 60);
  const ts = Date.now();
  const path = `products/${productId}/${ts}_${safeName}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw error;
  return path;
}

/**
 * Изтрива изображение (best-effort).
 * @param {string} imagePath
 */
export async function deleteProductImage(imagePath) {
  if (!imagePath) return;
  try {
    await supabase.storage
      .from('product-images')
      .remove([imagePath]);
  } catch (err) {
    console.warn('Image delete failed (best-effort):', err);
  }
}

/**
 * Връща публичен URL за изображение.
 * @param {string} imagePath
 * @returns {string}
 */
export function getPublicImageUrl(imagePath) {
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(imagePath);
  return data.publicUrl;
}
