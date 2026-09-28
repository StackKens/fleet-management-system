# Fleet Management System — Backend (Beginner's Guide)

## What Is This?

The **backend** is the behind-the-scenes part of the Fleet Management System. If the frontend is the dashboard of a car, the backend is the engine — it stores data, enforces rules, processes requests, and serves information to the frontend.

This backend is designed to be built with **Node.js**, **Express**, and **PostgreSQL**, using **JWT for authentication** and **Zod for validation**.

---

## Table of Contents

1. [What is a Backend?](#what-is-a-backend)
2. [What is Node.js?](#what-is-nodejs)
3. [What is Express?](#what-is-express)
4. [What is PostgreSQL?](#what-is-postgresql)
5. [What is JWT?](#what-is-jwt)
6. [What is Zod?](#what-is-zod)
7. [Database Design](#database-design)
8. [API Design](#api-design)
9. [Authentication Flow](#authentication-flow)
10. [Authorization & Permissions](#authorization--permissions)
11. [Error Handling](#error-handling)
12. [Validation](#validation)
13. [Key Concepts for Beginners](#key-concepts-for-beginners)

---

## What is a Backend?

A backend is a program that runs on a **server** (a powerful computer that's always on). It:

- **Stores data** in a database
- **Processes requests** from the frontend
- **Enforces rules** (who can do what)
- **Returns data** to the frontend

### Why Do We Need a Backend?

Without a backend:
- Data is lost when the browser closes
- Anyone can access anything (no security)
- Multiple users can't share data
- No centralized business logic

With a backend:
- Data persists forever
- Access is controlled
- Everyone sees the same data
- Rules are enforced consistently

### How Frontend and Backend Talk

```
Frontend (Browser)                    Backend (Server)
     │                                      │
     │  1. POST /api/auth/login             │
     │  { email: "admin@fleet.ug",          │
     │    password: "admin123" }            │
     │ ─────────────────────────────────►   │
     │                                      │ 2. Check credentials
     │                                      │ 3. Generate JWT token
     │  4. { token: "abc123...",            │
     │      user: { name: "Admin" } }       │
     │ ◄─────────────────────────────────   │
     │                                      │
     │  5. GET /api/vehicles                │
     │  Authorization: Bearer abc123...     │
     │ ─────────────────────────────────►   │
     │                                      │ 6. Verify token
     │                                      │ 7. Check permissions
     │                                      │ 8. Query database
     │  9. { data: [...vehicles] }          │
     │ ◄─────────────────────────────────   │
```

**Why this matters**: The frontend never talks directly to the database. All communication goes through the backend API. This is called the **client-server architecture**.

---

## What is Node.js?

Node.js is a **JavaScript runtime** that lets you run JavaScript on a server (not just in a browser).

### Why Node.js?

- **Same language**: Frontend and backend both use JavaScript/TypeScript
- **Fast**: Built on Chrome's V8 engine, very fast for I/O operations
- **Huge ecosystem**: npm has packages for everything
- **Non-blocking**: Can handle many requests simultaneously

### How Node.js Works (Simplified)

```
Traditional Server (PHP, Java):
Request 1 → Wait for database → Respond
Request 2 → Wait for database → Respond  (starts after Request 1 finishes)

Node.js Server:
Request 1 → Ask database → (do other work while waiting)
Request 2 → Ask database → (do other work while waiting)
          → Database responds to 1 → Respond to 1
          → Database responds to 2 → Respond to 2
```

**Why this matters**: Node.js is great for APIs because most API work is waiting for databases. Node.js handles this efficiently.

---

## What is Express?

Express is a **web framework** for Node.js. It makes it easy to create API endpoints.

### Why Express?

- **Simple**: Minimal boilerplate
- **Flexible**: You structure your app how you want
- **Middleware**: Easy to add authentication, logging, etc.
- **Routing**: Clean way to define API endpoints

### Example Express Server

```typescript
import express from 'express';
const app = express();

// Middleware: parse JSON bodies
app.use(express.json());

// Route: GET /api/vehicles
app.get('/api/vehicles', (req, res) => {
  // Return list of vehicles
  res.json({ data: vehicles });
});

// Route: POST /api/vehicles
app.post('/api/vehicles', (req, res) => {
  // Create a new vehicle
  const newVehicle = req.body;
  // Save to database...
  res.status(201).json({ data: newVehicle });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Why this matters**: Express handles the HTTP protocol details so you can focus on your application logic.

---

## What is PostgreSQL?

PostgreSQL is a **relational database**. It stores data in **tables** with **rows** and **columns**, like Excel sheets, but much more powerful.

### Why PostgreSQL?

- **Relational**: Tables can relate to each other (e.g., a Trip belongs to a Vehicle)
- **ACID compliant**: Data is safe even if the server crashes
- **Powerful queries**: SQL can answer complex questions
- **JSON support**: Can store JSON documents when needed
- **Free and open source**

### Database Tables (Conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│                        vehicles                              │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ id (PK)  │registration│ make    │ model    │ status          │
├──────────┼──────────┼──────────┼──────────┼─────────────────┤
│ VHC-001  │ UAX 482C │ Toyota   │ Land Cruiser │ Assigned    │
│ VHC-002  │ UBH 193K │ Toyota   │ Hilux    │ Available       │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         drivers                              │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ id (PK)  │ name     │ phone    │ email    │ license_number  │
├──────────┼──────────┼──────────┼──────────┼─────────────────┤
│ DRV-001  │ Robert   │ +256...  │ robert@..│ DL-2019-445123  │
│ DRV-002  │ Moses    │ +256...  │ moses@.. │ DL-2018-889456  │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
```

### Relationships

```
vehicles.department → departments.id
drivers.assignedVehicle → vehicles.registration
trips.vehicle → vehicles.registration
trips.driver → drivers.name
requests.vehicle → vehicles.registration
requests.driver → drivers.name
```

**Why relationships matter**: They keep data consistent. If a vehicle is deleted, you can find all trips that used it. If a driver leaves, you can see which vehicles were assigned to them.

---

## What is JWT?

JWT (JSON Web Token) is a way to **prove who you are** after logging in. Think of it like a **wristband** at a concert — once you're checked in, you show the wristband instead of your ID every time.

### How JWT Works

```
1. User logs in with email + password
       ↓
2. Server verifies credentials
       ↓
3. Server creates a JWT token:
   {
     "userId": "USR-001",
     "role": "Admin",
     "exp": 1699999999
   }
       ↓
4. Server sends token to frontend
       ↓
5. Frontend stores token (localStorage)
       ↓
6. Frontend sends token with every request:
   Authorization: Bearer abc123...
       ↓
7. Server verifies token and processes request
```

### JWT Structure

A JWT has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJVU1ItMDAxIn0.abc123signature
│                      │                                          │
Header                 Payload                                    Signature
(algorithm)            (data: userId, role, expiry)               (proves it's genuine)
```

### Why JWT?

- **Stateless**: Server doesn't need to store session data
- **Scalable**: Any server can verify the token (useful for multiple servers)
- **Secure**: Tokens are signed, so they can't be tampered with
- **Self-contained**: Token contains user info, no database lookup needed

### Why Not Sessions?

Sessions store user data on the server. This works but:
- Doesn't scale across multiple servers
- Requires shared session storage (Redis)
- More complex to manage

JWT is simpler for APIs and works well with SPAs (Single Page Apps) like this React frontend.

---

## What is Zod?

Zod is a **validation library** for TypeScript. It checks that data is correct before you use it.

### Why Zod?

- **Type safety**: Validation schemas match TypeScript types
- **Clear errors**: Tells you exactly what's wrong
- **Composable**: Build complex schemas from simple ones
- **No runtime surprises**: Catches bad data before it causes problems

### Example

```typescript
import { z } from 'zod';

// Define what a valid vehicle looks like
const VehicleSchema = z.object({
  registration: z.string().min(1, 'Registration is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1990).max(2030),
  mileage: z.number().min(0),
  status: z.enum(['Available', 'Assigned', 'In service', 'Maintenance']),
});

// Validate data
const result = VehicleSchema.safeParse(request.body);

if (!result.success) {
  // Return validation errors to frontend
  return res.status(400).json({
    error: result.error.issues.map(i => i.message)
  });
}

// Data is valid, proceed...
```

**Why this matters**: Never trust user input. Always validate before saving to database.

---

## Database Design

### Entity Relationship Diagram (Conceptual)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ departments  │     │   vehicles   │     │   drivers    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────┤ department   │     │ id (PK)      │
│ name         │     │ id (PK)      │     │ name         │
│ head         │     │ registration │     │ phone        │
│ vehicleCount │     │ make         │     │ email        │
│ driverCount  │     │ model        │     │ licenseNumber│
└──────────────┘     │ status       │     │ status       │
                     │ mileage      │     │ department   │
                     │ driver       │◄────┤ assignedVehicle│
                     └──────┬───────┘     └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │    trips     │ │  fuelRecords │ │maintenance   │
       ├──────────────┤ ├──────────────┤ ├──────────────┤
       │ id (PK)      │ │ id (PK)      │ │ id (PK)      │
       │ vehicle (FK) │ │ vehicle (FK) │ │ vehicle (FK) │
       │ driver (FK)  │ │ driver (FK)  │ │ type         │
       │ destination  │ │ date         │ │ status       │
       │ status       │ │ liters       │ │ cost         │
       │ mileageStart │ │ totalCost    │ │ workshop     │
       │ mileageEnd   │ │ mileage      │ │ scheduledDate│
       └──────────────┘ └──────────────┘ └──────────────┘
```

### Why This Design?

- **Normalization**: Each entity has its own table. No duplicate data.
- **Foreign keys**: Relationships are explicit and enforced by the database.
- **Indexes**: Fast lookups on frequently queried columns (registration, status, etc.)

### Key Design Decisions

| Decision | Why |
|----------|-----|
| Separate tables for each entity | Avoids duplication, enforces consistency |
| Foreign key relationships | Database enforces referential integrity |
| Status as enum (not free text) | Prevents typos, enables fast filtering |
| Soft deletes (status field) | Keeps history, allows data recovery |
| Timestamps on all records | Audit trail, sorting, filtering |

---

## API Design

### RESTful Principles

This API follows **REST** (Representational State Transfer) principles:

| HTTP Method | Action | Example |
|-------------|--------|---------|
| `GET` | Read data | `GET /api/vehicles` — list all vehicles |
| `POST` | Create data | `POST /api/vehicles` — add a new vehicle |
| `PUT` | Update data | `PUT /api/vehicles/:id` — update a vehicle |
| `PATCH` | Partial update | `PATCH /api/vehicles/:id/status` — change status |
| `DELETE` | Delete data | `DELETE /api/vehicles/:id` — remove a vehicle |

### Why REST?

- **Standard**: Everyone understands REST
- **Predictable**: Same patterns across all endpoints
- **Cacheable**: GET requests can be cached
- **Stateless**: Each request contains all needed information

### URL Structure

```
/api/auth/login              POST   Login
/api/auth/logout             POST   Logout
/api/auth/refresh            POST   Refresh token
/api/auth/me                 GET    Current user

/api/vehicles                GET    List vehicles
/api/vehicles                POST   Create vehicle
/api/vehicles/:id            GET    Get vehicle
/api/vehicles/:id            PUT    Update vehicle
/api/vehicles/:id            DELETE Delete vehicle
/api/vehicles/:id/status     PATCH  Change status
/api/vehicles/summary        GET    Fleet summary

/api/drivers                 GET    List drivers
/api/drivers                 POST   Create driver
/api/drivers/:id             GET    Get driver
/api/drivers/:id             PUT    Update driver
/api/drivers/:id             DELETE Delete driver

/api/requests                GET    List requests
/api/requests                POST   Create request
/api/requests/:id            GET    Get request
/api/requests/:id/approve    POST   Approve request
/api/requests/:id/decline    POST   Decline request
/api/requests/:id/assign     POST   Assign vehicle + driver

/api/trips                   GET    List trips
/api/trips                   POST   Create trip
/api/trips/:id/start         POST   Start trip
/api/trips/:id/complete      POST   Complete trip

/api/maintenance             GET    List maintenance
/api/maintenance             POST   Book service
/api/maintenance/:id/status  PATCH  Update status

/api/fuel                    GET    List fuel records
/api/fuel                    POST   Add fuel record

/api/inspections             GET    List inspections
/api/inspections             POST   Submit inspection

/api/issues                  GET    List issues
/api/issues                  POST   Report issue
/api/issues/:id/status       PATCH  Update status

/api/notifications           GET    List notifications
/api/notifications/:id/read  PATCH  Mark as read

/api/users                   GET    List users
/api/users                   POST   Create user
/api/users/:id               GET    Get user
/api/users/:id               PUT    Update user
/api/users/:id               DELETE Delete user

/api/roles                   GET    List roles
/api/departments             GET    List departments
/api/departments             POST   Create department
/api/departments/:id         PUT    Update department
/api/departments/:id         DELETE Delete department

/api/reports                 GET    List reports
/api/reports                 POST   Generate report
```

### Why This Structure?

- **Nouns, not verbs**: `/api/vehicles` not `/api/getVehicles`
- **Plural nouns**: `/api/vehicles` not `/api/vehicle`
- **Nested resources**: `/api/requests/:id/approve` for actions on a specific resource
- **Consistent patterns**: Same structure across all entities

---

## Authentication Flow

### Step-by-Step

```
1. User enters email + password in login form
       ↓
2. Frontend sends POST /api/auth/login
   Body: { email: "admin@fleet.ug", password: "admin123" }
       ↓
3. Backend receives request
       ↓
4. Backend validates input (Zod)
   - Is email format valid?
   - Is password at least 6 characters?
       ↓
5. Backend queries database
   SELECT * FROM users WHERE email = 'admin@fleet.ug'
       ↓
6. Backend compares password (bcrypt.compare)
   - Stored hash: $2b$10$abc123...
   - Provided password: "admin123"
   - Match? Yes/No
       ↓
7. If match: Generate JWT token
   {
     "userId": "USR-001",
     "role": "Admin",
     "iat": 1699999999,  // issued at
     "exp": 1700086399   // expires in 24 hours
   }
       ↓
8. Backend sends response
   {
     "success": true,
     "data": {
       "token": "eyJhbG...",
       "user": { "id": "USR-001", "name": "Admin", "role": "Admin" }
     }
   }
       ↓
9. Frontend stores token in localStorage
       ↓
10. Frontend sends token with every request
    Authorization: Bearer eyJhbG...
       ↓
11. Backend middleware verifies token
    - Is signature valid?
    - Is token expired?
    - Does user still exist?
       ↓
12. If valid: Process request
    If invalid: Return 401 Unauthorized
```

### Why bcrypt for Passwords?

```
Plain password: "admin123"
       ↓
bcrypt hash (with salt): "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
       ↓
Stored in database
```

**Why not store plain passwords?**
- If database is hacked, all passwords are exposed
- bcrypt is one-way: you can't reverse it to get the original password
- Each hash is unique (due to salt), so same password = different hash

### Why JWT Over Sessions?

| Aspect | Sessions | JWT |
|--------|----------|-----|
| Server storage | Required (memory/Redis) | Not required |
| Scalability | Harder (shared storage) | Easier (any server can verify) |
| Mobile apps | Harder (cookie management) | Easier (token in header) |
| Expiry | Server-controlled | Token-controlled |
| Revocation | Easy (delete session) | Harder (token valid until expiry) |

**Why JWT for this app**: The frontend is a React SPA. JWT works naturally with SPAs and doesn't require server-side session storage.

---

## Authorization & Permissions

### What is Authorization?

**Authentication** = Who are you? (login)
**Authorization** = What can you do? (permissions)

### How It Works in This App

```
1. User logs in → gets JWT with role
       ↓
2. User makes request → backend checks role
       ↓
3. Backend checks if role has required capability
       ↓
4. If yes: Process request
   If no: Return 403 Forbidden
```

### Middleware Example

```typescript
// Middleware: Check if user has required capability
function requireCapability(capability: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Set by auth middleware
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!user.capabilities.includes(capability)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    next(); // User is authorized, proceed
  };
}

// Usage
app.get('/api/vehicles', requireCapability('view_vehicles'), getVehicles);
app.post('/api/vehicles', requireCapability('manage_vehicles'), createVehicle);
```

### Why Middleware?

- **DRY**: Write permission check once, use everywhere
- **Consistent**: All endpoints enforce permissions the same way
- **Secure**: Can't forget to check permissions on a new endpoint

### Permission Matrix

| Endpoint | Capability Required | Roles |
|----------|---------------------|-------|
| `GET /api/vehicles` | `view_vehicles` | Fleet Manager, Supervisor |
| `POST /api/vehicles` | `manage_vehicles` | Fleet Manager |
| `GET /api/requests` | `view_requests` | Fleet Manager, Supervisor |
| `POST /api/requests/:id/approve` | `approve_requests` | Fleet Manager, Supervisor |
| `GET /api/my-trips` | `view_assigned_trips` | Driver |
| `POST /api/trips/:id/start` | `update_trip_status` | Driver |
| `POST /api/requests` | `create_vehicle_request` | Staff |
| `GET /api/users` | `manage_users` | Admin |
| `POST /api/users` | `manage_users` | Admin |

---

## Error Handling

### Why Structured Errors?

Without structured errors:
```json
{ "error": "Something went wrong" }
```
- Frontend doesn't know what to show
- Users don't know what to fix
- Debugging is hard

With structured errors:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Password must be at least 6 characters" }
    ]
  }
}
```
- Frontend can show specific errors to users
- Developers can debug quickly
- API consumers know exactly what went wrong

### Error Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "perPage": 10, "total": 100 }
}

// Validation Error (400)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Required" }]
  }
}

// Authentication Error (401)
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}

// Authorization Error (403)
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action"
  }
}

// Not Found (404)
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Vehicle not found"
  }
}

// Server Error (500)
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### Why These Status Codes?

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation failed, malformed request |
| 401 | Unauthorized | Not logged in, invalid token |
| 403 | Forbidden | Logged in but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

---

## Validation

### Why Validate?

Never trust user input. Always validate before:
- Saving to database
- Using in business logic
- Returning to frontend

### Validation Layers

```
1. Frontend validation (immediate feedback)
       ↓
2. Backend validation (security boundary)
       ↓
3. Database constraints (last line of defense)
```

### Example: Creating a Vehicle

```typescript
// 1. Define schema
const CreateVehicleSchema = z.object({
  registration: z.string().min(1).max(20),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  vehicleType: z.string().min(1).max(50),
  year: z.number().int().min(1990).max(2030),
  color: z.string().max(30).optional(),
  fuelType: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']),
  mileage: z.number().min(0),
  department: z.string().min(1).max(100),
});

// 2. Validate in route handler
app.post('/api/vehicles', async (req, res) => {
  const result = CreateVehicleSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }
    });
  }
  
  // 3. Data is valid, save to database
  const vehicle = await db.vehicle.create({ data: result.data });
  res.status(201).json({ success: true, data: vehicle });
});
```

### Why Zod Over Manual Validation?

Manual validation:
```typescript
// Verbose, error-prone
if (!req.body.registration) {
  return res.status(400).json({ error: 'Registration is required' });
}
if (!req.body.make) {
  return res.status(400).json({ error: 'Make is required' });
}
// ... repeat for every field
```

Zod validation:
```typescript
// Clean, type-safe, composable
const result = VehicleSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: result.error });
}
```

---

## Key Concepts for Beginners

### 1. HTTP Methods

Think of HTTP methods as **verbs** — actions you want to perform:

| Method | Verb | Example |
|--------|------|---------|
| GET | Read | "Get me the list of vehicles" |
| POST | Create | "Create a new vehicle" |
| PUT | Replace | "Replace the entire vehicle" |
| PATCH | Modify | "Change just the status" |
| DELETE | Remove | "Delete this vehicle" |

### 2. Status Codes

Think of status codes as **mood indicators**:

| Code | Mood | Meaning |
|------|------|---------|
| 2xx | 😊 Success | Everything worked |
| 4xx | 😕 Client error | You did something wrong |
| 5xx | 😢 Server error | We did something wrong |

### 3. Middleware

Middleware is a function that runs **before** your route handler:

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

Common middleware:
- **Authentication**: Verify JWT token
- **Authorization**: Check permissions
- **Logging**: Log every request
- **Rate limiting**: Prevent abuse
- **CORS**: Allow frontend to call backend

### 4. Environment Variables

Never hardcode secrets in code. Use environment variables:

```typescript
// .env file
DATABASE_URL=postgresql://user:password@localhost:5432/fleet_db
JWT_SECRET=your-super-secret-key
PORT=3000

// In code
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
```

**Why**: Secrets in code can be leaked via version control. Environment variables keep them separate.

### 5. Database Migrations

Migrations are **version control for your database schema**:

```typescript
// migration_001_create_vehicles.ts
export async function up(db) {
  await db.createTable('vehicles', {
    id: 'serial primary key',
    registration: 'varchar(20) not null unique',
    make: 'varchar(50) not null',
    model: 'varchar(50) not null',
    status: 'varchar(20) default "Available"',
  });
}

export async function down(db) {
  await db.dropTable('vehicles');
}
```

**Why**: Migrations let you:
- Track schema changes over time
- Roll back if something goes wrong
- Set up a fresh database with one command

### 6. Async/Await

Database operations take time. Use `async/await` to handle them:

```typescript
// Without async/await (callbacks — hard to read)
db.query('SELECT * FROM vehicles', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

// With async/await (clean, readable)
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await db.query('SELECT * FROM vehicles');
    res.json({ data: vehicles });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});
```

**Why**: async/await makes asynchronous code look synchronous. Much easier to read and debug.

### 7. CORS

CORS (Cross-Origin Resource Sharing) allows your frontend (running on `localhost:5173`) to call your backend (running on `localhost:3000`):

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend
  credentials: true,                // Allow cookies
}));
```

**Why**: Browsers block cross-origin requests by default. CORS tells the browser "it's OK to talk to this backend."

---

## Summary

| Concept | What It Is | Why It Matters |
|---------|-----------|----------------|
| **Backend** | Server-side program | Stores data, enforces rules, serves API |
| **Node.js** | JavaScript runtime | Run JavaScript on server |
| **Express** | Web framework | Create API endpoints easily |
| **PostgreSQL** | Relational database | Store data with relationships |
| **JWT** | Authentication token | Prove identity without sessions |
| **Zod** | Validation library | Catch bad data before it causes problems |
| **REST** | API design pattern | Standard, predictable API structure |
| **Middleware** | Request processors | Auth, logging, validation in one place |
| **bcrypt** | Password hashing | Store passwords securely |
| **CORS** | Cross-origin policy | Allow frontend to call backend |
| **Migrations** | Schema version control | Track and deploy schema changes |
| **Environment variables** | Configuration | Keep secrets out of code |

---

**Next Steps**: Start building the backend by setting up the project structure, database schema, and authentication system.
