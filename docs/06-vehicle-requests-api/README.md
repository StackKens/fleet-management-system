# Vehicle Requests API

## What We Built

Full CRUD API for the vehicle request workflow:
- Staff create vehicle requests
- Fleet Manager reviews and approves/declines
- Staff see only their own requests
- Request status summary for dashboards

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/requests | List requests (staff see own only) | Any authenticated user |
| GET | /api/requests/summary | Request status counts | Any authenticated user |
| GET | /api/requests/:id | Get single request | Owner or Admin/Fleet Manager |
| POST | /api/requests | Create request | Any authenticated user |
| PUT | /api/requests/:id/status | Approve/decline | Admin, Fleet Manager |
| DELETE | /api/requests/:id | Delete request | Admin only |

## Request Lifecycle

```
Pending → Approved → Completed
   ↓
Declined
```

| Status | Meaning |
|---|---|
| Pending | Awaiting review |
| Approved | Accepted, vehicle will be assigned |
| Declined | Rejected with reason |
| Completed | Trip finished |

## Business Rules

- Staff can only see and manage their own requests
- Only Admin and Fleet Manager can approve/decline
- Only Admin can delete requests
- Status changes are tracked with reviewer name and timestamp

## Request/Response Examples

### Create Request
```
POST /api/requests
{
  "destination": "Mbarara District",
  "purpose": "Vaccination campaign",
  "startDate": "2024-07-20",
  "endDate": "2024-07-25",
  "departmentId": "dep1"
}

Response:
{
  "success": true,
  "message": "Request created",
  "data": {
    "id": "req123",
    "status": "Pending",
    "destination": "Mbarara District",
    "requester": { "id": "usr1", "name": "Dr. Grace Namusoke" }
  }
}
```

### Approve Request
```
PUT /api/requests/req123/status
{
  "status": "Approved",
  "reviewReason": "Vehicle available for this period"
}

Response:
{
  "success": true,
  "message": "Request approved",
  "data": {
    "id": "req123",
    "status": "Approved",
    "reviewedBy": "Fleet Manager",
    "reviewedDate": "2024-07-18T10:30:00.000Z"
  }
}
```

## Query Parameters for GET /api/requests

| Param | Type | Description |
|---|---|---|
| status | string | Pending, Approved, Declined, Completed |
| departmentId | string | Filter by department |
| search | string | Search by destination or purpose |

## Next: Request Approval and Assignment API
