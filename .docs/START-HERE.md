# 🚀 TinyLink - Ready to Test!

## ✅ Current Status

Your TinyLink app is **READY** and running at: **http://localhost:3000**

### What's Working:
- ✅ Next.js dev server running
- ✅ All files created and configured
- ✅ All dependencies installed
- ✅ Frontend UI ready
- ✅ API routes configured

### What's Missing:
- ❌ Database connection (this is the ONLY thing you need!)

---

## 🎯 Next Step: Set Up Database (Choose One)

### Option 1: Vercel Postgres ⭐ (Recommended - 2 minutes)

**Why?** Free, fast, no installation needed

1. **Create Database**
   - Go to: https://vercel.com/dashboard
   - Click: **Storage** → **Create Database** → **Postgres**
   - Name it: `tinylink`
   - Click: **Create**

2. **Get Connection Strings**
   - After creation, click on your database
   - Go to: **Settings** → **General**
   - Click: **Show Secret**
   - You'll see 3 connection strings:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`

3. **Update `.env.local`**
   - Open: `C:\Users\Raj\asses\tinylink\.env.local`
   - Replace with your actual connection strings:
   ```
   POSTGRES_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
   BASE_URL=http://localhost:3000
   ```

4. **Create Table**
   - In Vercel dashboard, go to your database
   - Click: **Query** tab
   - Paste and run this SQL:
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
   - Click: **Run Query**

5. **Restart Dev Server**
   - In your terminal, press: `Ctrl + C`
   - Run: `npm run dev`
   - Open: http://localhost:3000

---

### Option 2: Neon Postgres (Also Free - 3 minutes)

1. **Sign Up**
   - Go to: https://neon.tech
   - Click: **Sign Up**

2. **Create Project**
   - Project name: `tinylink`
   - Click: **Create Project**

3. **Get Connection String**
   - Copy the connection string (looks like: `postgres://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb`)

4. **Update `.env.local`**
   ```
   POSTGRES_URL="your-neon-connection-string"
   POSTGRES_PRISMA_URL="your-neon-connection-string?pgbouncer=true"
   POSTGRES_URL_NON_POOLING="your-neon-connection-string"
   BASE_URL=http://localhost:3000
   ```

5. **Create Table**
   - In Neon dashboard, click: **SQL Editor**
   - Run the SQL from above (same as Vercel)

6. **Restart Dev Server**

---

## 🧪 Testing Your App

Once database is connected, test these features:

### 1. Dashboard (http://localhost:3000)
- Should load without errors
- You'll see a form to create links
- Empty table (initially)

### 2. Create Your First Link
- **URL:** `https://google.com`
- **Code:** Leave empty (auto-generates)
- Click: **Shorten URL**
- ✅ You should see: "Link created! Short URL: http://localhost:3000/abc123"
- Link appears in table below

### 3. Test Custom Code
- **URL:** `https://github.com`
- **Code:** `github`
- Click: **Shorten URL**
- ✅ Link created with code "github"

### 4. Test Redirect
- Copy your short URL from table (e.g., `http://localhost:3000/abc123`)
- Open in new tab
- ✅ Should redirect to original URL
- ✅ Click count should increase

### 5. Test Duplicate Prevention
- Try creating same code twice
- ✅ Should get error: "Code already exists"

### 6. Test Validation
- Invalid URL: `not-a-url` → ❌ Error
- Invalid code: `test@123` → ❌ Error  
- Short code: `ab` → ❌ Error (must be 6-8 chars)

### 7. View Stats
- Click on a code in the table (or go to `/code/abc123`)
- ✅ See click count, creation date, last clicked

### 8. Delete Link
- Click **Delete** button
- Confirm
- ✅ Link removed from table
- ✅ Visiting `/abc123` returns 404

### 9. API Health Check
- Visit: http://localhost:3000/healthz
- ✅ Should return: `{"ok": true, "version": "1.0", "timestamp": "..."}`

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `.env.local` has correct connection strings
- Restart dev server after changing `.env.local`

### "Table 'links' does not exist"
- Make sure you ran the SQL schema in your database

### "Port 3000 already in use"
```bash
# Kill existing process
npm run dev -- -p 3001
```

### Still seeing errors?
1. Check terminal for specific error messages
2. Check browser console (F12)
3. Verify `.env.local` file exists and has values

---

## 📊 API Testing (Optional)

Test with PowerShell:

```powershell
# Create a link
Invoke-RestMethod -Uri "http://localhost:3000/api/links" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"url":"https://google.com","code":"test123"}'

# Get all links
Invoke-RestMethod -Uri "http://localhost:3000/api/links"

# Get specific link
Invoke-RestMethod -Uri "http://localhost:3000/api/links/test123"

# Delete link
Invoke-RestMethod -Uri "http://localhost:3000/api/links/test123" -Method DELETE
```

---

## 🚀 After Testing Locally

Once everything works:

1. **Commit Your Code**
   ```bash
   git add .
   git commit -m "feat: complete TinyLink implementation"
   git push
   ```

2. **Deploy to Vercel**
   - Go to: https://vercel.com/new
   - Import your GitHub repo
   - Vercel auto-detects Next.js
   - If using Vercel Postgres, it will auto-connect
   - Click: **Deploy**

3. **Test Production**
   - Visit your Vercel URL
   - Test all features again

---

## 📁 Project Structure

```
tinylink/
├── app/
│   ├── page.tsx                    ← Dashboard (you're here!)
│   ├── layout.tsx                  ← Root layout
│   ├── code/[code]/page.tsx        ← Stats page
│   ├── [code]/route.ts             ← Redirect handler
│   ├── healthz/route.ts            ← Health check
│   └── api/links/
│       ├── route.ts                ← POST/GET links
│       └── [code]/route.ts         ← GET/DELETE link
├── lib/
│   ├── db.ts                       ← Database functions
│   ├── validations.ts              ← Zod schemas
│   └── utils.ts                    ← Utilities
├── components/
│   ├── Header.tsx                  ← Header
│   ├── AddLinkForm.tsx             ← Create form
│   └── LinkTable.tsx               ← Links table
├── .env.local                      ← Config (add DB here!)
└── schema.sql                      ← Database schema
```

---

## 🎉 You're Almost There!

**Next action:** Choose Option 1 or 2 above to set up your database (takes 2-3 minutes)

After that, you'll have a fully functional URL shortener! 🔗✨
