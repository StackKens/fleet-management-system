# Phase 2 — Authentication

## What We Built

A complete JWT-based authentication system with:
- User registration with password hashing
- User login with credential verification
- JWT token generation and verification
- Protected route middleware

## How It Works

### Registration Flow

```
Client sends: { name, email, password, role, phone }
    ↓
Server checks if email already exists
    ↓
Server hashes password with bcrypt (salt rounds: 10)
    ↓
Server creates user in database
    ↓
Server generates JWT token
    ↓
Server returns: { id, name, email, role, token }
```

### Login Flow

```
Client sends: { email, password }
    ↓
Server finds user by email
    ↓
Server compares password with stored hash using bcrypt
    ↓
Server updates lastLogin timestamp
    ↓
Server generates JWT token
    ↓
Server returns: { id, name, email, role, token }
```

### Protected Route Flow

```
Client sends request with header: Authorization: Bearer <token>
    ↓
Middleware extracts token from header
    ↓
Middleware verifies token using JWT secret
    ↓
If valid: attaches user info to request, calls next()
    ↓
If invalid: returns 401 Unauthorized
```

## Key Concepts

### What is bcrypt?
bcrypt is a password hashing function that:
- Automatically generates a random "salt" for each password
- Combines the salt with the password to create a hash
- Makes it impossible to reverse-engineer the original password
- Makes rainbow table attacks ineffective

### What is JWT (JSON Web Token)?
JWT is a compact way to securely transmit information between parties:
- Contains a payload (user info) that is digitally signed
- The signature prevents tampering
- The token expires after a set time (24 hours in our case)
- The client stores the token and sends it with each request

### What is Middleware?
Middleware is code that runs between the request and the controller:
- It can modify the request or response
- It can stop the request from reaching the controller
- In our case, it checks for a valid token before allowing access

## API Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Create new account | No |
| POST | /api/auth/login | Login and get token | No |
| GET | /api/auth/me | Get current user profile | Yes |

## File Structure

```
backend/src/
├── services/auth.service.js      # Password hashing, token generation
├── controllers/auth.controller.js # HTTP request handlers
├── middleware/auth.js             # Token verification middleware
└── routes/auth.routes.js          # Route definitions
```

## Testing the API

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"Staff"}'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Access protected route:
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <token-from-login>"
```

## Next Phase

Phase 3: Role-based authorization — checking what users are allowed to do.
