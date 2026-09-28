# End-to-End Testing

## What We Built

A simple test script that verifies the complete API workflow:
- Health check
- User registration
- Login (valid and invalid credentials)
- Protected route access (with and without token)
- User profile retrieval
- Data endpoints (users, vehicles, reports)

## How to Run

```bash
# Start the backend server first
npm run dev

# In another terminal, run the tests
npm test
```

## What We Test

| Test | What It Verifies |
|---|---|
| Health Check | Server is running and responding |
| Register User | Creates account, returns JWT token |
| Login (valid) | Authenticates and returns token |
| Login (invalid) | Rejects bad credentials with 401 |
| Protected (no token) | Rejects unauthenticated requests |
| Protected (with token) | Allows authenticated requests |
| Get Profile | Returns correct user data |
| Get Users | Returns user list |
| Get Vehicles | Returns vehicle list |
| Get Summary | Returns vehicle status counts |
| Get Reports | Returns available report types |

## Key Concepts

### What is End-to-End Testing?
Testing the complete flow from start to finish:
- Not just individual functions
- But the entire user journey through the system

### Why Test Both Success and Failure?
- Success tests verify the happy path works
- Failure tests verify security (bad credentials rejected, no token rejected)

### What is a Test Script?
A program that:
- Makes HTTP requests to the API
- Checks the responses match expectations
- Reports which tests passed or failed
- Exits with error code if any test fails

## Test Results Format

```
=== Fleet Management API Tests ===

Health Check
  PASS: Server is responding
  PASS: Response has success: true

Register User
  PASS: Returns 201 Created
  PASS: Registration successful
  PASS: Returns JWT token

=== Results: 12 passed, 0 failed ===
```

## Next: Production Preparation
