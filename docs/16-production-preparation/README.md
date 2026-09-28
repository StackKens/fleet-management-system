# Production Preparation

## What We Built

Security, validation, seed data, and documentation:
- Rate limiting to prevent brute force attacks
- Input validation with zod schemas
- Seed script for initial data
- Updated server with security middleware

## Key Concepts

### What is Rate Limiting?
Rate limiting restricts how many requests a client can make in a time window:
- API limit: 100 requests per 15 minutes per IP
- Auth limit: 10 login attempts per 15 minutes per IP
- Prevents brute force attacks and abuse

### What is Input Validation?
Validation ensures data matches expected format before processing:
- Required fields must be present
- Data types must match (string, number, etc.)
- Values must meet constraints (min length, valid email, etc.)
- Prevents invalid data from reaching the database

### What is a Seed Script?
A script that populates the database with initial data:
- Creates departments, users, vehicles, drivers
- Runs after database migration
- Makes the app immediately usable

## Security Measures

| Measure | Purpose |
|---|---|
| Rate limiting | Prevents brute force and DoS |
| Input validation | Prevents invalid/malicious data |
| Password hashing | Never store plain text passwords |
| JWT tokens | Stateless authentication |
| CORS | Controls which origins can access API |
| Error handler | Prevents leaking server details |

## How to Run

### 1. Install dependencies
```bash
cd backend
npm install
npm install --save-dev prisma express-rate-limit
```

### 2. Set up database
```bash
# Create PostgreSQL database
createdb fleet_management

# Update .env with your database URL
```

### 3. Run migrations
```bash
npx prisma migrate dev --name init
```

### 4. Seed the database
```bash
npm run db:seed
```

### 5. Start the server
```bash
npm run dev
```

### 6. Test
```bash
npm test
```

## Default Login Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@fleet.ug | password123 |
| Fleet Manager | manager@fleet.ug | password123 |
| Supervisor | supervisor@fleet.ug | password123 |
| Driver | driver@fleet.ug | password123 |
| Staff | staff@fleet.ug | password123 |

## Files

| File | Purpose |
|---|---|
| `backend/src/middleware/security.js` | Rate limiting |
| `backend/src/middleware/validate.js` | Input validation schemas |
| `backend/prisma/seed.js` | Database seed script |
| `backend/src/server.js` | Updated with security |
