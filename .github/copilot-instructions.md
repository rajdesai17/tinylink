# TinyLink - AI Coding Agent Instructions

## Project Overview
TinyLink is a production URL shortener built with Next.js 16 App Router, TypeScript, and Vercel Postgres (Neon). The app creates short codes (6-8 alphanumeric chars) that redirect to long URLs while tracking clicks.

**Live:** https://tinylink-kappa-sandy.vercel.app  
**Database:** Neon Postgres via Vercel

## Critical Architecture Patterns

### Server vs Client Component Strategy
**IMPORTANT:** This project strictly separates server and client data access patterns:

```typescript
// ✅ Server Components (pages, route handlers) - Use DIRECT database queries
import { getLink } from '@/lib/db';
const link = await getLink(code);  // Direct DB access, faster

// ✅ Client Components (forms, interactive UI) - Use fetch() API
const response = await fetch('/api/links', { method: 'POST', ... });
```

**Why:** Server components avoid HTTP overhead by querying the database directly. Client components must use fetch() since they run in the browser. See `app/code/[code]/page.tsx` (direct DB) vs `components/LinkTable.tsx` (fetch).

### Next.js 16 Async Params Pattern
All dynamic routes must await params (Next.js 16 breaking change):

```typescript
// ✅ CORRECT - Next.js 16
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;  // Must await!
  // ...
}

// ❌ WRONG - Next.js 15 style (causes 404/500 errors)
{ params }: { params: { code: string } }
const link = await getLink(params.code);  // Error: params is a Promise
```

**Affected files:** `app/[code]/route.ts`, `app/api/links/[code]/route.ts`, `app/code/[code]/page.tsx`

### Database Layer (lib/db.ts)
All database operations use `@vercel/postgres` with tagged template literals:

```typescript
// Direct SQL queries with automatic escaping
const result = await sql`SELECT * FROM links WHERE code = ${code}`;
return result.rows[0] || null;

// Error handling for duplicates (PostgreSQL error code 23505)
if (error.code === '23505') {
  return { success: false, error: 'Code already exists' };
}
```

**Schema:** `schema.sql` - Single `links` table with code (unique), url, clicks, timestamps.

## Key Workflows

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

**Environment:** Requires `.env.local` with:
- `POSTGRES_URL` - Pooled connection
- `POSTGRES_PRISMA_URL` - PgBouncer connection  
- `POSTGRES_URL_NON_POOLING` - Direct connection
- `BASE_URL` - App URL for generating short links

### Deployment (Vercel)
```bash
git add .
git commit -m "feat: description"
git push  # Auto-deploys to Vercel
```

**Post-deploy:** Update `BASE_URL` env var in Vercel dashboard to actual production URL.

## Code Conventions

### Validation (lib/validations.ts)
All input validation uses Zod schemas:

```typescript
const createLinkSchema = z.object({
  url: z.string().url('Invalid URL format'),
  code: z.string().regex(/^[A-Za-z0-9]{6,8}$/, '...').optional()
});

// In API routes
const validation = createLinkSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: validation.error.issues[0].message },
    { status: 400 }
  );
}
```

### Error Handling
- **API Routes:** Return proper HTTP status codes (400 validation, 409 duplicate, 404 not found, 500 server error)
- **Client Components:** Use try/catch with user-friendly messages
- **Database:** Handle PostgreSQL-specific errors (code 23505 for unique violations)

### Component Patterns
1. **Client components need `'use client'` directive** - Forms, buttons, state management
2. **Server components are default** - Pages that fetch data, static content
3. **Hybrid approach** - Extract interactive parts into client components (see `CopyButton.tsx`)

## Route Structure
```
app/
├── page.tsx                    # Dashboard (client) - Create/list links
├── [code]/route.ts            # Redirect handler (server) - GET /:code
├── code/[code]/page.tsx       # Stats page (server) - View link details
├── api/links/
│   ├── route.ts               # POST create, GET list all
│   └── [code]/route.ts        # GET details, DELETE link
└── healthz/route.ts           # Health check endpoint
```

## Common Pitfalls

1. **URL Construction:** Use relative paths `/${code}` for internal links, not full URLs (causes doubling: `domain.com/domain.com/code`)
2. **Redirect in Route Handlers:** Use `NextResponse.redirect(url)`, NOT `redirect()` from `next/navigation` (client-only)
3. **Environment Variables:** Server-side uses `process.env.VAR`, client-side needs `NEXT_PUBLIC_` prefix
4. **Async Params:** Always await params in Next.js 16 dynamic routes

## Testing Strategy
Manual testing checklist:
- Create link with auto-generated code
- Create link with custom code (6-8 chars)
- Duplicate code prevention (409 error)
- Redirect works and increments clicks
- Stats page displays correct data
- Delete removes link (404 on access)

## Database Schema
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Tech Stack Notes
- **Next.js 16.0.3** - App Router with Turbopack
- **React 19.2.0** - Latest features
- **TypeScript 5** - Strict mode enabled
- **Tailwind CSS 4** - Utility-first styling
- **Zod 4.1.12** - Runtime validation
- **@vercel/postgres 0.10.0** - Serverless Postgres client

## When Making Changes
1. For route handlers: Check if params need await (Next.js 16)
2. For data fetching: Use direct DB in server components, fetch() in client
3. For validation: Add/update Zod schemas in `lib/validations.ts`
4. For new features: Follow existing patterns (see similar files)
5. After changes: Test locally, then deploy via git push
