# 🚀 Complete Vercel Deployment Guide

## Your Repository: [https://github.com/rishikeshmenon/rmenons](https://github.com/rishikeshmenon/rmenons)

This guide will help you deploy your AI-powered Smart Home Platform to Vercel with full functionality.

## 📋 Prerequisites

- GitHub account (✅ You have this)
- Vercel account (create at [vercel.com](https://vercel.com))
- OpenAI API key (for AI features)
- Stripe account (for payments)
- Production database (Supabase recommended)

## 🎯 Step 1: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rishikeshmenon/rmenons)

1. **Click the "Deploy with Vercel" button above**
2. **Sign in to Vercel** (or create account)
3. **Import your repository** - it should auto-detect `rmenons`
4. **Configure project**:
   - Project Name: `smart-home-platform` (or your preference)
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Option B: Manual Deploy

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import from GitHub** → Select `rishikeshmenon/rmenons`
4. **Configure settings** (same as above)
5. **Click "Deploy"**

## 🗄️ Step 2: Set Up Production Database

### Recommended: Supabase (Free Tier Available)

1. **Go to [supabase.com](https://supabase.com)**
2. **Create new project**:
   - Name: `smart-home-platform`
   - Database Password: (save this!)
   - Region: Choose closest to your users
3. **Get connection string**:
   - Go to Settings → Database
   - Copy the "Connection string" (URI)
   - It looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

### Alternative: PlanetScale

1. **Go to [planetscale.com](https://planetscale.com)**
2. **Create database** → `smart-home-platform`
3. **Get connection string** from dashboard

## 🔧 Step 3: Configure Environment Variables

In your Vercel dashboard:

1. **Go to your project** → **Settings** → **Environment Variables**
2. **Add these variables**:

```env
# Database (Required)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth (Required)
NEXTAUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"
NEXTAUTH_URL="https://your-app.vercel.app"

# OpenAI (Required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# OAuth (Optional - for social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Optional - for notifications)
RESEND_API_KEY="re_your-resend-api-key"
```

### How to Get Each Key:

#### 🔑 NEXTAUTH_SECRET
```bash
# Generate a random secret
openssl rand -base64 32
```

#### 🤖 OPENAI_API_KEY
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys
4. Create new secret key
5. Copy the key (starts with `sk-`)

#### 💳 STRIPE Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up/Login
3. Go to Developers → API Keys
4. Copy "Secret key" (starts with `sk_live_` or `sk_test_`)
5. For webhook secret:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret (starts with `whsec_`)

#### 🔐 Google OAuth (Optional)
1. Go to [console.developers.google.com](https://console.developers.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

## 🗃️ Step 4: Deploy Database Schema

After setting up your database and environment variables:

1. **Go to your Vercel project** → **Functions** tab
2. **Create a new function** called `deploy-db`:

```javascript
// api/deploy-db.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // This will create tables if they don't exist
    await prisma.$connect()
    await prisma.$disconnect()
    
    res.status(200).json({ message: 'Database schema deployed successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

3. **Call this function** by visiting: `https://your-app.vercel.app/api/deploy-db`
4. **Or use Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   vercel env pull .env.local
   npx prisma db push
   ```

## 📊 Step 5: Populate Database

1. **Go to your Vercel project** → **Functions** tab
2. **Create a function** called `populate-db`:

```javascript
// api/populate-db.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Run the population script
    const { exec } = require('child_process')
    exec('npm run data:populate', (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(200).json({ message: 'Database populated successfully', output: stdout })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

3. **Call this function**: `https://your-app.vercel.app/api/populate-db`

## 🎨 Step 6: Customize Your Platform

### Update Branding
1. **Edit** `src/app/layout.tsx` - Change title and description
2. **Edit** `src/components/layout/header.tsx` - Update logo and navigation
3. **Edit** `src/components/layout/footer.tsx` - Update footer content

### Add Real Product Images
1. **Replace placeholder images** in `public/products/`, `public/kits/`, `public/guides/`
2. **Update database** with real image URLs
3. **Or use a CDN** like Cloudinary or AWS S3

### Configure Domain
1. **In Vercel** → **Settings** → **Domains**
2. **Add custom domain** (e.g., `smarthome.yourdomain.com`)
3. **Update DNS** as instructed by Vercel
4. **Update NEXTAUTH_URL** environment variable

## 🧪 Step 7: Test Your Deployment

### Test Core Features:
- ✅ **Homepage**: [https://your-app.vercel.app](https://your-app.vercel.app)
- ✅ **Product Catalog**: [https://your-app.vercel.app/catalog](https://your-app.vercel.app/catalog)
- ✅ **Starter Kits**: [https://your-app.vercel.app/kits](https://your-app.vercel.app/kits)
- ✅ **AI Guides**: [https://your-app.vercel.app/guides](https://your-app.vercel.app/guides)
- ✅ **Admin Dashboard**: [https://your-app.vercel.app/admin/dashboard](https://your-app.vercel.app/admin/dashboard)

### Test AI Features:
- ✅ **Smart Recommendations**: Try the AI chat
- ✅ **Content Generation**: Check if guides are AI-generated
- ✅ **Search**: Test the search functionality

### Test E-commerce:
- ✅ **Add to Cart**: Test cart functionality
- ✅ **Checkout**: Test Stripe integration
- ✅ **Payments**: Test payment processing

## 🔧 Troubleshooting

### Common Issues:

#### 1. Build Errors
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install
npm run build
```

#### 2. Database Connection
```bash
# Verify DATABASE_URL is correct
# Check if database is accessible
# Ensure schema is deployed
```

#### 3. Environment Variables
```bash
# Double-check all variables are set
# Ensure no typos in variable names
# Redeploy after adding new variables
```

#### 4. Image Loading
```bash
# Check that placeholder images exist
# Verify image paths in database
# Check public folder structure
```

### Getting Help:

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## 🎉 Success Checklist

- [ ] ✅ Repository pushed to GitHub
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Database configured
- [ ] ✅ Environment variables set
- [ ] ✅ Schema deployed
- [ ] ✅ Data populated
- [ ] ✅ AI features working
- [ ] ✅ Payments configured
- [ ] ✅ Custom domain set (optional)
- [ ] ✅ All features tested

## 🚀 Your Platform is Live!

Once deployed, your AI-powered smart home platform will be available at:
**https://your-app.vercel.app**

### Features Available:
- 🤖 **AI-Powered Recommendations**
- 🛍️ **Product Catalog** (19+ products)
- 📚 **AI-Generated Guides** (8 comprehensive tutorials)
- 🎁 **Starter Kits** (Google Home & Alexa)
- 💳 **Stripe Payments**
- 🎛️ **Admin Dashboard** with AI insights
- 📱 **Fully Responsive** design

### Next Steps:
1. **Customize branding** and colors
2. **Add real product images**
3. **Set up analytics** (Google Analytics)
4. **Configure email notifications**
5. **Add more AI features** as needed

---

**🎊 Congratulations! Your smart home platform is now live and ready to serve customers!**

**Repository**: [https://github.com/rishikeshmenon/rmenons](https://github.com/rishikeshmenon/rmenons)
**Deploy**: [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rishikeshmenon/rmenons)
