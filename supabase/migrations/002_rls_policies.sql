-- ============================================================
-- FreshBox: RLS Policies Migration
-- Created: 2026-02-28
-- Description: Enable RLS, add is_admin() helper, add policies
-- ============================================================

-- ---- Enable Row Level Security on all tables ----
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: is_admin()
-- Returns true if the current user has an 'admin' role.
-- SECURITY DEFINER so it can read user_roles regardless of
-- the caller's own RLS context.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ============================================================
-- A) categories & products – public read, admin manage
-- ============================================================

-- categories: public read
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- categories: admin insert
CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- categories: admin update
CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- categories: admin delete
CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  TO authenticated
  USING (is_admin());

-- products: public read
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

-- products: admin insert
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- products: admin update
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- products: admin delete
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- B) profiles – own row + admin full access
-- ============================================================

-- profiles: user reads own row
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin());

-- profiles: user inserts own row
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- profiles: user updates own row, admin any
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR is_admin())
  WITH CHECK (id = auth.uid() OR is_admin());

-- profiles: user deletes own row, admin any
CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (id = auth.uid() OR is_admin());

-- ============================================================
-- C) user_roles – own read + admin manage, no self-escalation
-- ============================================================

-- user_roles: user reads own, admin reads all
CREATE POLICY "user_roles_select"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- user_roles: admin insert only (prevent non-admin setting admin role)
CREATE POLICY "user_roles_insert_admin"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- user_roles: admin update only
CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- user_roles: admin delete only
CREATE POLICY "user_roles_delete_admin"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- D) orders – own orders + admin full access
-- ============================================================

-- orders: user reads own, admin reads all
CREATE POLICY "orders_select"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- orders: user inserts own orders only
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- orders: admin update (status changes etc.)
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- orders: admin delete
CREATE POLICY "orders_delete_admin"
  ON public.orders FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- E) order_items – own order items + admin full access
-- ============================================================

-- order_items: user reads items for own orders, admin reads all
CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
    OR is_admin()
  );

-- order_items: user inserts items into own orders only
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
    OR is_admin()
  );

-- order_items: admin update
CREATE POLICY "order_items_update_admin"
  ON public.order_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- order_items: admin delete
CREATE POLICY "order_items_delete_admin"
  ON public.order_items FOR DELETE
  TO authenticated
  USING (is_admin());
