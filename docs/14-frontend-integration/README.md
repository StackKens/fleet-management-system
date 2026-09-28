# Frontend Integration

## What We Built

Connected the React frontend to the real backend API:
- API client for HTTP requests
- Auth context updated to call real backend
- Data hooks updated to fetch from API instead of Zustand store
- Login page updated (demo accounts removed)

## How It Works

### API Client (`frontend/src/lib/api.ts`)

Single point for all HTTP requests:
- Automatically adds JWT token to Authorization header
- Handles JSON parsing
- Throws errors with server messages
- Returns consistent response format

### Auth Flow

```
User enters credentials
    ↓
Frontend calls POST /api/auth/login
    ↓
Backend verifies and returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
Token sent with every subsequent request
    ↓
Backend middleware verifies token
```

### Data Fetching

```
Component calls useVehicles()
    ↓
React Query checks cache
    ↓
If no cache: calls GET /api/vehicles
    ↓
Backend queries database
    ↓
Returns JSON response
    ↓
React Query caches and returns data
```

## Key Concepts

### What is localStorage?
Browser storage that persists across sessions. We store:
- `fleet_token` — JWT token for API authentication
- `fleet_user` — user profile data

### What is React Query?
A data-fetching library that:
- Caches API responses
- Automatically refetches when data changes
- Handles loading and error states
- Provides `useQuery` for reading and `useMutation` for writing

### API Response Format

All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Files Changed

| File | Change |
|---|---|
| `frontend/src/lib/api.ts` | New — API client |
| `frontend/src/contexts/auth-context.tsx` | Updated — calls real backend |
| `frontend/src/hooks/use-fleet-data.ts` | Updated — fetches from API |
| `frontend/src/pages/login.tsx` | Updated — removed demo accounts |

## Environment Variables

Add to `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api
```

## Next: End-to-End Testing
