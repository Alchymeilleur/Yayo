# Yayo Project Structure

## Overview

Yayo uses a monorepo structure with separate frontend and backend applications.

## Directory Structure

```
Yayo/
├── frontend/                    # Next.js React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── auth/            # Auth-related components
│   │   │   ├── listings/        # Listing components
│   │   │   ├── common/          # Common UI components
│   │   │   └── layouts/         # Layout components
│   │   ├── pages/               # Next.js pages
│   │   │   ├── auth/
│   │   │   ├── listings/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── styles/              # Global styles
│   │   ├── utils/               # Utility functions
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   └── context/             # React context
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Node.js Express application
│   ├── src/
│   │   ├── routes/              # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── listings.js
│   │   │   ├── messages.js
│   │   │   ├── reviews.js
│   │   │   └── admin.js
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Database models
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── index.js             # Entry point
│   ├── migrations/              # Database migrations
│   ├── seeds/                   # Database seeds
│   ├── tests/                   # Test files
│   ├── package.json
│   └── .env.example
│
├── database/                    # Database setup
│   ├── schema.sql               # Database schema
│   ├── migrations/
│   └── seeds/
│
├── docs/                        # Documentation
│   ├── DATABASE_SCHEMA.md
│   ├── API_ENDPOINTS.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── package.json                 # Root package.json (monorepo)
└── README.md
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios
- **Authentication**: JWT (stored in httpOnly cookies)
- **Form Handling**: React Hook Form
- **Validation**: Zod

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma or Sequelize
- **Authentication**: JWT
- **File Upload**: Multer + Cloud Storage (AWS S3 or similar)
- **Validation**: Joi or Zod
- **Testing**: Jest + Supertest

### Database
- **Primary**: PostgreSQL
- **Caching**: Redis (optional, for sessions and caching)

## Development Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alchymeilleur/Yayo.git
   cd Yayo
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Setup environment variables**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Fill in required values

4. **Setup database**
   ```bash
   cd backend
   yarn migrate
   yarn seed
   ```

5. **Run development servers**
   ```bash
   yarn dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

- **Frontend**: Vercel or Netlify
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: PostgreSQL hosted on Railway, Heroku, or AWS RDS
- **File Storage**: AWS S3 or Cloudinary
