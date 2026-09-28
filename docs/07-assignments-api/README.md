# Assignments API

## What We Built

Full CRUD API for vehicle-driver assignments:
- Link vehicles and drivers to approved requests
- Track assignment status (Active, Completed, Cancelled)
- View trips associated with each assignment

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/assignments | List all assignments | Any authenticated user |
| GET | /api/assignments/:id | Get single assignment | Any authenticated user |
| POST | /api/assignments | Create assignment | Admin, Fleet Manager, Supervisor |
| PUT | /api/assignments/:id | Update assignment | Admin, Fleet Manager |
| DELETE | /api/assignments/:id | Delete assignment | Admin only |

## Assignment Statuses

| Status | Meaning |
|---|---|
| Active | Vehicle currently assigned to driver |
| Completed | Assignment period ended |
| Cancelled | Assignment was cancelled before completion |

## Business Rules

- An assignment links one vehicle to one driver
- An assignment can be linked to an approved request
- An assignment can have multiple trips
- Only Admin, Fleet Manager, and Supervisor can create assignments
- Only Admin and Fleet Manager can update or delete assignments

## Request/Response Examples

### Create Assignment
```
POST /api/assignments
{
  "vehicleId": "veh123",
  "driverId": "drv456",
  "departmentId": "dep1",
  "requestId": "req789",
  "startDate": "2024-07-20",
  "endDate": "2024-07-25",
  "purpose": "Vaccination campaign"
}

Response:
{
  "success": true,
  "message": "Assignment created",
  "data": {
    "id": "asg123",
    "status": "Active",
    "vehicle": { "registration": "UAX 482C", "make": "Toyota" },
    "driver": { "name": "Robert Okello", "phone": "+256 772 445 123" }
  }
}
```

### List Assignments
```
GET /api/assignments?status=Active

Response:
{
  "success": true,
  "data": [
    {
      "id": "asg123",
      "status": "Active",
      "vehicle": { "registration": "UAX 482C" },
      "driver": { "name": "Robert Okello" },
      "department": { "name": "Field Operations" },
      "trips": [{ "id": "trp001", "status": "Scheduled" }]
    }
  ]
}
```

## Query Parameters for GET /api/assignments

| Param | Type | Description |
|---|---|---|
| status | string | Active, Completed, Cancelled |
| vehicleId | string | Filter by vehicle |
| driverId | string | Filter by driver |
| departmentId | string | Filter by department |

## Assignment → Trip Relationship

```
Assignment (vehicle + driver)
    ├── Trip 1 (Mbale District)
    ├── Trip 2 (Gulu District)
    └── Trip 3 (Jinja)
```

An assignment represents a vehicle being allocated to a driver for a period. Multiple trips can occur during that period.

## Next: Trips API
