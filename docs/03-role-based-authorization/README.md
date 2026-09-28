# Role-Based Authorization

## What We Built

A permission system that controls what users can do based on their role:
- Role-based middleware — checks if user's role is in an allowed list
- Capability-based middleware — checks if user's role has a specific capability
- Capabilities mapping — defines what each role can do

## How It Works

### Authentication vs Authorization

- **Authentication** — "Who are you?" (login, JWT token)
- **Authorization** — "What are you allowed to do?" (role/capability checks)

### Role-Based Authorization

```
User makes request with JWT token
    ↓
authenticate middleware verifies token, extracts role
    ↓
authorize middleware checks if role is in allowed list
    ↓
If allowed: request proceeds to controller
    ↓
If not allowed: returns 403 Forbidden
```

### Capability-Based Authorization

```
User makes request with JWT token
    ↓
authenticate middleware verifies token, extracts role
    ↓
requireCapability middleware checks if role has the required capability
    ↓
If allowed: request proceeds to controller
    ↓
If not allowed: returns 403 Forbidden
```

## Key Concepts

### What is a Capability?
A capability is a specific action a user can perform, like:
- `manage_vehicles` — create, edit, delete vehicles
- `approve_requests` — approve or reject vehicle requests
- `view_own_trips` — see only trips assigned to them

### Why Both Role and Capability Checks?
- **Role-based** — simple, good for route-level protection
- **Capability-based** — granular, good for fine-grained control

### The 403 Status Code
- **401 Unauthorized** — not authenticated (no token or invalid token)
- **403 Forbidden** — authenticated but not allowed (wrong role/capability)

## Roles and Capabilities

| Role | Capabilities |
|---|---|
| Admin | Full access to everything |
| Fleet Manager | Manage vehicles, drivers, requests, assignments, trips, maintenance, fuel, reports |
| Supervisor | View fleet, manage assignments, view reports |
| Driver | View own trips, update trips, submit inspections, report issues |
| Staff | Create requests, view own requests and trips |

## API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/protected | Test protected route | Yes |

## File Structure

```
backend/src/
├── config/capabilities.js    # Role-to-capability mapping
├── middleware/auth.js        # Token verification (authentication)
├── middleware/authorize.js   # Role-based authorization
└── middleware/capability.js # Capability-based authorization
```

## Usage Examples

### Protect a route by role:
```javascript
router.get('/vehicles', authenticate, authorize('Admin', 'Fleet Manager'), controller.getAll);
```

### Protect a route by capability:
```javascript
router.post('/requests', authenticate, requireCapability('create_requests'), controller.create);
```

## Next: Users and Departments API
