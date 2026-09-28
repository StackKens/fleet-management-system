# Users and Departments API

## What We Built

Full CRUD API for managing users and departments:
- Users: list, get, update, delete with role-based access
- Departments: list, get, create, update, delete (Admin only)

## API Endpoints

### Users

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/users | List all users (with filters) | Admin, Fleet Manager, Supervisor |
| GET | /api/users/:id | Get single user | Any authenticated user |
| PUT | /api/users/:id | Update user | Admin, Fleet Manager |
| DELETE | /api/users/:id | Delete user | Admin only |

### Departments

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/departments | List all departments | Any authenticated user |
| GET | /api/departments/:id | Get single department | Any authenticated user |
| POST | /api/departments | Create department | Admin only |
| PUT | /api/departments/:id | Update department | Admin only |
| DELETE | /api/departments/:id | Delete department | Admin only |

## Query Parameters for GET /api/users

| Param | Type | Description |
|---|---|---|
| role | string | Filter by role (Admin, Fleet Manager, Driver, Staff, Supervisor) |
| status | string | Filter by status (Active, Inactive) |
| departmentId | string | Filter by department |
| search | string | Search by name or email |

## Request/Response Examples

### List Users
```
GET /api/users?role=Driver&status=Active

Response:
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "Robert Okello",
      "email": "robert.okello@fleet.ug",
      "role": "Driver",
      "status": "Active",
      "department": { "id": "dep1", "name": "Field Operations" }
    }
  ]
}
```

### Create Department
```
POST /api/departments
{
  "name": "Logistics",
  "head": "Michael Ssenyonga"
}

Response:
{
  "success": true,
  "message": "Department created",
  "data": { "id": "dep123", "name": "Logistics", "head": "Michael Ssenyonga" }
}
```

## File Structure

```
backend/src/
├── services/user.service.js        # User database operations
├── services/department.service.js  # Department database operations
├── controllers/user.controller.js  # User HTTP handlers
├── controllers/department.controller.js # Department HTTP handlers
├── routes/user.routes.js           # User route definitions
└── routes/department.routes.js    # Department route definitions
```

## Key Concepts

### Service Layer
Services contain all database logic. They:
- Receive plain data from controllers
- Query the database using Prisma
- Return clean data (no HTTP concerns)

### Controller Layer
Controllers handle HTTP logic. They:
- Extract data from requests (body, params, query)
- Call the appropriate service function
- Send the HTTP response

### Route Layer
Routes define URLs. They:
- Map HTTP methods + paths to controllers
- Apply middleware (authentication, authorization)
- Keep the API structure clean and organized

## Next: Vehicles API
