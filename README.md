# WALLSCAPE BANGLADESH - Premium E-Commerce Web Application

A production-ready, modern e-commerce web application for **WALLSCAPE BANGLADESH**, a premium wallpaper and interior solutions company in Bangladesh.

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — React framework for production
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first CSS
- **TanStack Query** — Server state management
- **Framer Motion** — Animations (optional)
- **React Hook Form + Zod** — Form handling & validation
- **Lucide React** — Icon library
- **Swiper** — Touch slider

### Backend
- **Fastify** — Fast Node.js web framework
- **TypeScript** — Type safety
- **MongoDB + Mongoose** — Database & ODM
- **JWT Authentication** — Admin authentication
- **Helmet** — Security headers
- **Rate Limiting** — API protection

### Infrastructure
- **Docker** — Containerization
- **MongoDB Atlas** — Cloud database
- **Vercel** — Frontend deployment
- **Render/VPS** — Backend deployment

## Project Structure

```
wallscape-bangladesh/
├── frontend/                    # Next.js 15 application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (shop)/          # Public shop pages
│   │   │   │   ├── products/    # Product listing & detail
│   │   │   │   ├── categories/  # Category pages
│   │   │   │   ├── cart/        # Shopping cart
│   │   │   │   ├── checkout/    # Guest checkout
│   │   │   │   ├── order/       # Order success
│   │   │   │   ├── track/       # Order tracking
│   │   │   │   ├── about/       # About us
│   │   │   │   ├── contact/     # Contact form
│   │   │   │   ├── blogs/       # Blog listing & detail
│   │   │   │   ├── projects/    # Project portfolio
│   │   │   │   └── tools/       # Calculators
│   │   │   └── admin/           # Admin panel
│   │   │       ├── login/       # Admin login
│   │   │       ├── dashboard/   # Admin dashboard
│   │   │       ├── products/    # Product management
│   │   │       ├── categories/  # Category management
│   │   │       ├── orders/      # Order management
│   │   │       ├── customers/   # Customer list
│   │   │       ├── reviews/     # Review moderation
│   │   │       ├── blogs/       # Blog management
│   │   │       ├── projects/    # Project management
│   │   │       ├── gallery/     # Image gallery
│   │   │       ├── banners/     # Banner management
│   │   │       ├── pages/       # Static pages
│   │   │       ├── settings/    # Website settings
│   │   │       └── users/       # Admin user management
│   │   ├── components/          # Reusable components
│   │   │   ├── ui/              # UI primitives
│   │   │   ├── layout/          # Header, Footer, etc.
│   │   │   ├── shop/            # Shop components
│   │   │   ├── admin/           # Admin components
│   │   │   └── home/            # Homepage sections
│   │   ├── lib/                 # Utilities & API client
│   │   ├── hooks/               # Custom hooks
│   │   ├── types/               # TypeScript types
│   │   ├── providers/           # Context providers
│   │   └── styles/              # Global styles
│   └── public/                  # Static assets
│
├── backend/                     # Fastify API server
│   ├── src/
│   │   ├── config/              # App configuration
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # Auth & error handling
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── utils/               # Helper functions
│   │   ├── seed/                # Database seed script
│   │   ├── types/               # TypeScript declarations
│   │   └── server.ts            # Entry point
│   └── uploads/                 # Uploaded files
│
├── docker-compose.yml           # Docker setup
├── .env.example                 # Environment variables
└── README.md                    # This file
```

## Features

### Customer Features
- Browse products by category
- Product detail with image gallery and zoom
- Advanced search and filtering
- Shopping cart (local storage)
- Guest checkout (no account required)
- Order tracking by order number or phone
- Product reviews and ratings
- Wallpaper roll calculator
- Wall area calculator
- WhatsApp inquiry button
- Responsive mobile-first design

### Admin Features
- Secure JWT authentication
- Dashboard with key metrics
- Product CRUD management
- Category management
- Order management with status workflow
- Customer database (auto-created from orders)
- Review moderation
- Blog management
- Project portfolio management
- Image gallery with before/after
- Homepage banner management
- Static page management
- Website settings
- Notification system
- Role-based admin users

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+ (or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd wallscape-bangladesh

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Environment Variables

```bash
cp .env.example backend/.env
# Edit backend/.env with your configuration
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use MongoDB Atlas connection string in .env
```

### 4. Seed Database

```bash
cd backend
npm run seed
# Creates: admin account, categories, default settings
```

### 5. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin/login
- **Admin Credentials**: admin@wallscapebd.com / admin123

## API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| GET | `/api/products` | Get products (paginated, filterable) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/new-arrivals` | Get new arrivals |
| GET | `/api/products/best-sellers` | Get best sellers |
| GET | `/api/products/search?q=` | Search products |
| GET | `/api/products/:slug` | Get product by slug |
| GET | `/api/products/:id/related` | Get related products |
| POST | `/api/orders` | Create order (guest checkout) |
| GET | `/api/orders/track` | Track order |
| GET | `/api/reviews` | Get reviews (with filters) |
| POST | `/api/reviews` | Submit review |
| GET | `/api/blogs` | Get published blogs |
| GET | `/api/blogs/:slug` | Get blog by slug |
| GET | `/api/projects` | Get published projects |
| GET | `/api/banners` | Get active banners |
| GET | `/api/pages` | Get published pages |
| GET | `/api/pages/:slug` | Get page by slug |
| GET | `/api/settings` | Get public settings |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/upload` | Upload single image |
| POST | `/api/upload/multiple` | Upload multiple images |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |
| GET | `/api/admin/orders` | Get all orders |
| GET | `/api/admin/orders/dashboard` | Dashboard stats |
| GET | `/api/admin/orders/:id` | Get order by ID |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| PUT | `/api/admin/orders/:id/payment` | Verify payment |
| GET | `/api/admin/customers` | Get customers |
| GET | `/api/admin/notifications` | Get notifications |
| PUT | `/api/admin/notifications/:id/read` | Mark as read |

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — Your backend URL

### Backend (Render / VPS)

```bash
cd backend
npm run build
npm start
```

### Docker Deployment

```bash
docker-compose up -d
```

## Environment Variables

See `.env.example` for all available variables.

## Default Admin Account

- **Email**: admin@wallscapebd.com
- **Password**: admin123

## License

Private — All rights reserved.
