# Inspections and Issues API

## What We Built

Two related APIs for fleet safety:

**Inspections** — Regular vehicle safety checks
- Pre-trip, post-trip, weekly, monthly inspections
- Track pass/fail/pending results
- Record mileage and notes

**Issues** — Accidents, incidents, and vehicle problems
- Report and track issues by severity
- Status workflow: Open → In progress → Resolved
- Link to vehicle and reporting driver

## API Endpoints

### Inspections

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/inspections | List all inspections | Any authenticated user |
| GET | /api/inspections/:id | Get single inspection | Any authenticated user |
| POST | /api/inspections | Create inspection | Admin, Fleet Manager, Driver |
| PUT | /api/inspections/:id | Update inspection | Admin, Fleet Manager |
| DELETE | /api/inspections/:id | Delete inspection | Admin only |

### Issues

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/issues | List all issues | Any authenticated user |
| GET | /api/issues/:id | Get single issue | Any authenticated user |
| POST | /api/issues | Report issue | Any authenticated user |
| PUT | /api/issues/:id | Update issue | Admin, Fleet Manager |
| DELETE | /api/issues/:id | Delete issue | Admin only |

## Inspection Types

| Type | When |
|---|---|
| Pre-trip | Before starting a trip |
| Post-trip | After completing a trip |
| Weekly | Weekly safety check |
| Monthly | Monthly comprehensive check |

## Issue Severity Levels

| Severity | Meaning |
|---|---|
| Low | Minor issue, no immediate danger |
| Medium | Moderate issue, needs attention |
| High | Serious issue, vehicle may be unsafe |
| Critical | Immediate danger, vehicle must not be used |

## Issue Lifecycle

```
Open → In progress → Resolved
```

## Request/Response Examples

### Create Inspection
```
POST /api/inspections
{
  "vehicleId": "veh123",
  "type": "Pre-trip",
  "result": "Passed",
  "mileage": 128420,
  "notes": "All systems OK",
  "date": "2024-07-20",
  "submittedBy": "Robert Okello"
}
```

### Report Issue
```
POST /api/issues
{
  "vehicleId": "veh123",
  "type": "Vehicle problem",
  "severity": "High",
  "description": "Brake failure on main road",
  "location": "Kampala Road",
  "date": "2024-07-20",
  "reportedBy": "Robert Okello"
}
```

### Update Issue Status
```
PUT /api/issues/iss123
{
  "status": "In progress"
}
```

## Next: Notifications API
