-- ============================================================
-- FreshBox: Roles Fix Migration
-- Created: 2026-03-01
-- Description: Add unique constraint and fix is_admin() function
-- ============================================================

-- ---- Add UNIQUE constraint on user_roles(user_id) ----
-- This allows us to use ON CONFLICT(user_id) for upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_user_id_unique 
  ON public.user_roles (user_id);

-- ---- Fix is_admin() function to match real schema ----
-- The function checks if the current user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  );
$$;
