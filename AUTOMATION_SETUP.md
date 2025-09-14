# Smart Home Platform Automation Setup

This document explains how to set up and configure the automated data collection and update system for the Smart Home Solutions platform.

## 🚀 Quick Start

### 1. Database Setup

First, set up your PostgreSQL database:

```bash
# Option 1: Using Docker
docker run --name postgres-smarthome \
  -e POSTGRES_DB=home_automation_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Option 2: Using Supabase (Recommended for production)
# 1. Go to https://supabase.com
# 2. Create a new project
# 3. Copy the connection string
# 4. Update your .env.local file
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/home_automation_platform"

# Admin API Key (for automation)
ADMIN_API_KEY="your-secure-admin-api-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI/LLM
OPENAI_API_KEY="sk-..."

# Email
RESEND_API_KEY="re_..."

# Storage
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="home-automation-platform"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Populate with real data
npm run data:populate
```

## 🤖 Automation Features

### Data Collection Systems

#### 1. Product Data Scraper (`src/lib/data-scraper.ts`)
- **Purpose**: Collects product information from multiple sources
- **Sources**: Philips Hue, LIFX, Lutron, Aqara, Google Nest, Amazon Echo, etc.
- **Frequency**: Daily
- **Data Collected**: Product details, pricing, availability, specifications

#### 2. Price Monitor (`src/lib/price-monitor.ts`)
- **Purpose**: Tracks and updates product prices
- **Sources**: Amazon, Best Buy, Home Depot, manufacturer stores
- **Frequency**: Every 6 hours
- **Data Collected**: Current prices, stock levels, availability

#### 3. Web Scraper (`src/lib/web-scraper.ts`)
- **Purpose**: Real-time data collection from e-commerce sites
- **Sources**: Major retailers and manufacturer websites
- **Frequency**: Every 2 hours
- **Data Collected**: Live pricing, stock status, new products

### Automation Scripts

#### Available Commands

```bash
# Populate database with real product data
npm run data:populate

# Run full automated update (all systems)
npm run data:update

# Update only product data
npm run data:scrape

# Update only prices
npm run prices:update

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open database studio
npm run db:studio
```

#### Automated Update Process

The `scripts/automated-update.ts` script runs a comprehensive update process:

1. **Category Updates**: Ensures all product categories are current
2. **Product Updates**: Updates existing product information
3. **Price Updates**: Refreshes pricing from multiple sources
4. **Stock Monitoring**: Checks and updates inventory levels
5. **New Product Discovery**: Searches for new products to add
6. **Web Scraping**: Collects real-time data from retailers
7. **Availability Updates**: Updates product availability status
8. **Analytics Generation**: Creates performance reports

## 📊 Monitoring & Analytics

### Admin Dashboard

Access the admin dashboard at `/admin/dashboard` to monitor:

- **System Health**: Database status, API health, uptime
- **Product Statistics**: Total products, categories, orders
- **Update Logs**: Recent automation activities
- **Error Tracking**: Failed operations and issues
- **Performance Metrics**: Update duration, success rates

### Health Check Endpoint

Monitor system health via API:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "stats": {
    "products": 150,
    "categories": 25,
    "orders": 45
  },
  "uptime": 86400,
  "version": "1.0.0"
}
```

## 🔄 Scheduled Automation

### GitHub Actions Workflow

The platform includes a GitHub Actions workflow (`.github/workflows/update-data.yml`) that:

- **Runs Daily**: Updates data every day at 2 AM UTC
- **Manual Trigger**: Can be triggered manually via GitHub UI
- **Change Detection**: Only commits changes when data is updated
- **Error Handling**: Notifies on failures
- **Health Checks**: Verifies system health after updates

### Cron Jobs (Self-hosted)

For self-hosted deployments, set up cron jobs:

```bash
# Edit crontab
crontab -e

# Add these entries:
# Daily data update at 2 AM
0 2 * * * cd /path/to/project && npm run data:update

# Price updates every 6 hours
0 */6 * * * cd /path/to/project && npm run prices:update

