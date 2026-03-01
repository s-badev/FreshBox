import { supabase } from './supabaseClient.js';

/**
 * Проверява дали текущият потребител е администратор
 * @returns {Promise<boolean>} - true ако е admin, false иначе
 */
export async function isAdmin() {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('isAdmin RPC error:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('isAdmin error:', error);
    return false;
  }
}
