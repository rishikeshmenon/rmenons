# Deployment Guide

This guide will help you deploy the Smart Home Solutions platform to production.

## Prerequisites

Before deploying, ensure you have:

- [ ] A PostgreSQL database (Supabase, Neon, or self-hosted)
- [ ] A Stripe account with API keys
- [ ] An OpenAI API key for AI features
- [ ] A Resend account for email functionality
- [ ] A Vercel account (recommended) or other hosting platform

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI/LLM
OPENAI_API_KEY="sk-..."

# Email
RESEND_API_KEY="re_..."

# Storage (S3 compatible)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="home-automation-platform"

# Analytics
VERCEL_ANALYTICS_ID="your-analytics-id"

# Sentry (optional)
SENTRY_DSN="https://your-sentry-dsn"
```

## Database Setup

### Option 1: Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Update your `DATABASE_URL` environment variable

### Option 2: Neon

1. Create a new database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Update your `DATABASE_URL` environment variable

### Option 3: Self-hosted PostgreSQL

1. Set up a PostgreSQL server
2. Create a database for the application
3. Update your `DATABASE_URL` environment variable

### Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhooks:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
6. Copy client ID and secret

### Apple OAuth (Optional)

1. Go to [Apple Developer Console](https://developer.apple.com)
2. Create a new app identifier
3. Configure Sign in with Apple
4. Create a service ID
5. Copy client ID and secret

## AI Setup

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Add the key to your environment variables
3. Ensure you have sufficient credits for API usage

## Email Setup

1. Create a Resend account at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Add to environment variables

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Set Environment Variables**
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add all required variables

3. **Configure Domain**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Railway

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Option 3: DigitalOcean App Platform

1. Create a new app
2. Connect your repository
3. Configure environment variables
4. Deploy

### Option 4: Self-hosted (Docker)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   # Install dependencies
   COPY package.json package-lock.json* ./
   RUN npm ci --only=production
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   # Generate Prisma client
   RUN npx prisma generate
   
   # Build the application
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   
   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next
   
   # Automatically leverage output traces to reduce image size
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         # ... other environment variables
       depends_on:
         - postgres
     
     postgres:
       image: postgres:15
       environment:
         - POSTGRES_DB=home_automation_platform
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Check that the application loads correctly
- [ ] Test user registration/login
- [ ] Verify product catalog loads
- [ ] Test cart functionality
- [ ] Check Stripe integration

### 2. Configure Monitoring

- Set up error tracking with Sentry
- Configure analytics with Vercel Analytics or Google Analytics
- Set up uptime monitoring

### 3. Set up CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 4. Database Backup

Set up regular database backups:

```bash
# Daily backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 5. SSL Certificate

Ensure SSL is properly configured:
- Vercel handles this automatically
- For self-hosted, use Let's Encrypt or your certificate provider

## Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Implement lazy loading
- Optimize image formats (WebP, AVIF)

### 2. Caching

- Configure Redis for session storage
- Implement API response caching
- Use CDN for static assets

### 3. Database Optimization

- Add proper indexes
- Monitor query performance
- Implement connection pooling

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database credentials are protected
- [ ] API keys are not exposed
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection
- [ ] CSRF protection (NextAuth)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **Authentication Issues**
   - Verify OAuth credentials
   - Check redirect URIs
   - Ensure NEXTAUTH_SECRET is set

3. **Stripe Webhook Failures**
   - Check webhook URL
   - Verify webhook secret
   - Check Stripe dashboard for errors

4. **Build Failures**
   - Check Node.js version
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Monitoring

- Check application logs
- Monitor database performance
- Track API response times
- Monitor error rates

## Scaling Considerations

### Horizontal Scaling

- Use load balancers
- Implement session storage (Redis)
- Use CDN for static assets
- Consider microservices architecture

### Database Scaling

- Implement read replicas
- Use connection pooling
- Consider database sharding
- Monitor query performance

### Caching Strategy

- Implement Redis caching
- Use CDN for static content
- Cache API responses
- Implement edge caching

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor security advisories
- [ ] Backup database weekly
- [ ] Review error logs daily
- [ ] Update SSL certificates
- [ ] Monitor performance metrics

### Updates

- Test updates in staging environment
- Use feature flags for gradual rollouts
- Implement blue-green deployments
- Have rollback plan ready

## Support

For deployment issues:

1. Check the logs first
2. Review this guide
3. Check GitHub issues
4. Contact support team

## Cost Optimization

### Vercel

- Use Edge Functions for simple operations
- Optimize bundle size
- Use Vercel Analytics for insights

### Database

- Monitor query performance
- Use connection pooling
- Consider read replicas for heavy read workloads

### AI/LLM

- Implement caching for AI responses
- Use appropriate model sizes
- Monitor API usage and costs

### Storage

- Compress images
- Use appropriate file formats
- Implement cleanup policies
