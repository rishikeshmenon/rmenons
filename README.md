# 🏠 Smart Home Solutions Platform

An AI-powered smart home consultancy platform built with Next.js 14, featuring intelligent product recommendations, comprehensive guides, and automated content generation.

## ✨ Features

### 🤖 AI-Powered Features
- **Smart Recommendations**: AI-powered product suggestions based on user preferences
- **Content Generation**: AI creates guides, reviews, and comparisons automatically
- **Web Integration**: Real-time content updates from web sources
- **Trending Analysis**: AI identifies and tracks industry trends
- **Personalized Learning**: AI adapts content based on user skill level

### 🛍️ E-commerce Platform
- **Product Catalog**: 19+ real smart home products with detailed specifications
- **Starter Kits**: Pre-configured Google Home and Alexa kits
- **Shopping Cart**: Full cart functionality with Stripe integration
- **Advanced Filtering**: Filter by brand, category, price, compatibility, and more

### 📚 Knowledge Base
- **AI-Generated Guides**: 8 comprehensive smart home tutorials
- **Search & Discovery**: Advanced search with AI-powered suggestions
- **Category Filtering**: Organized by skill level and topic
- **Real-time Updates**: Content updated with latest trends

### 🎛️ Admin Dashboard
- **AI Insights**: Real-time analytics and recommendations
- **Content Management**: AI-suggested content creation
- **Performance Tracking**: Conversion rates and user engagement
- **System Health**: Real-time monitoring and alerts

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: NextAuth.js with OAuth providers
- **Payments**: Stripe Checkout
- **AI**: OpenAI GPT-4 for content generation and recommendations
- **Deployment**: Vercel-ready configuration

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd home-automation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/home_automation_db"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run data:populate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run data:populate` - Populate database with sample data
- `npm run data:verify` - Verify data population

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
OPENAI_API_KEY="your-openai-api-key"
```

## 🏗️ Project Structure

```
home-automation-platform/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── catalog/           # Product catalog
│   │   ├── guides/            # AI-generated guides
│   │   ├── kits/              # Starter kits
│   │   └── consultation/      # Consultation booking
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── layout/           # Layout components
│   └── lib/                  # Utility functions
├── prisma/                   # Database schema
├── public/                   # Static assets
├── scripts/                  # Database and automation scripts
└── docs/                     # Documentation
```

## 🤖 AI Features

### Content Generation
- **Guides**: AI creates comprehensive smart home guides
- **Reviews**: AI generates detailed product reviews
- **Comparisons**: AI compares products and technologies
- **Troubleshooting**: AI provides step-by-step solutions

### Smart Recommendations
- **Product Suggestions**: AI recommends products based on user queries
- **Compatibility Analysis**: AI matches products to user preferences
- **Budget Optimization**: AI considers budget constraints
- **Ecosystem Matching**: AI matches products to preferred ecosystems

### Admin Intelligence
- **Trend Analysis**: AI identifies trending topics and technologies
- **Performance Optimization**: AI suggests platform improvements
- **Content Strategy**: AI recommends content creation based on user behavior
- **Predictive Analytics**: AI forecasts user needs and preferences

## 📊 Database Schema

The platform uses Prisma ORM with the following main models:

- **User**: User accounts and authentication
- **Product**: Smart home products with specifications
- **Category**: Product categories and hierarchy
- **Kit**: Pre-configured starter kits
- **Order**: E-commerce orders and transactions
- **Booking**: Consultation bookings
- **Proposal**: Custom home automation proposals

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the dashboard
3. Set up webhooks for order processing
4. Add keys to environment variables

### NextAuth Setup
1. Create OAuth apps for Google/Apple
2. Add client IDs and secrets to environment variables
3. Configure callback URLs

### OpenAI Setup
1. Create an OpenAI account
2. Generate an API key
3. Add key to environment variables

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for speed and user experience
- **SEO**: Fully optimized for search engines
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the AI-generated guides in the platform

## 🎯 Roadmap

- [ ] Real-time chat support
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Voice search integration
- [ ] AR product visualization

---

**Built with ❤️ using Next.js, TypeScript, and AI**