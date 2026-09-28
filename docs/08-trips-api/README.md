# Trips API

## What We Built

Full CRUD API for trip management:
- Create trips linked to vehicles and drivers
- Track trip status through its lifecycle
- Driver-specific trip endpoints
- Trip detail with vehicle and driver info

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/trips | List all trips | Any authenticated user |
| GET | /api/trips/driver/:driverId | Get trips for a driver | Any authenticated user |
| GET | /api/trips/:id | Get single trip | Any authenticated user |
| POST | /api/trips | Create trip | Admin, Fleet Manager, Supervisor |
| PUT | /api/trips/:id/status | Update trip status | Admin, Fleet Manager, Driver |
| DELETE | /api/trips/:id | Delete trip | Admin only |

## Trip Lifecycle

```
Scheduled → On route → Returned
     ↓
  Cancelled
```

| Status | Meaning |
|---|---|
| Scheduled | Trip planned but not started |
| On route | Driver has started the trip |
| Returned | Trip completed |
| Cancelled | Trip was cancelled |

## Business Rules

- A trip requires a vehicle and a driver
- A trip can be linked to an assignment
- Drivers can update their own trip status
- Only Admin, Fleet Manager, and Supervisor can create trips
- Only Admin can delete trips

## Request/Response Examples

### Create Trip
```
POST /api/trips
{
  "vehicleId": "veh123",
  "driverId": "usr456",
  "assignmentId": "asg789",
  "destination": "Mbale District",
  "departure": "2024-07-20 06:30",
  "expectedReturn": "2024-07-20 18:00",
  "purpose": "Vaccination campaign",
  "mileageStart": 128420
}

Response:
{
  "success": true,
  "message": "Trip created",
  "data": {
    "id": "trp123",
    "status": "Scheduled",
    "vehicle": { "registration": "UAX 482C" },
    "driver": { "name": "Robert Okello" }
  }
}
```

### Start Trip (Driver)
```
PUT /api/trips/trp123/status
{
  "status": "On route"
}
```

### Complete Trip (Driver)
```
PUT /api/trips/trp123/status
{
  "status": "Returned",
  "actualReturn": "2024-07-20 17:45",
  "mileageEnd": 129040,
  "fuelUsed": 42.5
}
```

## Query Parameters for GET /api/trips

| Param | Type | Description |
|---|---|---|
| status | string | Scheduled, On route, Returned, Cancelled |
| vehicleId | string | Filter by vehicle |
| driverId | string | Filter by driver |
| assignmentId | string | Filter by assignment |

## Trip → Vehicle Relationship

```
Trip uses one Vehicle
Trip has one Driver
Trip belongs to one Assignment (optional)
```

## Next: Maintenance API
