# Fleet Management System — Backend

## Phase 1: Database Setup (Complete)

### What was created:

| File | Purpose |
|---|---|
| `src/models/schema.prisma` | Database schema — 15 tables with relationships |
| `src/config/index.js` | Loads environment variables |
| `src/middleware/errorHandler.js` | Consistent JSON error responses |
| `src/server.js` | Express server with CORS, JSON parsing, logging |
| `.env` | Environment variables (database URL, JWT secret, port) |
| `.env.example` | Template for environment variables |

### Database Tables:

1. **departments** — Organizational units
2. **users** — System users with roles and authentication
3. **vehicles** — Fleet vehicles with registration and status
4. **drivers** — Driver profiles with license info
5. **vehicle_requests** — Staff vehicle requests
6. **assignments** — Vehicle-driver pairings
7. **trips** — Vehicle trips with mileage and fuel
8. **maintenance_records** — Service and repair history
9. **fuel_records** — Fuel consumption tracking
10. **expenses** — General fleet expenses
11. **inspections** — Vehicle inspections
12. **issues** — Accidents, incidents, problems
13. **notifications** — User notifications
14. **activity_logs** — Audit trail

### To complete the database setup:

1. **Install PostgreSQL** (if not already installed)
2. **Create a database:**
   ```sql
   CREATE DATABASE fleet_management;
   ```
3. **Update `.env`** with your PostgreSQL credentials
4. **Install Prisma CLI:**
   ```bash
   npm install --save-dev prisma
   ```
5. **Run the migration:**
   ```bash
   npx prisma migrate dev --name init
   ```
6. **Generate the Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Next Phases:

- Phase 2: Authentication (register, login, JWT)
- Phase 3: Role-based authorization
- Phase 4: Users + Departments API
- Phase 5: Vehicles API
- Phase 6: Vehicle Requests API
- Phase 7-19: Remaining modules
- Phase 20: Frontend integration
