# Local Testing Guide for TinyLink

## Current Status
✅ All files created
✅ Dependencies installed
✅ UI components ready
❌ Database not configured

## Quick Start (2 Options)

### Option 1: Test with Vercel Postgres (Recommended)

1. **Create a Vercel Postgres Database**
   - Go to https://vercel.com/dashboard
   - Click "Storage" → "Create Database" → "Postgres"
   - Copy the connection strings

2. **Update `.env.local`**
   ```bash
   POSTGRES_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
   BASE_URL=http://localhost:3000
   ```

3. **Create the Database Table**
   - In Vercel dashboard, go to your database
   - Click "Query" tab
   - Run the SQL from `schema.sql`:
   ```sql
   CREATE TABLE links (
     id SERIAL PRIMARY KEY,
     code VARCHAR(8) UNIQUE NOT NULL,
     url TEXT NOT NULL,
     clicks INTEGER DEFAULT 0,
     last_clicked_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE INDEX idx_code ON links(code);
   ```

4. **Start the Dev Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Go to http://localhost:3000
   - You should see the TinyLink Dashboard!

### Option 2: Test with Local PostgreSQL

1. **Install PostgreSQL**
   - Download from https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE tinylink;
   \q
   ```

3. **Run Schema**
   ```bash
   psql -U postgres -d tinylink -f schema.sql
   ```

4. **Update `.env.local`**
   ```bash
   POSTGRES_URL="postgres://postgres:password@localhost:5432/tinylink"
   POSTGRES_PRISMA_URL="postgres://postgres:password@localhost:5432/tinylink"
   POSTGRES_URL_NON_POOLING="postgres://postgres:password@localhost:5432/tinylink"
   BASE_URL=http://localhost:3000
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

## Testing Checklist

Once your dev server is running, test these features:

### ✅ Dashboard (`/`)
- [ ] Page loads without errors
- [ ] Form is visible
- [ ] "Your Links" table is visible (may be empty initially)

### ✅ Create Link
- [ ] Enter URL: `https://google.com`
- [ ] Leave code empty (should auto-generate)
- [ ] Click "Shorten URL"
- [ ] Should see success message with short code
- [ ] Link should appear in table

### ✅ Custom Code
- [ ] Enter URL: `https://github.com`
- [ ] Enter custom code: `github`
- [ ] Should create link with code "github"
- [ ] Try creating duplicate - should get error "Code already exists"

### ✅ Validation
- [ ] Try invalid URL (e.g., "not a url") - should show error
- [ ] Try code with special characters (e.g., "test@123") - should show error
- [ ] Try code too short (e.g., "ab") - should show error

### ✅ Redirect
- [ ] Click on a short code in table (e.g., `http://localhost:3000/abc123`)
- [ ] Should redirect to original URL
- [ ] Click count should increment

### ✅ Stats Page
- [ ] Click "Stats" or navigate to `/code/abc123`
- [ ] Should show link details
- [ ] Should show click count
- [ ] Should show creation date

### ✅ Delete Link
- [ ] Click "Delete" on a link
- [ ] Confirm deletion
- [ ] Link should disappear from table
- [ ] Visiting that code should return 404

### ✅ Health Check
- [ ] Visit `http://localhost:3000/healthz`
- [ ] Should return JSON: `{"ok": true, "version": "1.0", "timestamp": "..."}`

## API Testing with cURL

### Create Link
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com","code":"test123"}'
```

Expected Response (201):
```json
{
  "code": "test123",
  "url": "https://google.com"
}
```

### Get All Links
```bash
curl http://localhost:3000/api/links
```

Expected Response (200):
```json
{
  "links": [
    {
      "id": 1,
      "code": "test123",
      "url": "https://google.com",
      "clicks": 0,
      "last_clicked_at": null,
      "created_at": "2025-11-21T10:30:00Z"
    }
  ]
}
```

### Get Link Details
```bash
curl http://localhost:3000/api/links/test123
```

### Delete Link
```bash
curl -X DELETE http://localhost:3000/api/links/test123
```

## Common Issues

### Issue: "Cannot connect to database"
**Solution:** Make sure your `.env.local` has correct database credentials

### Issue: "Table 'links' does not exist"
**Solution:** Run the SQL schema in your database

### Issue: "Port 3000 already in use"
**Solution:** Kill the process or use different port: `npm run dev -- -p 3001`

### Issue: TypeScript errors
**Solution:** Run `npm install` to ensure all dependencies are installed

## Next Steps

Once everything works locally:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete TinyLink implementation"
   git push
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables (Vercel will auto-add Postgres vars)
   - Deploy!

3. **Test Production**
   - Visit your Vercel URL
   - Test all features again in production

## Files Created

- ✅ `app/page.tsx` - Dashboard
- ✅ `app/code/[code]/page.tsx` - Stats page
- ✅ `app/[code]/route.ts` - Redirect handler
- ✅ `app/api/links/route.ts` - Create/List links API
- ✅ `app/api/links/[code]/route.ts` - Get/Delete link API
- ✅ `app/healthz/route.ts` - Health check
- ✅ `lib/db.ts` - Database functions
- ✅ `lib/validations.ts` - Zod schemas
- ✅ `lib/utils.ts` - Helper functions
- ✅ `components/Header.tsx` - Header component
- ✅ `components/AddLinkForm.tsx` - Create link form
- ✅ `components/LinkTable.tsx` - Links table
- ✅ `schema.sql` - Database schema

## Need Help?

If you encounter any issues:
1. Check the terminal for error messages
2. Check browser console for frontend errors
3. Verify `.env.local` is configured correctly
4. Ensure database is running and accessible
5. Try restarting the dev server (`Ctrl+C`, then `npm run dev`)
