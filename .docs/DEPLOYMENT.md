# 🚀 Vercel Deployment Guide# 🚀 Vercel Deployment Guide



## Environment Variables for Vercel## Environment Variables for Vercel



Add these **4 environment variables** in your Vercel project settings:Add these **4 environment variables** in your Vercel project settings:



### 1. POSTGRES_URL### 1. POSTGRES_URL

```

```postgresql://username:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require

postgresql://username:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require```

```**Get from:** Neon Dashboard → Your Database → Connection Details → Pooled connection



**Get from:** Neon Dashboard → Your Database → Connection Details → Pooled connection### 2. POSTGRES_PRISMA_URL

```

### 2. POSTGRES_PRISMA_URLpostgresql://username:password@host-pooler.region.aws.neon.tech/dbname?connect_timeout=15&sslmode=require

```

```**Get from:** Neon Dashboard → Connection Details (same as POSTGRES_URL with timeout parameter)

postgresql://username:password@host-pooler.region.aws.neon.tech/dbname?connect_timeout=15&sslmode=require

```### 3. POSTGRES_URL_NON_POOLING

```

**Get from:** Neon Dashboard → Connection Details (same as POSTGRES_URL with timeout parameter)postgresql://username:password@host.region.aws.neon.tech/dbname?sslmode=require

```

### 3. POSTGRES_URL_NON_POOLING**Get from:** Neon Dashboard → Connection Details → Direct connection (non-pooled)



```### 4. BASE_URL

postgresql://username:password@host.region.aws.neon.tech/dbname?sslmode=require```

```https://your-project-name.vercel.app

```

**Get from:** Neon Dashboard → Connection Details → Direct connection (non-pooled)**Note:** Update this with your actual Vercel URL after first deployment



### 4. BASE_URL---



```## Step-by-Step Deployment

https://your-project-name.vercel.app

```### Step 1: Commit Your Code



**Note:** Update this with your actual Vercel URL after first deployment```bash

git add .

---git commit -m "feat: complete TinyLink implementation with Neon DB"

git push

## Step-by-Step Deployment```



### Step 1: Commit Your Code### Step 2: Deploy to Vercel



```bash1. Go to: https://vercel.com/new

git add .2. Click **"Import Git Repository"**

git commit -m "feat: complete TinyLink implementation with Neon DB"3. Select your `tinylink` repository

git push4. Click **"Import"**

```

### Step 3: Add Environment Variables

### Step 2: Deploy to Vercel

Before clicking Deploy:

1. Go to: <https://vercel.com/new>

2. Click **"Import Git Repository"**1. Expand **"Environment Variables"** section

3. Select your `tinylink` repository2. Add each variable one by one:

4. Click **"Import"**   - Name: `POSTGRES_URL`

   - Value: Copy from your Neon Dashboard (Pooled connection string)

### Step 3: Add Environment Variables   - Environment: `Production`, `Preview`, `Development` (select all)

   - Click **"Add"**

Before clicking Deploy:

3. Repeat for:

1. Expand **"Environment Variables"** section   - `POSTGRES_PRISMA_URL` (Pooled connection with timeout)

2. Add each variable one by one:   - `POSTGRES_URL_NON_POOLING` (Direct connection)

   - Name: `POSTGRES_URL`   - `BASE_URL` (use temporary value: `https://tinylink.vercel.app`)

   - Value: Copy from your Neon Dashboard (Pooled connection string)

   - Environment: `Production`, `Preview`, `Development` (select all)4. Click **"Deploy"**

   - Click **"Add"**

### Step 4: Update BASE_URL (After First Deployment)

3. Repeat for:

   - `POSTGRES_PRISMA_URL` (Pooled connection with timeout)1. After deployment completes, copy your Vercel URL (e.g., `https://tinylink-abc123.vercel.app`)

   - `POSTGRES_URL_NON_POOLING` (Direct connection)2. Go to: **Settings** → **Environment Variables**

   - `BASE_URL` (use temporary value: `https://tinylink.vercel.app`)3. Find `BASE_URL` variable

