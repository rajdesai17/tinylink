# TinyLink - AI Coding Agent Instructions

## Project Overview
TinyLink is a production URL shortener built with Next.js 16 App Router, TypeScript, and Vercel Postgres (Neon). The app creates short codes (6-8 alphanumeric chars) that redirect to long URLs while tracking clicks.

**Live:** https://tinylink-kappa-sandy.vercel.app  
**Database:** Neon Postgres via Vercel

### Assignment Compliance
This project implements the complete TinyLink specification from `overview.md`:
- ✅ All required pages: Dashboard (`/`), Stats (`/code/:code`), Redirect (`/:code`), Health (`/healthz`)
- ✅ All required APIs: POST/GET `/api/links`, GET/DELETE `/api/links/:code` with correct status codes
- ✅ HTTP 302 redirects (not 307) for short URLs
- ✅ Click tracking with `last_clicked_at` timestamp updates
- ✅ 409 status for duplicate codes, 404 after deletion
- ✅ Custom code support with global uniqueness validation

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
- **API Routes:** Return proper HTTP status codes per spec:
  - `201` - Successful link creation
  - `400` - Validation errors (invalid URL, code format)
  - `409` - Duplicate code (required by autograding spec)
  - `404` - Link not found
  - `500` - Server errors
- **Client Components:** Use try/catch with user-friendly messages
- **Database:** Handle PostgreSQL-specific errors (code 23505 for unique violations)
- **Redirects:** Always use `302` status (temporary redirect), not 307

### Component Patterns
1. **Client components need `'use client'` directive** - Forms, buttons, state management
2. **Server components are default** - Pages that fetch data, static content
3. **Hybrid approach** - Extract interactive parts into client components (see `CopyButton.tsx`)

## Route Structure
```
app/
├── page.tsx                    # Dashboard (client) - Create/list links
├── [code]/route.ts            # Redirect handler (server) - GET /:code → 302 redirect
├── code/[code]/page.tsx       # Stats page (server) - View link details
├── api/links/
│   ├── route.ts               # POST create (409 if exists), GET list all
│   └── [code]/route.ts        # GET details, DELETE link (→ 404 on redirect)
└── healthz/route.ts           # Health check - Returns { ok: true, version: "1.0" }
```

**CRITICAL:** All routes must follow assignment spec exactly for autograding:
- `/` - Dashboard page
- `/:code` - 302 redirect or 404
- `/code/:code` - Stats page
- `/api/links` - POST (409 on duplicate), GET
- `/api/links/:code` - GET, DELETE
- `/healthz` - Returns 200 with `{ ok: true, version: "1.0" }`

## Common Pitfalls

1. **HTTP Status Codes (CRITICAL FOR AUTOGRADING):**
   - Duplicate codes MUST return `409` (not 400)
   - Redirects MUST use `302` status (not default 307)
   - Deleted links MUST return `404` on redirect attempts
   - Health endpoint MUST return `200` with exact format

2. **URL Construction:** Use relative paths `/${code}` for internal links, not full URLs (causes doubling: `domain.com/domain.com/code`)

3. **Redirect in Route Handlers:** Use `NextResponse.redirect(url, { status: 302 })`, NOT `redirect()` from `next/navigation` (client-only)

4. **Environment Variables:** Server-side uses `process.env.VAR`, client-side needs `NEXT_PUBLIC_` prefix

5. **Async Params:** Always await params in Next.js 16 dynamic routes

6. **Click Tracking:** `incrementClicks()` must update BOTH `clicks` count AND `last_clicked_at` timestamp (see `lib/db.ts`)

## Testing Strategy
**IMPORTANT:** This project will be autograded. Manual testing checklist:
- ✅ Create link with auto-generated code → Returns 201 with code
- ✅ Create link with custom code (6-8 chars) → Returns 201
- ✅ Duplicate code → Returns 409 status code (required by spec)
- ✅ Redirect `/:code` → Returns 302 (not 307), increments clicks, updates `last_clicked_at`
- ✅ Stats page `/code/:code` → Displays URL, clicks, last clicked, created date
- ✅ Delete link → Returns success
- ✅ Access deleted link `/:code` → Returns 404 (required by spec)
- ✅ Health endpoint `/healthz` → Returns 200 with `{ ok: true, version: "1.0" }`

**Autograding requirements:**
- Stable URL conventions (no deviations)
- Correct HTTP status codes (409, 302, 404)
- Health endpoint exact format

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
