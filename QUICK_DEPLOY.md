# ⚡ Quick Deploy - Smart Home Platform

## 🚀 One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rishikeshmenon/rmenons)

## 📋 Quick Setup Checklist

### 1. Deploy to Vercel (2 minutes)
- Click the "Deploy with Vercel" button above
- Sign in to Vercel
- Project will auto-deploy

### 2. Set Up Database (5 minutes)
- Go to [supabase.com](https://supabase.com) → Create project
- Copy database URL
- Add to Vercel environment variables as `DATABASE_URL`

### 3. Add Required Environment Variables (3 minutes)
In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"
OPENAI_API_KEY="sk-your-openai-api-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

### 4. Deploy Database Schema (1 minute)
Visit: `https://your-app.vercel.app/api/deploy-db`

### 5. Populate Database (1 minute)
Visit: `https://your-app.vercel.app/api/populate-db`

## ✅ Done! Your platform is live!

**Total time: ~12 minutes**

## 🎯 What You Get

- ✅ **AI-Powered Platform** with smart recommendations
- ✅ **19+ Smart Home Products** with detailed specs
- ✅ **8 AI-Generated Guides** for learning
- ✅ **Starter Kits** (Google Home & Alexa)
- ✅ **Stripe Payments** for e-commerce
- ✅ **Admin Dashboard** with AI insights
- ✅ **Fully Responsive** design

## 🔗 Your Repository

**GitHub**: [https://github.com/rishikeshmenon/rmenons](https://github.com/rishikeshmenon/rmenons)

## 📖 Detailed Instructions

For complete setup instructions, see: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

**🎉 Ready to deploy? Click the Vercel button above!**
