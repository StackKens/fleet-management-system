# Fuel Records API

## What We Built

Full CRUD API for fuel consumption tracking:
- Record fuel purchases with liters, cost, and mileage
- Track fuel consumption per vehicle
- Fuel summary with totals and averages
- Date range filtering

## API Endpoints

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/fuel | List all fuel records | Any authenticated user |
| GET | /api/fuel/summary | Fuel consumption summary | Any authenticated user |
| GET | /api/fuel/:id | Get single record | Any authenticated user |
| POST | /api/fuel | Create fuel record | Admin, Fleet Manager, Driver |
| PUT | /api/fuel/:id | Update fuel record | Admin, Fleet Manager |
| DELETE | /api/fuel/:id | Delete fuel record | Admin only |

## Business Rules

- Each fuel record is linked to a vehicle and a driver
- Total cost is calculated from liters × cost per liter
- Mileage is recorded to track consumption over distance
- Drivers can create fuel records for their own trips
- Only Admin and Fleet Manager can update or delete records

## Request/Response Examples

### Create Fuel Record
```
POST /api/fuel
{
  "vehicleId": "veh123",
  "driverId": "usr456",
  "date": "2024-07-18",
  "liters": 65,
  "costPerLiter": 5200,
  "totalCost": 338000,
  "mileage": 128420,
  "fuelStation": "Shell Kampala Road",
  "fuelType": "Diesel"
}

Response:
{
  "success": true,
  "message": "Fuel record created",
  "data": {
    "id": "ful123",
    "vehicle": { "registration": "UAX 482C" },
    "driver": { "name": "Robert Okello" },
    "liters": 65,
    "totalCost": 338000
  }
}
```

### Fuel Summary
```
GET /api/fuel/summary?vehicleId=veh123

Response:
{
  "success": true,
  "data": {
    "totalRecords": 10,
    "totalLiters": 650,
    "totalCost": 3380000,
    "avgCostPerLiter": 5200
  }
}
```

## Query Parameters for GET /api/fuel

| Param | Type | Description |
|---|---|---|
| vehicleId | string | Filter by vehicle |
| driverId | string | Filter by driver |
| startDate | string | Filter from date (YYYY-MM-DD) |
| endDate | string | Filter to date (YYYY-MM-DD) |

## Fuel Record Fields

| Field | Type | Description |
|---|---|---|
| vehicleId | string | Vehicle that was refueled |
| driverId | string | Driver who recorded the fuel |
| date | string | Date of refueling |
| liters | number | Amount of fuel in liters |
| costPerLiter | number | Price per liter |
| totalCost | number | Total cost (liters × costPerLiter) |
| mileage | number | Vehicle odometer reading |
| fuelStation | string | Where fuel was purchased |
| fuelType | string | Petrol, Diesel, Hybrid, Electric |

## Next: Inspections and Issues API
