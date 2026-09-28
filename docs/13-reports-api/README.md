# Reports API

## What We Built

Functional reporting system with real data aggregation:
- 8 report types with actual database queries
- View reports as JSON (for display in UI)
- Export reports as CSV (for download)
- Date range filtering on applicable reports

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/reports | List available report types | Any authenticated user |
| GET | /api/reports/:type | View report data (JSON) | Admin, Fleet Manager, Supervisor |
| GET | /api/reports/:type/export | Export report as CSV | Admin, Fleet Manager, Supervisor |

## Report Types

| Type | Description | Exportable |
|---|---|---|
| vehicle-utilization | Trips, distance, fuel per vehicle | Yes |
| fuel-consumption | Liters, cost, avg cost per liter per vehicle | Yes |
| maintenance-costs | Cost per vehicle, breakdown by type | Yes |
| trip-summary | All trips with vehicle, driver, status | Yes |
| driver-activity | Trips and distance per driver | Yes |
| fleet-status | Current fleet overview (counts) | No |
| expense-summary | Expenses by category | Yes |
| request-summary | Requests by status with details | Yes |

## How It Works

### View Report (JSON)
```
GET /api/reports/vehicle-utilization?startDate=2024-07-01&endDate=2024-07-31

Response:
{
  "success": true,
  "data": [
    {
      "vehicle": "Toyota Land Cruiser Prado (UAX 482C)",
      "totalTrips": 5,
      "totalDistance": 1200,
      "totalFuel": 350.5
    }
  ]
}
```

### Export Report (CSV)
```
GET /api/reports/fuel-consumption/export

Response: CSV file download
Vehicle,Total Liters,Total Cost,Avg Cost/L
Toyota Land Cruiser Prado (UAX 482C),650,3380000,5200
```

## Query Parameters

| Param | Type | Description |
|---|---|---|
| startDate | string | Filter from date (YYYY-MM-DD) |
| endDate | string | Filter to date (YYYY-MM-DD) |
| status | string | Filter by status (trip-summary only) |

## Business Rules

- Only Admin, Fleet Manager, and Supervisor can view/export reports
- Reports aggregate real data from the database
- CSV export includes proper headers and escaping
- Fleet status report is a snapshot (no date filtering)

## Next: Frontend Integration
