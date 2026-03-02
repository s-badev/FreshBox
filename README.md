# FreshBox

FreshBox е модерно, минималистично **multi-page e-commerce** уеб приложение за поръчка на хранителни продукти.  
Изградено е с **Vanilla HTML/CSS/JavaScript + Bootstrap**, **Vite** и **Supabase** (DB + Auth + Storage).

Фокус:
- реален backend (Supabase)
- ясна архитектура (pages/services/components)
- сигурност чрез **RLS политики**
- реален checkout (orders + order_items)
- admin role + guard
- лесно надграждане (CRUD, upload, seed)

---

## Live Demo
- Live URL: _(to be added after Netlify deploy)_

## Sample Credentials (for testers)
> Създай тези акаунти през приложението (login/register), за да имаш стабилни данни за проверка:

**Demo user**
- Email: `demo@freshbox.bg`
- Password: `demo1234`

**Admin**
- Email: `admin@freshbox.bg`
- Password: `admin12345`
- Role: `admin` (set in `public.user_roles`)

---

## Key Differentiators

| Capability | Description |
|---|---|
| Supabase Backend | Postgres DB + Auth + Storage |
| RLS Security | Server-side access control for users + orders + admin-only routes |
| Multi-page App | Separate HTML pages (index, login, catalog, cart, orders, admin) |
| Real Checkout | Creates `orders` + `order_items` from localStorage cart |
| Storage Images | Product images served from Supabase Storage bucket `product-images` |
| Modular Codebase | `src/pages`, `src/services`, `src/ui/components`, `src/styles` |

---

## Features

### 🧭 Pages / Screens
- ✅ `index.html` — landing page (“Начало”)
- ✅ `login.html` — register / login (Supabase Auth)
- ✅ `catalog.html` — продуктови карти, търсене, филтър по категория, “Добави”
- ✅ `cart.html` — количка: qty controls (+/−/input), subtotal, “Изчисти”, “Поръчай”
- ✅ `orders.html` — “Моите поръчки” + expand/collapse items
- ✅ `admin.html` — admin guard + base admin page (to be extended)

### 🔐 Authentication
- ✅ Register / Login / Logout чрез Supabase Auth
- ✅ Navbar адаптация (Вход/Изход + Admin при admin role)
- ✅ Session-based access via `authService.getSession()`

### 🛒 Cart
- ✅ localStorage cart
- ✅ add/remove/update qty
- ✅ totals summary
- ✅ empty state + CTA към каталога

### 🧾 Checkout / Orders
- ✅ “Поръчай” създава:
  - `orders` (user_id, status='new')
  - `order_items` (order_id, product_id, quantity, unit_price snapshot)
- ✅ След успешно създаване: clearCart + redirect към orders

### 👮 Admin
- ✅ `user_roles` + admin role
- ✅ server-side RLS policies
- ✅ client-side admin guard (redirect/deny for non-admin)
- ⏳ (Next) CRUD за продукти + upload images + view orders

### 🗄️ Database (Supabase)
Main tables:
- `profiles` — user profile linked to `auth.users`
- `categories` — product categories
- `products` — catalog items (+ image info)
- `orders` — user orders
- `order_items` — order line items
- `user_roles` — role mapping (`admin`)

Migrations are stored locally in:
- `supabase/migrations/*.sql`

### 🖼️ Storage (Supabase)
- Bucket: `product-images`
- Used for product images in catalog cards

---

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT (Vite)                        │
├──────────────────────────────────────────────────────────────┤
│  index.html   login.html   catalog.html   cart.html          │
│  orders.html  admin.html                                       │
└──────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                JS LAYER (modules / services)                 │
├──────────────────────────────────────────────────────────────┤
│  src/pages/*        → per-page logic (render + events)       │
│  src/services/*     → supabase calls + business logic        │
│  src/ui/components  → shared UI parts (navbar)               │
│  src/styles/app.css → design system + global styles          │
└──────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│                     SUPABASE BACKEND                         │
├──────────────────────────────────────────────────────────────┤
│  Auth (JWT)  +  Postgres DB  +  Storage (bucket)             │
│  RLS policies enforce per-user access                         │
└──────────────────────────────────────────────────────────────┘
