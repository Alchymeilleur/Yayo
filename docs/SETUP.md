# Yayo Setup Guide

## Prerequisites

- Node.js 18+ or Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Git

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/Alchymeilleur/Yayo.git
cd Yayo

# Start all services
docker-compose up -d

# Wait for services to be ready (about 30 seconds)
sleep 30

# Verify services are running
docker-compose ps
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

Stop services:
```bash
docker-compose down
```

---

## Manual Setup (Without Docker)

### 1. Setup PostgreSQL Database

```bash
# Install PostgreSQL (on macOS)
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database and user
createuser postgres
createdb -U postgres yayo_db

# Verify
psql -U postgres -d yayo_db
```

### 2. Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=yayo_db

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Backend will be available at: http://localhost:5000

### 3. Setup Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Edit .env.local if needed
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Testing the Setup

### Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2026-06-11T15:59:00.000Z"}
```

### Test Frontend

Visit http://localhost:3000 in your browser. You should see:
- Yayo homepage with hero section
- Browse Listings link
- Sign Up button

---

## Database Migrations

The database schema is automatically initialized when the backend starts. It creates:

- `users` - User accounts
- `categories` - Listing categories (auto-seeded)
- `listings` - Property/item listings
- `listing_photos` - Photos for listings
- `messages` - User messages
- `reviews` - User reviews
- `favorites` - User favorite listings
- `reports` - Content moderation reports

View the schema: [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yayo_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_jwt_secret_key_here_change_in_production
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Yayo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL
brew services start postgresql

# Or with Docker
docker-compose up postgres -d
```

### Frontend Cannot Connect to Backend

1. Verify backend is running: http://localhost:5000/health
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure backend CORS is properly configured

---

## Development Workflow

### Running Services Separately

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

---

## Next Steps

1. **User Authentication**
   - Implement login/register endpoints
   - Complete auth controller

2. **Listing Management**
   - Implement CRUD operations
   - Add photo upload functionality

3. **Search & Filtering**
   - Implement advanced search
   - Add map integration

4. **Admin Dashboard**
   - Create admin pages
   - Implement user/listing management

5. **Deployment**
   - Set up CI/CD pipeline
   - Deploy to production (Vercel, Railway, etc.)

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment guides.
