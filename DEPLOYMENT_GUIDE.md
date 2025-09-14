# 🚀 Deployment Guide - Smart Home Platform

## Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click "New repository"** (green button)
3. **Repository name**: `smart-home-platform` (or your preferred name)
4. **Description**: `AI-powered smart home consultancy platform`
5. **Visibility**: Public (or Private if you prefer)
6. **Initialize**: Don't initialize with README (we already have one)
7. **Click "Create repository"**

## Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smart-home-platform.git

# Push the code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import from GitHub** - select your `smart-home-platform` repository
4. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: smart-home-platform
# - Directory: ./
# - Override settings? No
```

## Step 4: Configure Environment Variables

In your Vercel dashboard:

1. **Go to your project** → **Settings** → **Environment Variables**
2. **Add these variables**:

```env
# Database (use a production database)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"

# OAuth Providers (optional for now)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI (for AI features)
OPENAI_API_KEY="sk-..."

# Email (optional)
RESEND_API_KEY="re_..."
```

## Step 5: Set Up Production Database

### Option A: Supabase (Recommended)

1. **Go to [supabase.com](https://supabase.com)** and create a project
2. **Get your database URL** from Settings → Database
3. **Add to Vercel environment variables** as `DATABASE_URL`

### Option B: PlanetScale

1. **Go to [planetscale.com](https://planetscale.com)** and create a database
2. **Get your connection string** from the dashboard
3. **Add to Vercel environment variables** as `DATABASE_URL`

### Option C: Railway

1. **Go to [railway.app](https://railway.app)** and create a PostgreSQL service
2. **Get your connection string** from the service
3. **Add to Vercel environment variables** as `DATABASE_URL`

## Step 6: Deploy Database Schema

After setting up your database, you need to push the schema:

```bash
# Install Prisma globally
npm install -g prisma

# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Step 7: Populate Production Data

```bash
# Run the data population script
npm run data:populate
```

## Step 8: Configure Domain (Optional)

1. **In Vercel dashboard** → **Settings** → **Domains**
2. **Add your custom domain** (e.g., `smarthome.yourdomain.com`)
3. **Update DNS records** as instructed by Vercel
4. **Update NEXTAUTH_URL** in environment variables

## Step 9: Set Up Stripe Webhooks

1. **Go to Stripe Dashboard** → **Webhooks**
2. **Add endpoint**: `https://your-app.vercel.app/api/webhooks/stripe`
3. **Select events**: `checkout.session.completed`, `payment_intent.succeeded`
4. **Copy webhook secret** and add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 10: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://smart-home-platform.vercel.app`)
2. **Test key features**:
   - Browse products
   - View starter kits
   - Read guides
   - Test AI recommendations
   - Try the consultation form

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Check Vercel build logs

2. **Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from Vercel
   - Check if database schema is pushed

3. **Environment Variables**:
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Redeploy after adding new variables

4. **Image Loading**:
   - Check that placeholder images are in `public/` folder
   - Verify image paths in database

### Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

## 🎉 Success!

Once deployed, your AI-powered smart home platform will be live at:
`https://your-app.vercel.app`

### Features Available:
- ✅ Product catalog with 19+ products
- ✅ AI-generated guides and content
- ✅ Starter kits with detailed pages
- ✅ Smart recommendations
- ✅ Admin dashboard with AI insights
- ✅ Stripe payment integration
- ✅ Responsive design for all devices

### Next Steps:
1. **Customize branding** and colors
2. **Add real product images** (replace placeholders)
3. **Set up analytics** (Google Analytics, Plausible)
4. **Configure email notifications**
5. **Add more AI features** as needed

---

**Your smart home platform is now live and ready to serve customers! 🚀**
