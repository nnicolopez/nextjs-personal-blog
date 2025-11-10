# Architecture Overview

This document describes the technical architecture of PersonalCMS.

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Data Flow](#data-flow)
- [Routing Strategy](#routing-strategy)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Future Considerations](#future-considerations)

---

## System Architecture

PersonalCMS follows a modern **JAMstack architecture** with server-side rendering capabilities:

```
┌─────────────────────────────────────────────────────────┐
│                   Client (Browser)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   Landing  │  │  Dashboard │  │ User Pages │         │
│  │    Page    │  │     UI     │  │  (Public)  │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│              Next.js Application (Vercel)               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  Pages     │  │ API Routes │  │ Middleware │         │
│  │  (SSR/SSG) │  │   (REST)   │  │   (Auth)   │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└─────────────────────┬───────────────────────────────────┘
                      │
      ┌───────────────┼───────────────┐
      │               │               │
┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
│   Clerk   │   │ PostgreSQL│   │Cloudinary │
│   (Auth)  │   │  (Neon)   │   │  (Images) │
└───────────┘   └───────────┘   └───────────┘
```

---

## Technology Stack

### Frontend Layer

**Framework:** Next.js 14 (Pages Router)

- Server-side rendering for SEO
- Static site generation for performance
- API routes for backend functionality
- File-based routing

**UI Library:** Mantine 8

- Component library for consistent UI
- Built-in theming system
- Responsive by default
- Accessibility features

**State Management:** Zustand (planned)

- Lightweight state management
- No boilerplate
- Simple API for learning

### Backend Layer

**API:** Next.js API Routes

- RESTful endpoints
- Serverless functions on Vercel
- Co-located with frontend code

**Authentication:** Clerk

- Managed authentication service
- Pre-built UI components
- Session management
- Social logins (future)

**Database:** PostgreSQL + Prisma

- Relational database (hosted on Neon)
- Type-safe ORM with Prisma
- Automatic migrations
- Schema-first development

**File Storage:** Cloudinary

- Image hosting and optimization
- Automatic transformations
- CDN delivery
- Generous free tier

---

## Application Layers

### 1. Presentation Layer (`components/`, `pages/`)

**Responsibilities:**

- Render UI components
- Handle user interactions
- Form validation (client-side)
- Route navigation

**Key Components:**

- `Layout` - Main application wrapper
- `MainNav` - Navigation with auth state
- `Hero` - Profile hero section (templated)
- `FeaturedPosts` - Data-driven content cards
- `Dashboard/*` - Admin interface (planned)

### 2. Application Layer (`pages/api/`)

**Responsibilities:**

- Business logic
- Request validation
- Error handling
- Response formatting

**Planned API Routes:**

```
/api/auth/*         - Authentication (proxied to Clerk)
/api/pages          - CRUD for user pages
/api/pages/[id]     - Single page operations
/api/upload         - Image upload to Cloudinary
/api/users/[id]     - User profile management
```

### 3. Data Access Layer (`lib/`, `prisma/`)

**Responsibilities:**

- Database queries (Prisma)
- Data validation (Zod schemas)
- Type definitions
- Utility functions

**Structure:**

```
lib/
├── prisma.ts         # Prisma client singleton
├── validations.ts    # Zod schemas
├── api-client.ts     # Frontend API wrapper
└── utils.ts          # Helper functions
```

---

## Data Flow

### Example: User Edits Their Page

```
1. User submits form in Dashboard
   │
   ├─> Client-side validation (React Hook Form + Zod)
   │
2. POST /api/pages/[id]
   │
   ├─> Server-side validation (Zod)
   │
   ├─> Check authentication (Clerk middleware)
   │
   ├─> Check authorization (user owns page)
   │
3. Database Update (Prisma)
   │
   ├─> UPDATE pages SET ... WHERE id = ?
   │
4. Response to client
   │
   ├─> Success: { success: true, data: {...} }
   │
   ├─> Error: { success: false, error: "..." }
   │
5. Client updates UI
   │
   └─> Show success message or error
```

### Example: Public Views User Page

```
1. Request GET /[username]
   │
2. Next.js SSR
   │
   ├─> Query database for user by username
   │
   ├─> If not found → 404 page
   │
   ├─> If found → fetch page data
   │
3. Render page with user's data
   │
   ├─> Apply user's theme
   │
   ├─> Render sections dynamically
   │
   └─> Add SEO metadata
```

---

## Routing Strategy

### Public Routes (Unauthenticated)

| Route         | Type | Description                  |
| ------------- | ---- | ---------------------------- |
| `/`           | SSG  | Landing page (marketing)     |
| `/[username]` | SSR  | Public user pages            |
| `/login`      | CSR  | Login page (Clerk UI)        |
| `/signup`     | CSR  | Registration page (Clerk UI) |

### Protected Routes (Authenticated)

| Route                 | Type | Description      |
| --------------------- | ---- | ---------------- |
| `/dashboard`          | SSR  | Dashboard home   |
| `/dashboard/edit`     | CSR  | Page editor      |
| `/dashboard/settings` | CSR  | Account settings |
| `/dashboard/preview`  | CSR  | Page preview     |

### API Routes

| Route             | Methods            | Description       |
| ----------------- | ------------------ | ----------------- |
| `/api/pages`      | GET, POST          | List/create pages |
| `/api/pages/[id]` | GET, PATCH, DELETE | Page CRUD         |
| `/api/upload`     | POST               | Image upload      |
| `/api/users/me`   | GET, PATCH         | Current user      |

---

## Authentication Flow

### Using Clerk

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. User clicks "Sign In"
     ▼
┌────────────────┐
│  Clerk UI      │  (Pre-built component)
└────┬───────────┘
     │
     │ 2. Email/password entry
     ▼
┌────────────────┐
│  Clerk API     │  (Managed service)
└────┬───────────┘
     │
     │ 3. Returns session token
     ▼
┌────────────────┐
│  Next.js App   │
│  + Middleware  │  (Verifies token on each request)
└────┬───────────┘
     │
     │ 4. Sets httpOnly cookie
     ▼
┌──────────┐
│  Client  │  (Now authenticated)
└──────────┘
```

**Session Management:**

- Clerk manages sessions automatically
- Tokens stored in httpOnly cookies
- Middleware checks auth on protected routes
- Automatic token refresh

---

## State Management

### Client State (Zustand - Planned)

**Auth Store:**

```typescript
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}
```

**Editor Store:**

```typescript
interface EditorStore {
  pageData: PageData;
  isDirty: boolean;
  updateField: (field: string, value: any) => void;
  save: () => Promise<void>;
  reset: () => void;
}
```

### Server State (React Query - Future Consideration)

For data fetching and caching:

- Automatic background refetching
- Cache invalidation
- Optimistic updates
- Pagination support

---

## Database Schema

See [`DATABASE.md`](./DATABASE.md) for detailed schema design.

**Key Entities:**

- **User** - Managed by Clerk, referenced in our DB
- **Page** - User's published page
- **Section** - Content sections on a page
- **Theme** - Custom theme settings (V2)
- **Template** - Page templates (V2)

**Relationships:**

- User 1:1 Page (MVP: one page per user)
- Page 1:N Section
- User 1:N Theme (V2)

---

## Security Considerations

### Authentication

- ✅ Managed by Clerk (industry best practices)
- ✅ httpOnly cookies prevent XSS attacks
- ✅ CSRF protection built into Next.js

### Authorization

- Check user owns resource before allowing edits
- Use Prisma's `where` clause for row-level security

```typescript
// Example: Ensure user can only edit their own page
const page = await prisma.page.findFirst({
  where: {
    id: pageId,
    userId: currentUser.id, // Critical security check
  },
});
```

### Input Validation

- Client-side: React Hook Form + Zod
- Server-side: Zod schemas (always validate)
- Prisma prevents SQL injection

### Rate Limiting (Future)

- Implement rate limiting on API routes
- Prevent abuse of image upload
- Consider Vercel's built-in protections

---

## Performance Optimizations

### Current

- Static generation for landing page
- Image optimization with Next.js Image
- Mantine CSS-in-JS with minimal runtime
- Tree-shaking unused components

### Planned

- Database query optimization (indexes)
- CDN caching for public pages
- Lazy loading of dashboard components
- Incremental Static Regeneration for user pages

---

## Deployment Strategy

### Hosting: Vercel

**Benefits:**

- Zero-config deployment
- Automatic HTTPS
- Edge network (global CDN)
- Preview deployments for PRs
- Built-in analytics

**Environment Variables:**

- Managed in Vercel dashboard
- Different values for dev/staging/prod
- Encrypted at rest

### Database: Neon

**Benefits:**

- Serverless PostgreSQL
- Automatic scaling
- Branching for dev/staging
- Free tier sufficient for MVP

### CI/CD Pipeline

```
Push to branch
    │
    ├─> GitHub Actions (future)
    │   ├─> Run ESLint
    │   ├─> Run TypeScript check
    │   └─> Run tests
    │
    ├─> Vercel builds preview
    │
PR merged to develop
    │
    └─> Deploy to staging

PR merged to main
    │
    └─> Deploy to production
```

---

## Future Considerations

### Subdomain Support (V2)

**Challenge:** Vercel subdomain routing

**Solution:** Wildcard DNS + middleware routing

```
username.personalcms.com → middleware detects subdomain
                         → fetch user by username
                         → render their page
```

### Multi-Tenancy Architecture (V3)

If we scale to thousands of users:

- Consider database sharding
- Implement connection pooling
- Add Redis for caching
- Use CDN more aggressively

### Internationalization (Future)

- next-i18next for translations
- Mantine supports i18n out of the box
- Date/time localization

### Analytics (V2)

- Plausible Analytics (privacy-friendly)
- Track page views per user
- Dashboard to show stats

---

## Development Workflow

### Local Development

1. Clone repo
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start dev server: `npm run dev`

### Feature Development

1. Create feature branch from `develop`
2. Make changes
3. Test locally
4. Open PR to `develop`
5. Code review
6. Merge and auto-deploy to staging

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive-name`
3. Commit migration files
4. PR includes migration
5. Migrations run automatically on deploy

---

## Questions or Improvements?

This architecture will evolve as the project grows. If you have suggestions for improvements, please:

1. Open an issue for discussion
2. Propose changes via PR
3. Join discussions in GitHub Discussions

---

**Last Updated:** 2025-11-10
**Status:** Pre-MVP - Subject to change
