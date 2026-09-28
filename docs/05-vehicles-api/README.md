# Vehicles API

## What We Built

Full CRUD API for managing fleet vehicles:
- List vehicles with filters (status, type, department, search)
- Get single vehicle with recent trips and maintenance
- Create, update, delete vehicles
- Vehicle status summary (counts by status)

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/vehicles | List all vehicles | Any authenticated user |
| GET | /api/vehicles/summary | Vehicle status counts | Any authenticated user |
| GET | /api/vehicles/:id | Get single vehicle | Any authenticated user |
| POST | /api/vehicles | Create vehicle | Admin, Fleet Manager |
| PUT | /api/vehicles/:id | Update vehicle | Admin, Fleet Manager |
| DELETE | /api/vehicles/:id | Delete vehicle | Admin only |

## Query Parameters for GET /api/vehicles

| Param | Type | Description |
|---|---|---|
| status | string | Available, Assigned, In service, Maintenance |
| vehicleType | string | Field SUV, Pickup, Minibus, Truck, Sedan |
| departmentId | string | Filter by department |
| search | string | Search by registration, make, or model |

## Request/Response Examples

### List Vehicles
```
GET /api/vehicles?status=Available&search=Toyota

Response:
{
  "success": true,
  "data": [
    {
      "id": "veh123",
      "registration": "UAX 482C",
      "make": "Toyota",
      "model": "Land Cruiser Prado",
      "status": "Available",
      "mileage": 128420,
      "department": { "id": "dep1", "name": "Field Operations" }
    }
  ]
}
```

### Vehicle Summary
```
GET /api/vehicles/summary

Response:
{
  "success": true,
  "data": {
    "total": 42,
    "available": 18,
    "assigned": 17,
    "inService": 4,
    "maintenance": 3
  }
}
```

### Create Vehicle
```
POST /api/vehicles
{
  "registration": "UAX 482C",
  "make": "Toyota",
  "model": "Land Cruiser Prado",
  "vehicleType": "Field SUV",
  "year": 2021,
  "color": "White",
  "fuelType": "Diesel",
  "departmentId": "dep1"
}

Response:
{
  "success": true,
  "message": "Vehicle created",
  "data": { "id": "veh123", "registration": "UAX 482C", ... }
}
```

## Vehicle Statuses

| Status | Meaning |
|---|---|
| Available | Ready for assignment |
| Assigned | Currently allocated to a driver |
| In service | At workshop for service |
| Maintenance | Awaiting or undergoing repair |

## Business Rules

- Registration numbers must be unique (enforced by database)
- Only Admin and Fleet Manager can create/update vehicles
- Only Admin can delete vehicles
- Vehicle status is tracked and filterable

## Next: Vehicle Requests API
