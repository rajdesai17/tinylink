# 🚀 Vercel Deployment Guide

## Environment Variables for Vercel

Add these **4 environment variables** in your Vercel project settings:

### 1. POSTGRES_URL
```
postgresql://neondb_owner:npg_v2BSwUe6YHtx@ep-calm-smoke-adbrygm6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. POSTGRES_PRISMA_URL
```
postgresql://neondb_owner:npg_v2BSwUe6YHtx@ep-calm-smoke-adbrygm6-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

### 3. POSTGRES_URL_NON_POOLING
```
postgresql://neondb_owner:npg_v2BSwUe6YHtx@ep-calm-smoke-adbrygm6.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. BASE_URL
```
https://your-project-name.vercel.app
```
**Note:** Update this with your actual Vercel URL after first deployment

---

## Step-by-Step Deployment

### Step 1: Commit Your Code

```bash
git add .
git commit -m "feat: complete TinyLink implementation with Neon DB"
git push
```

### Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `tinylink` repository
4. Click **"Import"**

### Step 3: Add Environment Variables

Before clicking Deploy:

1. Expand **"Environment Variables"** section
2. Add each variable one by one:
   - Name: `POSTGRES_URL`
   - Value: `postgresql://neondb_owner:npg_v2BSwUe6YHtx@ep-calm-smoke-adbrygm6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Environment: `Production`, `Preview`, `Development` (select all)
   - Click **"Add"**

3. Repeat for:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `BASE_URL` (use temporary value: `https://tinylink.vercel.app`)

4. Click **"Deploy"**

### Step 4: Update BASE_URL (After First Deployment)

1. After deployment completes, copy your Vercel URL (e.g., `https://tinylink-abc123.vercel.app`)
2. Go to: **Settings** → **Environment Variables**
3. Find `BASE_URL` variable
4. Click **Edit**
5. Update to your actual URL: `https://tinylink-abc123.vercel.app`
6. Click **Save**
7. Go to **Deployments** → Click **"Redeploy"** on the latest deployment

---

## Testing Production

Once deployed, test these endpoints:

### Health Check
```
https://your-app.vercel.app/healthz
```
Should return: `{"ok": true, "version": "1.0", "timestamp": "..."}`

### Dashboard
```
https://your-app.vercel.app
```
Should show the TinyLink dashboard

### Create a Link
1. Visit your dashboard
2. Enter a URL
3. Create a short link
4. Test the redirect

### API Test
```bash
curl -X POST https://your-app.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com","code":"test123"}'
```

---

## Troubleshooting

### "Cannot connect to database"
- Verify all 3 POSTGRES_* variables are set correctly
- Check for typos in connection strings
- Ensure Neon database is active

### "Table does not exist"
- The table should already exist (you ran the SQL earlier)
- If not, run the SQL schema in Neon console again

### "Environment variables not loading"
- Make sure you selected all environments (Production, Preview, Development)
- Try redeploying after adding variables

### Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update `BASE_URL` to your custom domain
4. Redeploy

---

## Production Checklist

- [ ] All 4 environment variables added
- [ ] BASE_URL updated with actual Vercel URL
- [ ] Health check works
- [ ] Can create links
- [ ] Redirects work
- [ ] Stats page loads
- [ ] Delete works
- [ ] Custom codes work
- [ ] Duplicate prevention works

---

## 🎉 You're Live!

Your TinyLink app is now deployed and accessible worldwide!

Share your links:
- Dashboard: `https://your-app.vercel.app`
- Short links: `https://your-app.vercel.app/abc123`

## Next Steps

- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)
- [ ] Add more features (QR codes, analytics, etc.)
- [ ] Share with friends!