4. Click **Edit**

4. Click **"Deploy"**5. Update to your actual URL: `https://tinylink-abc123.vercel.app`

6. Click **Save**

### Step 4: Update BASE_URL (After First Deployment)7. Go to **Deployments** → Click **"Redeploy"** on the latest deployment



1. After deployment completes, copy your Vercel URL (e.g., `https://tinylink-abc123.vercel.app`)---

2. Go to: **Settings** → **Environment Variables**

3. Find `BASE_URL` variable## Testing Production

4. Click **Edit**

5. Update to your actual URL: `https://tinylink-abc123.vercel.app`Once deployed, test these endpoints:

6. Click **Save**

7. Go to **Deployments** → Click **"Redeploy"** on the latest deployment### Health Check

```

---https://your-app.vercel.app/healthz

```

## Testing ProductionShould return: `{"ok": true, "version": "1.0", "timestamp": "..."}`



Once deployed, test these endpoints:### Dashboard

```

### Health Checkhttps://your-app.vercel.app

```

```Should show the TinyLink dashboard

https://your-app.vercel.app/healthz

```### Create a Link

1. Visit your dashboard

Should return: `{"ok": true, "version": "1.0", "timestamp": "..."}`2. Enter a URL

3. Create a short link

### Dashboard4. Test the redirect



```### API Test

https://your-app.vercel.app```bash

```curl -X POST https://your-app.vercel.app/api/links \

  -H "Content-Type: application/json" \

Should show the TinyLink dashboard  -d '{"url":"https://google.com","code":"test123"}'

```

### Create a Link

---

1. Visit your dashboard

2. Enter a URL## Troubleshooting

3. Create a short link

4. Test the redirect### "Cannot connect to database"

- Verify all 3 POSTGRES_* variables are set correctly

### API Test- Check for typos in connection strings

- Ensure Neon database is active

```bash

curl -X POST https://your-app.vercel.app/api/links \### "Table does not exist"

  -H "Content-Type: application/json" \- The table should already exist (you ran the SQL earlier)

  -d '{"url":"https://google.com","code":"test123"}'- If not, run the SQL schema in Neon console again

```

### "Environment variables not loading"

---- Make sure you selected all environments (Production, Preview, Development)

- Try redeploying after adding variables

## Troubleshooting

### Custom Domain (Optional)

### "Cannot connect to database"1. Go to **Settings** → **Domains**

2. Add your custom domain

- Verify all 3 POSTGRES_* variables are set correctly3. Update `BASE_URL` to your custom domain

- Check for typos in connection strings4. Redeploy

- Ensure Neon database is active

---

### "Table does not exist"

## Production Checklist

- The table should already exist (you ran the SQL earlier)

- If not, run the SQL schema in Neon console again- [ ] All 4 environment variables added

- [ ] BASE_URL updated with actual Vercel URL

### "Environment variables not loading"- [ ] Health check works

- [ ] Can create links

- Make sure you selected all environments (Production, Preview, Development)- [ ] Redirects work

- Try redeploying after adding variables- [ ] Stats page loads

- [ ] Delete works

### Custom Domain (Optional)- [ ] Custom codes work

- [ ] Duplicate prevention works

1. Go to **Settings** → **Domains**

2. Add your custom domain---

3. Update `BASE_URL` to your custom domain

4. Redeploy## 🎉 You're Live!



---Your TinyLink app is now deployed and accessible worldwide!



## Production ChecklistShare your links:

- Dashboard: `https://your-app.vercel.app`

- [ ] All 4 environment variables added- Short links: `https://your-app.vercel.app/abc123`

- [ ] BASE_URL updated with actual Vercel URL

- [ ] Health check works## Next Steps

- [ ] Can create links

- [ ] Redirects work- [ ] Add custom domain (optional)

- [ ] Stats page loads- [ ] Set up analytics (optional)

- [ ] Delete works- [ ] Add more features (QR codes, analytics, etc.)

- [ ] Custom codes work- [ ] Share with friends!

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