# Health check every hour
0 * * * * curl -f https://your-domain.com/api/health || echo "Health check failed"
```

## 🛠️ Configuration

### Data Sources Configuration

Edit `src/lib/data-scraper.ts` to add new data sources:

```typescript
const sources = [
  'philips-hue',
  'lifx',
  'lutron',
  'aqara',
  'google-nest',
  'amazon-echo',
  'samsung-smartthings',
  'wyze',
  'ring',
  'ecobee',
  'your-new-source' // Add new sources here
]
```

### Price Monitoring Sources

Configure price sources in `src/lib/price-monitor.ts`:

```typescript
private priceSources = [
  'amazon-ca',
  'amazon-us',
  'best-buy-ca',
  'home-depot-ca',
  'lowes-ca',
  'philips-hue-store',
  'lifx-store',
  'lutron-store',
  'your-new-source' // Add new price sources
]
```

### Web Scraping Configuration

Add new scraping targets in `src/lib/web-scraper.ts`:

```typescript
private sources = {
  'your-new-source': {
    baseUrl: 'https://your-source.com',
    searchPath: '/search?q=',
    selectors: {
      title: '.product-title',
      price: '.price',
      image: '.product-image img',
      availability: '.stock-status'
    }
  }
}
```

## 🔒 Security

### API Security

- **Admin API Key**: Required for all admin endpoints
- **Rate Limiting**: Prevents abuse of update endpoints
- **Authentication**: NextAuth integration for user management
- **Input Validation**: All inputs are validated and sanitized

### Data Privacy

- **No Personal Data**: Only product information is collected
- **Respectful Scraping**: Implements rate limiting and robots.txt compliance
- **Secure Storage**: All data encrypted in transit and at rest
- **Access Control**: Role-based access to admin functions

## 📈 Performance Optimization

### Caching Strategy

- **Database Queries**: Optimized with proper indexing
- **API Responses**: Cached for frequently accessed data
- **Static Assets**: CDN delivery for images and files
- **Rate Limiting**: Prevents system overload

### Monitoring

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Metrics**: Real-time performance monitoring
- **Uptime Monitoring**: External uptime monitoring services
- **Log Analysis**: Comprehensive logging for debugging

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database status
docker ps | grep postgres

# Restart database
docker restart postgres-smarthome

# Check connection string
echo $DATABASE_URL
```

#### Prisma Client Errors
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database
npx prisma db push --force-reset
```

#### Automation Failures
```bash
# Check logs
npm run data:update

# Manual data population
npm run data:populate

# Check API endpoints
curl -H "x-api-key: your-key" https://your-domain.com/api/admin/update-data
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
export DEBUG=prisma:*

# Run with debug output
npm run data:update
```

## 📚 API Reference

### Admin Endpoints

#### Update Data
```bash
POST /api/admin/update-data
Headers: x-api-key: your-admin-key
Body: { "updateType": "full" }
```

#### Update Prices
```bash
POST /api/admin/update-prices
Headers: x-api-key: your-admin-key
Body: { "updateType": "prices" }
```

#### Health Check
```bash
GET /api/health
```

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": { ... }
}
```

## 🎯 Best Practices

### Data Quality

1. **Regular Validation**: Validate data before storing
2. **Duplicate Detection**: Prevent duplicate products
3. **Price Accuracy**: Cross-reference prices from multiple sources
4. **Image Quality**: Ensure product images are high quality
5. **Description Accuracy**: Keep product descriptions current

### Performance

1. **Batch Operations**: Process multiple items together
2. **Rate Limiting**: Respect source website limits
3. **Error Handling**: Graceful failure handling
4. **Monitoring**: Track performance metrics
5. **Optimization**: Regular performance reviews

### Maintenance

1. **Regular Updates**: Keep dependencies current
2. **Data Cleanup**: Remove outdated information
3. **Security Patches**: Apply security updates promptly
4. **Backup Strategy**: Regular database backups
5. **Documentation**: Keep documentation current

## 📞 Support

For issues or questions:

1. **Check Logs**: Review application and error logs
2. **Documentation**: Consult this guide and README
3. **GitHub Issues**: Create an issue on the repository
4. **Email Support**: contact@smarthomesolutions.ca

## 🔄 Updates

The automation system is designed to be self-updating, but manual updates may be required for:

- New data source integrations
- Schema changes
- Security updates
- Performance optimizations

Regular maintenance ensures the platform stays current and performs optimally.
