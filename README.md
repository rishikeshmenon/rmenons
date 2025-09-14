# Smart Home Solutions Platform

A comprehensive home automation consultancy platform that helps homeowners browse smart home products, purchase starter kits, and book custom consultations for personalized Home Assistant solutions.

## Features

### 🏠 Core Functionality
- **Product Catalog**: Advanced filtering and search with compatibility checking
- **Starter Kits**: Pre-designed Google Home and Alexa compatible kits
- **Custom Consultations**: Personalized smart home design and proposal generation
- **Shopping Cart**: Full e-commerce functionality with Stripe integration
- **User Authentication**: NextAuth with OAuth and email magic links

### 🤖 AI-Powered Assistant
- **Conversational Product Discovery**: Natural language product recommendations
- **Compatibility Validation**: Real-time ecosystem compatibility checking
- **Custom Kit Simulation**: AI-driven starter kit customization
- **Home Assistant Blueprints**: Automated YAML generation for custom setups

### 🏗️ Technical Features
- **Home Assistant Integration**: Automated setup pack generation
- **PDF Proposals**: Professional proposal generation and export
- **Multi-currency Support**: CAD primary, USD optional
- **Responsive Design**: Mobile-first with modern UI/UX
- **Real-time Updates**: Live inventory and pricing

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Server Components** for performance

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma** as ORM
- **PostgreSQL** for database
- **NextAuth.js** for authentication
- **Stripe** for payments

### AI & Integrations
- **OpenAI GPT-4** for AI assistant
- **Home Assistant** integration
- **PDF Generation** with React PDF
- **Email** with Resend
- **File Storage** with S3-compatible storage

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-automation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/home_automation_platform"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # AI
   OPENAI_API_KEY="sk-..."
   
   # Email
   RESEND_API_KEY="re_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── catalog/       # Product catalog
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Stripe checkout
│   │   ├── proposals/     # Proposal system
│   │   └── ai/            # AI assistant
│   ├── catalog/           # Product catalog pages
│   ├── kits/              # Starter kits pages
│   ├── consultation/      # Consultation booking
│   └── proposals/         # Proposal viewer
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── ai-chat.tsx       # AI assistant chat
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe configuration
│   ├── pdf-generator.ts  # PDF generation
│   └── ha-generator.ts   # Home Assistant setup packs
└── prisma/               # Database schema
    └── schema.prisma     # Prisma schema
```

## Key Features Implementation

### Product Catalog
- Advanced filtering by category, price, protocol, ecosystem
- Real-time search with faceted navigation
- Compatibility badges and validation
- Responsive grid/list view

### Shopping Cart
- Persistent cart with database storage
- Real-time inventory checking
- Compatibility validation
- Stripe checkout integration

### AI Assistant
- Conversational product recommendations
- Context-aware suggestions
- Integration with product database
- Natural language processing

### Home Assistant Integration
- Automated YAML generation
- Device-specific configurations
- Room-based automations
- Pet-friendly adjustments
- Privacy-focused settings

### Proposal System
- Professional PDF generation
- Customizable templates
- One-click cart addition
- Status tracking

## Database Schema

The platform uses a comprehensive PostgreSQL schema with the following key tables:

- **users**: User accounts and roles
- **products**: Smart home products with compatibility flags
- **kits**: Pre-designed starter kits
- **carts/cart_items**: Shopping cart functionality
- **orders/order_items**: Order management
- **bookings**: Consultation scheduling
- **proposals**: Custom proposals and BOMs
- **content**: CMS content management

## API Endpoints

### Public Endpoints
- `GET /api/catalog` - Product catalog with filtering
- `GET /api/products/[id]` - Product details
- `GET /api/kits` - Starter kits listing
- `POST /api/cart/items` - Add to cart
- `POST /api/checkout/session` - Create Stripe session

### Authenticated Endpoints
- `GET /api/me/orders` - User orders
- `GET /api/me/bookings` - User bookings
- `GET /api/me/proposals` - User proposals
- `POST /api/proposals` - Create proposal

### AI Endpoints
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/intake-simulation` - Simulate consultation intake

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Set up reverse proxy (nginx/Apache)
4. Configure SSL certificates

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@smarthomesolutions.ca or create an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice interface integration
- [ ] IoT device management
- [ ] Community features
- [ ] Advanced automation templates
- [ ] Integration marketplace

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database with [Prisma](https://prisma.io/)
- Payments with [Stripe](https://stripe.com/)
- AI powered by [OpenAI](https://openai.com/)