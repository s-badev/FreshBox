# FreshBox

A mini e-commerce platform for fresh produce delivery, built with Vanilla JavaScript, Bootstrap, and Supabase. FreshBox provides catalog browsing, shopping cart, order management, and an admin panel.

## 🌐 Live Demo

**[https://freshbox-bg.netlify.app](https://freshbox-bg.netlify.app)**


## 🔑 Sample Credentials

The following accounts **already exist** in the live demo. Just log in — no registration needed.

| Role | Email | Password | What you'll see |
|---|---|---|---|
| **User** | `demo@freshbox.bg` | `demo1234` | Каталог, Кошница, Поръчки. **No** "Админ" link; `/admin.html` is denied. |
| **Admin** | `admin@freshbox.bg` | `admin12345` | Everything above **+** "⚙️ Админ" link in navbar; full admin panel access. |

<details>
<summary>🔧 (Optional) Assigning admin role manually — only if recreating accounts from scratch</summary>

If you create fresh accounts and need to grant admin access, run in Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<user-uuid-from-auth.users>', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

</details>

## 📋 Project Description

FreshBox is a multi-page web application that simulates an online grocery store for fresh produce. Users can browse a product catalog, add items to a shopping cart, place orders, and track order history. Administrators can manage products and view all orders through a dedicated admin panel.

**Key Features:**
- **Product Catalog**: Browse products with search, category filtering, and quantity stepper controls
- **Shopping Cart**: Client-side cart with add/remove/update quantity, subtotal calculation, and persistent state via localStorage
- **Checkout & Orders**: Place orders that create `orders` + `order_items` records in the database with unit price snapshots
- **Order History**: View past orders with expandable item details in an accordion layout
- **Authentication**: Register, login, and logout via Supabase Auth with session persistence
- **Role-Based Access**: Admin guard on both client and server (RLS) sides
- **Admin Panel**: Protected admin page for product management and order oversight
- **Responsive UI**: Mobile-friendly design using Bootstrap 5 with a custom design system

**User Roles:**
- **Guest**: Can view the landing page and the login/register page. Cannot access catalog, cart, orders, or admin.
- **Logged-in User**: Can browse the catalog, manage a shopping cart, place orders, and view personal order history.
- **Admin**: Has all user permissions plus access to the admin panel for product CRUD and viewing all orders. Admin role is stored in the `user_roles` table.

---

## 🖥️ Application Screens

FreshBox includes the following main screens:

1. **Home Page**  
   Landing page with project branding and navigation.

2. **Login / Register**  
   Authentication flow using Supabase Auth.

3. **Catalog**  
   Product listing with images, categories, and shopping actions.

4. **Cart**  
   Selected products, quantity handling, and order preparation.

5. **Orders**  
   Logged-in users can view their own orders.

6. **Admin Panel**  
   Restricted area for admin users only.

---

## 📸 Screenshots

### Каталог (Catalog)
![Catalog](docs/catalog.png)

### Кошница (Cart)
![Cart](docs/cart.png)

### Моите поръчки (Orders)
![Orders](docs/orders.png)

### Админ панел (Admin Panel)
![Admin](docs/admin.png)

### Footer & Contact Section
![Footer](docs/footer.png)

## 🧪 Quick Test Guide

Use this flow to review the project quickly:

1. Open the live demo  
2. Log in with the **demo user**
3. Open **Catalog**
4. Add products to the **Cart**
5. Open **Cart** and place an order
6. Open **Orders** and verify the created order
7. Log out
8. Log in with the **admin account**
9. Open **Admin Panel**
10. Verify admin-only access and management functionality

---

## 🏗️ Architecture

FreshBox follows a multi-page client-server architecture with Supabase as the backend:

### Frontend
- **Language**: Vanilla JavaScript (ES6 modules) — no frameworks
- **UI Library**: Bootstrap 5.3.8
- **Build Tool**: Vite 7.3.1 (multi-page app with separate HTML entry points)
- **Module Structure**: Pages, services, UI components, and styles in dedicated folders
- **Cart**: Client-side localStorage cart with a dedicated service module

### Backend
- **Platform**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (email/password)
- **Storage**: Supabase Storage (product images via `product-images` bucket)
- **API**: Supabase PostgREST API accessed through the supabase-js client
- **Security**: Row Level Security (RLS) policies with `is_admin()` helper function

### Deployment
- **Hosting**: Netlify (static multi-page site)
- **Build**: Static assets produced by `vite build` (outputs to `dist/`)

### Technology Stack

```
Frontend:
├── Vanilla JavaScript (ES6+)
├── Bootstrap 5.3.8
└── Vite 7.3.1 (dev server & bundler)

Backend:
├── Supabase
├── PostgreSQL (database)
├── Supabase Auth (authentication)
└── Supabase Storage (product images)

Development:
├── Node.js & npm
├── ES6 Modules
└── dotenv (.env.local for credentials)

Deployment:
└── Netlify (static hosting)
```

## 🗄️ Database Schema Design

The database consists of six tables with relationships managed through foreign keys and Row Level Security policies:

```mermaid
erDiagram
    auth_users ||--|| profiles : "has"
    profiles ||--o{ user_roles : "has"
    categories ||--o{ products : "contains"
    profiles ||--o{ orders : "places"
    orders ||--o{ order_items : "has"
    products ||--o{ order_items : "referenced in"

    auth_users {
        uuid id PK
        string email
        timestamp created_at
    }

    profiles {
        uuid id PK "FK auth_users.id"
        text full_name
        text phone
        text address
        timestamp created_at
    }

    user_roles {
        bigint id PK
        uuid user_id FK
        string role
        timestamp created_at
    }

    categories {
        bigint id PK
        string name
        text description
        timestamp created_at
    }

    products {
        bigint id PK
        bigint category_id FK
        string name
        text description
        numeric price
        string unit
        string image_path
        boolean in_stock
        timestamp created_at
    }

    orders {
        bigint id PK
        uuid user_id FK
        string status
        numeric total_amount
        text note
        timestamp created_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        numeric unit_price
        timestamp created_at
    }
```

### Table Descriptions

**`profiles`**: User profile linked to `auth.users`
- One-to-one relationship via `id` referencing `auth.users(id)`
- Stores full name, phone, and delivery address

**`user_roles`**: Role assignment for access control
- Links to `profiles(id)` via `user_id`
- Role is either `'user'` or `'admin'` (enforced by CHECK constraint)
- Unique constraint on `(user_id, role)`

**`categories`**: Product categories (e.g., Плодове, Зеленчуци, Млечни продукти)
- Unique name per category
- Products reference categories via `category_id`

**`products`**: Catalog items belonging to a category
- Foreign key to `categories(id)` with `ON DELETE SET NULL`
- Includes price, unit (кг/бр), image path, and stock status

**`orders`**: Customer orders placed during checkout
- Foreign key to `profiles(id)` via `user_id`
- Status uses a custom `order_status` enum: `'new'`, `'processing'`, `'done'`, `'cancelled'`
- Stores computed `total_amount`

**`order_items`**: Individual line items within an order
- Foreign key to `orders(id)` with `ON DELETE CASCADE`
- Foreign key to `products(id)` with `ON DELETE SET NULL`
- Stores `unit_price` as a snapshot at time of purchase

### Relationships

| From | To | Relation | Key |
|---|---|---|---|
| `profiles` | `auth.users` | one-to-one | `profiles.id` → `auth.users.id` |
| `user_roles` | `profiles` | many-to-one | `user_roles.user_id` → `profiles.id` |
| `products` | `categories` | many-to-one | `products.category_id` → `categories.id` |
| `orders` | `profiles` | many-to-one | `orders.user_id` → `profiles.id` |
| `order_items` | `orders` | many-to-one | `order_items.order_id` → `orders.id` |
| `order_items` | `products` | many-to-one | `order_items.product_id` → `products.id` |

### Security

All tables implement Row Level Security (RLS) with policies ensuring:
- Users can only read/update their own profile
- Users can only view and create their own orders and order items
- Categories and products are publicly readable
- Only admins can insert/update/delete products and categories
- The `is_admin()` helper function (SECURITY DEFINER) checks `user_roles` for the current user

### Database Schema Diagram

```mermaid
erDiagram
    auth_users ||--|| profiles : "1:1"
    profiles ||--o{ user_roles : "1:N"
    categories ||--o{ products : "1:N"
    profiles ||--o{ orders : "1:N"
    orders ||--o{ order_items : "1:N"
    products ||--o{ order_items : "1:N"
```

## 🚀 Local Development Setup Guide

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
- **Git**: For version control

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/s-badev/FreshBox.git
cd FreshBox
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Supabase Project

**Create a new Supabase project:**
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details and wait for setup to complete

**Get your credentials:**
1. Go to Project Settings → API
2. Copy the Project URL (e.g., `https://xxxxx.supabase.co`)
3. Copy the `anon/public` key

#### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

A template is provided in `.env.example`.

#### 5. Apply Database Migrations

Run migrations **in order** using the Supabase SQL Editor:

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run each migration file in sequence:
   - `supabase/migrations/001_init_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_roles_fix.sql`
   - `supabase/migrations/004_storage_product_images.sql`

> ⚠️ **Important**: Apply migrations in the exact order listed above. Never edit an already-applied migration — create a new one instead.

#### 6. (Optional) Seed Sample Data

Load sample categories and products:

1. Open Supabase **SQL Editor**
2. Run the seed file:
   - `supabase/seeds/002_seed_catalog.sql`

This inserts 8 categories and 24 products (3 per category) with Bulgarian names and descriptions.

#### 7. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Workflow

**Available Commands:**
- `npm run dev` — Start development server (hot reload enabled)
- `npm run build` — Build for production (outputs to `dist/`)
- `npm run preview` — Preview production build locally

**Development Tips:**
- The dev server supports hot module replacement (HMR)
- Check browser console for errors and logs
- Use browser DevTools Network tab to debug Supabase API calls
- Supabase dashboard provides real-time database monitoring

## 📂 Database Migrations

All migration files are in `supabase/migrations/`. Apply them in order:

| # | File | Description |
|---|---|---|
| 1 | `001_init_schema.sql` | Core tables: `profiles`, `user_roles`, `categories`, `products`, `orders`, `order_items`; `order_status` enum; indexes |
| 2 | `002_rls_policies.sql` | Enable RLS on all tables; `is_admin()` helper function; per-table access policies |
| 3 | `003_roles_fix.sql` | Add unique index on `user_roles(user_id)`; fix `is_admin()` function |
| 4 | `004_storage_product_images.sql` | Create Supabase Storage bucket `product-images` for product image uploads |

> 📸 **Storage**: Product images are stored in the Supabase Storage bucket **`product-images`**. The `products.image_path` column holds the relative path within that bucket.

**Seed files** (in `supabase/seeds/`):

| File | Description |
|---|---|
| `002_seed_catalog.sql` | 8 categories + 24 products with Bulgarian names, safe to re-run (`ON CONFLICT DO NOTHING`) |

## 📁 Key Folders and Files

### Project Structure Overview

```
FreshBox/
├── src/                            # Source code
│   ├── base.js                     # Shared imports (Bootstrap CSS + JS + app.css)
│   ├── pages/                      # Per-page entry points
│   │   ├── landing.js              # Landing / hero page
│   │   ├── login.js                # Login & registration
│   │   ├── catalog.js              # Product catalog with search & filter
│   │   ├── cart.js                 # Shopping cart with qty controls
│   │   ├── orders.js               # Order history accordion
│   │   └── admin.js                # Admin panel (protected)
│   ├── services/                   # Business logic & Supabase calls
│   │   ├── supabaseClient.js       # Initialized Supabase client
│   │   ├── authService.js          # Auth helpers (login, register, session)
│   │   ├── cartService.js          # localStorage cart (add, remove, update, totals)
│   │   ├── catalogService.js       # Fetch products & categories
│   │   ├── orderService.js         # Create orders from cart
│   │   ├── roleService.js          # Admin role check
│   │   └── adminService.js         # Admin CRUD (products, categories, orders, storage)
│   ├── ui/                         # Reusable UI modules
│   │   └── components/
│   │       ├── navbar.js           # Shared navbar with active page & cart badge
│   │       ├── footer.js           # Global footer component
│   │       └── productQuickView.js # Product quick-view modal
│   └── styles/
│       └── app.css                 # Custom design system & global styles
├── supabase/                       # Database & backend
│   ├── migrations/                 # SQL migration files (versioned, ordered)
│   │   ├── 001_init_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_roles_fix.sql
│   │   └── 004_storage_product_images.sql
│   └── seeds/                      # Sample data scripts
│       └── 002_seed_catalog.sql
├── public/                         # Static assets
│   └── vite.svg
├── index.html                      # Landing page entry
├── login.html                      # Login page entry
├── catalog.html                    # Catalog page entry
├── cart.html                       # Cart page entry
├── orders.html                     # Orders page entry
├── admin.html                      # Admin page entry
├── package.json                    # npm dependencies & scripts
├── .env.example                    # Environment variable template
├── .env.local                      # Local credentials (not in Git)
└── README.md                       # This file
```

### File Descriptions

#### Root HTML Files
Each HTML page is a separate Vite entry point with its own `<script type="module">`:
- **`index.html`** → `src/pages/landing.js`
- **`login.html`** → `src/pages/login.js`
- **`catalog.html`** → `src/pages/catalog.js`
- **`cart.html`** → `src/pages/cart.js`
- **`orders.html`** → `src/pages/orders.js`
- **`admin.html`** → `src/pages/admin.js`

#### Pages (`src/pages/`)
- **`landing.js`**: Hero section with call-to-action
- **`login.js`**: Login and registration forms using Supabase Auth
- **`catalog.js`**: Product grid with category filter, search bar, quantity stepper, and add-to-cart
- **`cart.js`**: Cart items with quantity controls, sidebar summary, checkout, and clear cart
- **`orders.js`**: Order history with Bootstrap accordion showing line items per order
- **`admin.js`**: Admin-protected panel with role guard

#### Services (`src/services/`)
- **`supabaseClient.js`**: Exports configured `supabase` instance using env vars
- **`authService.js`**: `login()`, `register()`, `logout()`, `getSession()`
- **`cartService.js`**: `getCart()`, `addToCart()`, `updateQty()`, `removeItem()`, `clearCart()`, `getTotals()`
- **`catalogService.js`**: `fetchProducts()`, `fetchCategories()`, `getProductImageUrl()`
- **`orderService.js`**: `createOrderFromCart()`, `fetchMyOrders()`
- **`roleService.js`**: `isAdmin()` check via Supabase RPC
- **`adminService.js`**: Admin CRUD operations for products, categories, orders, and image storage

#### Components (`src/ui/components/`)
- **`navbar.js`**: Shared navigation bar with active page highlighting, auth-aware links, admin link visibility, and live cart item count badge
- **`footer.js`**: Global footer with support strip, app banner, link columns, social icons, and payment badges
- **`productQuickView.js`**: Quick-view modal for product details with similar products and add-to-cart

#### Styles (`src/styles/`)
- **`app.css`**: Complete custom design system — CSS variables, typography, navbar, buttons, cards, catalog grid, cart layout, order accordion, toasts, responsive overrides, print styles

#### Shared (`src/base.js`)
- Imports Bootstrap CSS, Bootstrap JS bundle, and `app.css` — included by every page

## 🌐 Deployment (Netlify)

### Live URL

**[https://freshbox-bg.netlify.app](https://freshbox-bg.netlify.app)**

### Environment Variables

Set these in **Netlify → Site Settings → Environment Variables → Add variable**:

| Variable | Description | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key (anon/public) | `sb_publishable_...` |

> These are build-time variables. After adding or changing them, **trigger a new deploy** for changes to take effect.

### Build Settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18+ |

## 🛠️ Troubleshooting

| Issue | Solution |
|---|---|
| **Product image not updating after re-upload with same filename** | CDN / browser cache. Use hard refresh (`Ctrl+Shift+R`) or upload with a new filename and update the product's `image_path`. |
| **"Админ" link missing in navbar** | The logged-in user doesn't have an `admin` role in `user_roles`. See the optional SQL snippet in the Sample Credentials section above. |
| **White flash (FOUC) between pages** | Already mitigated with inline critical CSS in all HTML `<head>` tags. If still visible, ensure the build is up to date (`npm run build`). |

## 🎯 Conclusion

FreshBox is a complete mini e-commerce web application that demonstrates practical use of modern front-end development together with backend services through Supabase.

The project includes:

- authentication
- role-based access control
- product catalog
- shopping cart
- order flow
- admin functionality
- file storage
- deployment
- structured documentation

It is designed not as a static demo, but as a functional multi-page application that covers the main capstone requirements in a realistic product scenario.

---

## 🔗 Repository

**GitHub:**  
https://github.com/s-badev/FreshBox
