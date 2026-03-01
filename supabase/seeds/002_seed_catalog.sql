-- ============================================================
-- FreshBox: Seed Catalog Data
-- Created: 2026-03-01
-- Description: 8 categories + 24 products (3 per category)
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

-- ---- Categories ----
INSERT INTO public.categories (id, name, description) VALUES
  (1, 'Плодове',      'Пресни сезонни плодове'),
  (2, 'Зеленчуци',    'Пресни зеленчуци от местни производители'),
  (3, 'Млечни продукти', 'Мляко, сирене, кисело мляко и други'),
  (4, 'Месо и риба',  'Прясно месо и морски дарове'),
  (5, 'Хляб и тестени', 'Хляб, кифли и пресни тестени изделия'),
  (6, 'Напитки',      'Вода, сокове и безалкохолни напитки'),
  (7, 'Подправки',    'Билки, подправки и дресинги'),
  (8, 'Замразени',    'Замразени плодове, зеленчуци и готови ястия')
ON CONFLICT (id) DO NOTHING;

-- ---- Products ----

-- Плодове (category 1)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (1,  1, 'Банани',       'Узрели банани от Еквадор',           2.49, 'кг', 'bananas.jpg',      true),
  (2,  1, 'Ябълки',       'Български ябълки сорт Айдаред',     1.89, 'кг', 'apples.jpg',       true),
  (3,  1, 'Ягоди',        'Пресни български ягоди',             5.99, 'кг', 'strawberries.jpg', true)
ON CONFLICT (id) DO NOTHING;

-- Зеленчуци (category 2)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (4,  2, 'Домати',       'Розови домати от Петрич',            3.49, 'кг', 'tomatoes.jpg',     true),
  (5,  2, 'Краставици',   'Пресни оранжерийни краставици',      2.29, 'кг', 'cucumbers.jpg',    true),
  (6,  2, 'Моркови',      'Пресни моркови, измити',             1.59, 'кг', 'carrots.jpg',      true)
ON CONFLICT (id) DO NOTHING;

-- Млечни продукти (category 3)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (7,  3, 'Прясно мляко', 'Краве мляко 3.6%, 1л',              2.19, 'бр', 'milk.jpg',         true),
  (8,  3, 'Бяло сирене',  'Българско краве сирене',             8.99, 'кг', 'white-cheese.jpg', true),
  (9,  3, 'Кисело мляко', 'Българско кисело мляко 3.6%, 400г',  1.29, 'бр', 'yogurt.jpg',       true)
ON CONFLICT (id) DO NOTHING;

-- Месо и риба (category 4)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (10, 4, 'Пилешки бутчета', 'Охладени пилешки бутчета',       7.99, 'кг', 'chicken-legs.jpg', true),
  (11, 4, 'Свинска пържола',  'Прясна свинска пържола без кост', 12.49, 'кг', 'pork-chop.jpg',   true),
  (12, 4, 'Сьомга филе',     'Прясно филе от сьомга',          24.99, 'кг', 'salmon.jpg',       true)
ON CONFLICT (id) DO NOTHING;

-- Хляб и тестени (category 5)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (13, 5, 'Бял хляб',     'Пшеничен хляб, 650г нарязан',       1.49, 'бр', 'white-bread.jpg',  true),
  (14, 5, 'Пълнозърнест хляб', 'Хляб от пълнозърнесто брашно', 2.69, 'бр', 'whole-bread.jpg',  true),
  (15, 5, 'Кифли',        'Пресни кифли, опаковка от 4',        1.99, 'бр', 'rolls.jpg',        true)
ON CONFLICT (id) DO NOTHING;

-- Напитки (category 6)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (16, 6, 'Минерална вода', 'Девин минерална вода, 1.5л',       0.89, 'бр', 'water.jpg',        true),
  (17, 6, 'Портокалов сок',  'Натурален портокалов сок, 1л',   3.49, 'бр', 'orange-juice.jpg', true),
  (18, 6, 'Лимонада',      'Домашна лимонада, 1л',              2.99, 'бр', 'lemonade.jpg',     true)
ON CONFLICT (id) DO NOTHING;

-- Подправки (category 7)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (19, 7, 'Чубрица',      'Българска шарена чубрица, 50г',      1.79, 'бр', 'savory.jpg',       true),
  (20, 7, 'Черен пипер',  'Млян черен пипер, 50г',              2.29, 'бр', 'black-pepper.jpg', true),
  (21, 7, 'Червен пипер', 'Сладък червен пипер, 50г',           1.99, 'бр', 'paprika.jpg',      true)
ON CONFLICT (id) DO NOTHING;

-- Замразени (category 8)
INSERT INTO public.products (id, category_id, name, description, price, unit, image_path, in_stock) VALUES
  (22, 8, 'Замразен грах',  'Зелен грах, 450г',                 2.49, 'бр', 'frozen-peas.jpg',    true),
  (23, 8, 'Замразени ягоди', 'Замразени горски ягоди, 300г',     3.99, 'бр', 'frozen-berries.jpg', true),
  (24, 8, 'Замразена пица',  'Пица Маргарита, 350г',            4.49, 'бр', 'frozen-pizza.jpg',   true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NOTES
-- ============================================================
-- Image files to upload to Supabase Storage bucket "product-images":
--   bananas.jpg, apples.jpg, strawberries.jpg,
--   tomatoes.jpg, cucumbers.jpg, carrots.jpg,
--   milk.jpg, white-cheese.jpg, yogurt.jpg,
--   chicken-legs.jpg, pork-chop.jpg, salmon.jpg,
--   white-bread.jpg, whole-bread.jpg, rolls.jpg,
--   water.jpg, orange-juice.jpg, lemonade.jpg,
--   savory.jpg, black-pepper.jpg, paprika.jpg,
--   frozen-peas.jpg, frozen-berries.jpg, frozen-pizza.jpg
--
-- How to run:
--   1) Open the Supabase Dashboard -> SQL Editor
--   2) Paste this file's contents
--   3) Click "Run" 
--   4) Safe to re-run — uses ON CONFLICT DO NOTHING
-- ============================================================
