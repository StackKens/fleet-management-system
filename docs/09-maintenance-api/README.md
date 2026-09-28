# Maintenance API

## What We Built

Full CRUD API for vehicle maintenance:
- Create maintenance records for vehicles
- Track status through service lifecycle
- Record costs, parts replaced, and workshop info
- Maintenance summary with total costs

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/maintenance | List all records | Any authenticated user |
| GET | /api/maintenance/summary | Status and cost summary | Any authenticated user |
| GET | /api/maintenance/:id | Get single record | Any authenticated user |
| POST | /api/maintenance | Create record | Admin, Fleet Manager |
| PUT | /api/maintenance/:id | Update record | Admin, Fleet Manager |
| DELETE | /api/maintenance/:id | Delete record | Admin only |

## Maintenance Lifecycle

```
Scheduled → In progress → Completed
     ↓
  Cancelled
```

| Status | Meaning |
|---|---|
| Scheduled | Booked for future service |
| In progress | Vehicle currently at workshop |
| Completed | Service finished, cost recorded |
| Cancelled | Service was cancelled |

## Maintenance Types

| Type | Description |
|---|---|
| Routine service | Regular scheduled service (oil, filters, etc.) |
| Repair | Fixing a specific problem |
| Inspection | Safety or compliance check |
| Emergency | Urgent unplanned repair |

## Business Rules

- Each maintenance record is linked to one vehicle
- Cost and parts are recorded when service is completed
- Only Admin and Fleet Manager can create/update records
- Only Admin can delete records
- Summary endpoint provides fleet-wide cost overview

## Request/Response Examples

### Create Maintenance Record
```
POST /api/maintenance
{
  "vehicleId": "veh123",
  "type": "Routine service",
  "description": "Full service at 156,000 km interval",
  "scheduledDate": "2024-07-22",
  "workshop": "Kampala Central Garage",
  "mileageAtService": 156210
}

Response:
{
  "success": true,
  "message": "Maintenance record created",
  "data": {
    "id": "mnt123",
    "status": "Scheduled",
    "vehicle": { "registration": "UAT 706P" }
  }
}
```

### Complete Maintenance (record cost and parts)
```
PUT /api/maintenance/mnt123
{
  "status": "Completed",
  "completedDate": "2024-07-25",
  "cost": 485000,
  "partsReplaced": ["Engine oil", "Oil filter", "Air filter", "Brake pads"]
}
```

### Maintenance Summary
```
GET /api/maintenance/summary

Response:
{
  "success": true,
  "data": {
    "total": 8,
    "scheduled": 2,
    "inProgress": 1,
    "completed": 5,
    "totalCost": 985000
  }
}
```

## Query Parameters for GET /api/maintenance

| Param | Type | Description |
|---|---|---|
| status | string | Scheduled, In progress, Completed, Cancelled |
| vehicleId | string | Filter by vehicle |
| type | string | Routine service, Repair, Inspection, Emergency |

## Next: Fuel Records API
