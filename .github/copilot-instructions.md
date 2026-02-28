# FreshBox - GitHub Copilot Instructions

## Project Overview
FreshBox is a **Tech AI capstone project**: a mini e-commerce platform for fresh produce delivery with catalog browsing, shopping cart, order management, and admin panel.

## Tech Stack
- **Frontend**: Vite (multi-page app with separate HTML files)
- **Language**: Vanilla JavaScript (NO TypeScript, React, Vue, or other frameworks)
- **UI**: Bootstrap 5 (Bootstrap-first approach)
- **Backend**: Supabase (Database + Authentication + Storage)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Auth**: Supabase Auth with role-based access control

## Project Structure
```
freshbox/
├── index.html, login.html, catalog.html, cart.html, orders.html, admin.html
├── src/
│   ├── pages/          # Page entry points (landing.js, login.js, etc.)
│   ├── services/       # Supabase & business logic
│   ├── utils/          # Helper functions
│   ├── ui/components/  # Reusable UI components
│   └── styles/         # Custom CSS
├── supabase/
│   └── migrations/     # SQL migration files (NEVER edit old ones)
└── public/             # Static assets
```

## DO ✅

### Code Style & Architecture
- **Use Vanilla JavaScript** - No frameworks, no TypeScript
- **Use Bootstrap classes** for all UI styling
- **Keep UI text in Bulgarian** (buttons, labels, messages, placeholders)
- **Write modular code** - separate concerns into services, utils, components
- **Use async/await** for asynchronous operations
- **Handle errors gracefully** with user-friendly Bulgarian messages

### Supabase & Database
- **Store SQL migrations** in `/supabase/migrations/` with timestamp prefixes
- **Never edit existing migration files** - create new ones for schema changes
- **Always use Row Level Security (RLS)** policies for tables
- **Implement role-based access** (users, admins)
- **Use Supabase client** from `src/services/supabase.js`

### Development Workflow
- **Make small, incremental changes** - avoid large refactors unless explicitly requested
- **Test changes** before marking complete
- **Commit with conventional style**: 
  - `feat(scope): add feature`
  - `fix(scope): fix bug`
  - `docs(scope): update documentation`
  - `style(scope): formatting changes`
  - `refactor(scope): code refactoring`
- **Preserve existing functionality** when adding new features

### File Management
- **Create new files** in appropriate directories based on purpose
- **Import Bootstrap** via `src/base.js` (shared imports)
- **Use relative imports** correctly for modules
- **Keep HTML pages** in project root

## DON'T ❌

### Code Style & Architecture
- ❌ **Don't use TypeScript** - stick to vanilla JS
- ❌ **Don't use React, Vue, Svelte** or any framework
- ❌ **Don't use inline styles** - use Bootstrap classes
- ❌ **Don't write English UI text** - keep Bulgarian
- ❌ **Don't create monolithic files** - maintain modular structure

### Supabase & Database
- ❌ **Don't edit old migration files** - they may have already run
- ❌ **Don't skip RLS policies** - security is critical
- ❌ **Don't hardcode admin checks** - use Supabase roles
- ❌ **Don't expose sensitive data** in client code

### Development Workflow
- ❌ **Don't make big refactors** without explicit request
- ❌ **Don't break existing pages** when adding new features
- ❌ **Don't remove functionality** unless specifically asked
- ❌ **Don't change project structure** without discussion
- ❌ **Don't use generic commit messages** like "update files"

### File Management
- ❌ **Don't delete the multi-page structure** - keep separate HTML files
- ❌ **Don't move files** without updating all imports
- ❌ **Don't duplicate Bootstrap imports** - use `src/base.js`

## Key Features to Implement

### Authentication (Supabase Auth)
- Login/logout functionality
- Role-based access (user, admin)
- Session persistence
- Protected routes

### User Features
- Browse product catalog
- Add products to cart
- Place orders
- View order history

### Admin Features
- Product management (CRUD)
- View all orders
- Update order status
- User management

### Database Schema
- `products` - product catalog
- `orders` - customer orders
- `order_items` - order line items
- `profiles` - user profiles with roles
- Proper RLS policies for each table

## Common Patterns

### Page Structure
```javascript
import '../base.js';
import { renderNavbar } from '../ui/components/navbar.js';

document.querySelector('#nav').innerHTML = renderNavbar('pageName');
document.querySelector('#app').innerHTML = `...`;
```

### Supabase Service
```javascript
import { supabase } from './supabase.js';

export async function fetchData() {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
}
```

### Error Handling
```javascript
try {
  await someOperation();
} catch (error) {
  console.error(error);
  alert('Грешка: ' + error.message);
}
```

## Migration Naming Convention
Use timestamp prefix: `YYYYMMDDHHMMSS_description.sql`

Example: `20260228120000_create_products_table.sql`

## When in Doubt
- **Ask before making breaking changes**
- **Prefer minimal changes** over comprehensive rewrites
- **Test in the browser** after code changes
- **Follow existing patterns** in the codebase
