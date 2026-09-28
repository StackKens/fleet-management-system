# Fleet Management System — Backend

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up the database
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 3. Start the server
```bash
npm run dev
```

### 4. Test
```bash
npm test
```

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fleet.ug | password123 |
| Fleet Manager | manager@fleet.ug | password123 |
| Supervisor | supervisor@fleet.ug | password123 |
| Driver | driver@fleet.ug | password123 |
| Staff | staff@fleet.ug | password123 |

## Tech Stack

- Node.js + Express 6
- Prisma 6 + SQLite (file-based, no separate DB server needed)
- JWT authentication with bcrypt password hashing
- Zod input validation
- Rate limiting

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed script
├── src/
│   ├── config/            # App configuration
│   ├── controllers/       # HTTP request handlers
│   ├── middleware/        # Auth, validation, security
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic + database operations
│   └── server.js          # App entry point
├── tests/
│   └── api.test.js        # End-to-end tests
└── .env                   # Environment variables
```

## API Modules

| Module | Endpoints |
|---|---|
| Auth | POST /api/auth/register, POST /api/auth/login, GET /api/auth/me |
| Users | GET/POST/PUT/DELETE /api/users |
| Departments | GET/POST/PUT/DELETE /api/departments |
| Vehicles | GET/POST/PUT/DELETE /api/vehicles |
| Requests | GET/POST/PUT/DELETE /api/requests |
| Assignments | GET/POST/PUT/DELETE /api/assignments |
| Trips | GET/POST/PUT/DELETE /api/trips |
| Maintenance | GET/POST/PUT/DELETE /api/maintenance |
| Fuel | GET/POST/PUT/DELETE /api/fuel |
| Inspections | GET/POST/PUT/DELETE /api/inspections |
| Issues | GET/POST/PUT/DELETE /api/issues |
| Notifications | GET/POST/PUT/DELETE /api/notifications |
| Reports | GET /api/reports, GET /api/reports/:type, GET /api/reports/:type/export |
