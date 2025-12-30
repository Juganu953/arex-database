# AREX Database Project - Quick Start

## Available Commands

### Database Operations
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create new migration
- `npm run prisma:deploy` - Apply migrations to production
- `npm run prisma:studio` - Open Prisma Studio (http://localhost:5555)
- `npm run db:test` - Test database relationships
- `npm run db:summary` - Show database summary
- `npm run db:seed` - Run basic seed
- `npm run db:seed-complete` - Run comprehensive seed

### Server Operations
- `npm run dev` - Start development server (http://localhost:3000)
- `npm start` - Start production server
- `npm run test-api` - Test API health check

## API Endpoints
- GET `/api/health` - Health check
- GET `/api/users` - List all users
- GET `/api/plans` - List all plans
- POST `/api/users` - Create new user (send JSON body)

## Deployment
1. Set DATABASE_URL in Vercel environment variables
2. Push to GitHub
3. Import in Vercel dashboard
4. Deploy!

## Database Schema
- User (with trial/paid tracking)
- Plan (subscription plans)
- Lead (business leads)
- Transaction (payments)
- BusinessProfile
- AgentProfile
- Session (authentication)
- Account (OAuth connections)
