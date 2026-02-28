import { supabase } from './supabaseClient.js';

/**
 * Регистрация на нов потребител
 * @param {string} email - Email адрес
 * @param {string} password - Парола
 * @returns {Promise<Object>} - Supabase auth response
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Вход в системата
 * @param {string} email - Email адрес
 * @param {string} password - Парола
 * @returns {Promise<Object>} - Supabase auth response
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Изход от системата
 * @returns {Promise<Object>} - Supabase auth response
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
}

/**
 * Получаване на текущата сесия
 * @returns {Promise<Object|null>} - Текуща сесия или null
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  return session;
}

/**
 * Слушател за промени в auth състоянието
 * @param {Function} callback - Функция, която се извиква при промяна
 * @returns {Object} - Subscription object
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
