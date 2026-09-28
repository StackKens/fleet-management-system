# Process 04 — State and Data

## Goal

Learn the difference between temporary interface state and data that belongs to the backend.

## Three categories of state

### 1. Local UI state

This is temporary information used by one component.

Current examples:

- `FleetShell` mobile menu open/closed state
- `FleetShell` notification panel open/closed state
- Dashboard refresh time
- Toast state inside the toast hook

Local state is appropriate when the information is not needed elsewhere.

### 2. Server state

This is information owned by the backend, such as:

- Vehicles
- Drivers
- Vehicle requests
- Assignments
- Trips
- Maintenance records
- Fuel records

Server state can change because another user, a background process, or an API request may update it.

### 3. Shared client state

This is information shared across several parts of the frontend but not owned by the backend. Possible future examples include:

- The signed-in user
- The user's permissions
- A selected organization
- A shared filter

We will not add a global state library until we have a real requirement for shared client state.

## Current state-management libraries

### React `useState`

Used for local UI state. This is the correct tool for the current examples.

### TanStack React Query

Installed and provided in `App.tsx`, but not yet used with real queries.

React Query will manage server state when the frontend begins calling the backend.

### Redux and Zustand

Not currently used. We will not add them just to make the project appear more advanced.

## Current data flow

The dashboard currently behaves like this:

```text
Dashboard component
        ↓
imports from mock-data.ts
        ↓
maps arrays into tables and panels
        ↓
renders temporary sample information
```

The data is not fetched over HTTP and is not stored in a database.

## Mock data is useful

Mock data allows us to design and discuss realistic screens before the backend exists.

For example, a request can have a status:

```text
Pending
Approved
Declined
```

A trip can have a status:

```text
Scheduled
On route
Returned
```

These values help us understand the business workflow before we create database tables.

## Mock data is not real data

Mock data has important limitations:

- It disappears when the page reloads
- Different users cannot see changes made by each other
- There are no real validation rules
- There is no history
- There is no audit trail
- There is no concurrency protection
- It cannot support real reporting

We will keep mock data during the frontend learning phase, but we will keep it in a clearly separate data module so it can later be replaced.

## Future data flow

The eventual flow will be:

```text
Dashboard
   ↓
React Query hook
   ↓
API client
   ↓
HTTP GET request
   ↓
Express API route
   ↓
Business logic
   ↓
Database
   ↓
JSON response
   ↓
React Query cache
   ↓
Dashboard re-renders
```

The frontend will not connect directly to PostgreSQL. The backend will own database access and enforce business rules.

## Current React Query setup

`App.tsx` creates a `QueryClient` and wraps the application in `QueryClientProvider`.

That prepares the application for server data, but it does not make data fetching happen. A real query will need a `queryKey`, a query function, and a component that uses the result.

We will study that when the first API connection is introduced.

## Hands-on exercise

Inspect these files:

- `frontend/src/App.tsx`
- `frontend/src/components/fleet-shell.tsx`
- `frontend/src/pages/dashboard.tsx`
- `frontend/src/data/mock-data.ts`

Make a table with these columns:

| State or data | Where it lives now | Who changes it? | Should it later be server state? |
| --- | --- | --- | --- |
| Mobile menu |  |  |  |
| Notification panel |  |  |  |
| Refresh time |  |  |  |
| Vehicles |  |  |  |
| Requests |  |  |  |
| Trips |  |  |  |

## Checkpoint

Answer these questions:

1. Why should the mobile menu not be stored in the database?
2. Why should vehicles eventually come from the backend rather than `mock-data.ts`?
3. What is React Query currently preparing for?
4. Why does the frontend not connect directly to PostgreSQL?
5. What happens to mock-data values when the browser refreshes?

## Important rule

Do not put every value into one global state store. Ask first:

> Is this temporary UI state, shared client state, or data owned by the backend?
