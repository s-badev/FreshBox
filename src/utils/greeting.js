import { supabase } from '../services/supabaseClient.js';

/**
 * Renders a greeting for the currently logged-in user.
 * Falls back to email prefix if profiles query fails.
 * Never shows errors — fails silently.
 *
 * @param {{ targetId?: string }} options
 */
export async function renderGreeting({ targetId = 'fbGreeting' } = {}) {
  const el = document.getElementById(targetId);
  if (!el) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      el.textContent = '';
      return;
    }

    let displayName = '';

    // Try to get full_name from profiles
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile && profile.full_name && profile.full_name.trim()) {
        displayName = profile.full_name.trim();
      }
    } catch {
      // Silently ignore — RLS, missing row, etc.
    }

    // Fallback: email prefix with capitalised first letter
    if (!displayName) {
      const prefix = (user.email || '').split('@')[0] || '';
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    el.textContent = `Здравей, ${displayName} 👋`;
  } catch {
    // Silently ignore any unexpected errors
    if (el) el.textContent = '';
  }
}

/**
 * Subscribe to auth state changes and re-render greeting automatically.
 */
export function setupGreetingListener({ targetId = 'fbGreeting' } = {}) {
  supabase.auth.onAuthStateChange(() => {
    renderGreeting({ targetId });
  });
}
