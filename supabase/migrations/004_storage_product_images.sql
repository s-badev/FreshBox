-- ============================================================
-- FreshBox: Storage Bucket + RLS for product-images
-- Created: 2026-03-02
-- Description: Ensures product-images bucket exists with
--              public read and admin-only write policies.
--              Idempotent – safe to re-run.
-- ============================================================

-- 1) Create bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE
  SET public = true;

-- 2) Drop existing policies (idempotent)
DROP POLICY IF EXISTS "product_images_select_public"  ON storage.objects;
DROP POLICY IF EXISTS "product_images_insert_admin"   ON storage.objects;
DROP POLICY IF EXISTS "product_images_update_admin"   ON storage.objects;
DROP POLICY IF EXISTS "product_images_delete_admin"   ON storage.objects;

-- 3) Public read – anyone can view product images
CREATE POLICY "product_images_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- 4) Admin insert
CREATE POLICY "product_images_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- 5) Admin update
CREATE POLICY "product_images_update_admin"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- 6) Admin delete
CREATE POLICY "product_images_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );
