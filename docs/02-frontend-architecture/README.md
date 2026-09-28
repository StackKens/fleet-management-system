# Process 02 — Frontend Architecture

## Goal

Understand the layers of the existing React frontend and how data moves from the browser to the dashboard.

## The current render path

```text
Browser requests the application
        ↓
Vite serves frontend/index.html
        ↓
index.html provides <div id="root">
        ↓
src/main.tsx starts React
        ↓
App provides application-wide setup
        ↓
Wouter selects a route
        ↓
FleetShell renders shared navigation and header
        ↓
Dashboard renders the selected page content
        ↓
Dashboard reads values from mock-data.ts
```

## Why we use layers

Each file has a focused responsibility. This makes the application easier to understand and change.

### `index.html`

The HTML entry point. It contains metadata and an empty React root element.

### `src/main.tsx`

The JavaScript entry point. It:

- Imports React
- Imports the application
- Imports global styles
- Creates the React root
- Starts rendering

### `src/App.tsx`

The composition layer. It:

- Creates the React Query client
- Provides React Query
- Provides tooltip behavior
- Starts Wouter
- Defines the route table
- Places routed content inside `FleetShell`

### `src/components/fleet-shell.tsx`

The shared layout. It provides:

- Desktop sidebar
- Mobile sidebar
- Header
- Current page label
- Notification panel
- The content area for the current page

### `src/pages/`

Page-level components. A page usually represents a user destination or a meaningful business view.

### `src/data/`

Temporary application data and TypeScript types. This is currently mock data, not a database layer.

### `src/components/ui/`

Small reusable interface building blocks. These are not fleet business rules; they provide general UI behavior such as tooltips and toasts.

## Current component relationship

```text
App
├── QueryClientProvider
├── TooltipProvider
├── WouterRouter
│   └── Router
│       └── FleetShell
│           └── Current page
│               └── Dashboard
└── Toaster
```

The order matters:

- Query data must be available below its provider.
- Routing must be available before route components use `Link` or `useLocation`.
- The shell must wrap the page so the page can use the shared layout.

## Important concept: composition

`FleetShell` receives children. It does not need to know whether the child is `Dashboard`, `Placeholder`, or a future `Vehicles` page.

This is composition: a parent arranges and combines child components.

## Important concept: separation of concerns

Different files answer different questions:

- `main.tsx`: How does React start?
- `App.tsx`: How is the application assembled?
- `fleet-shell.tsx`: What is shared by all pages?
- `dashboard.tsx`: What does the dashboard display?
- `mock-data.ts`: What sample information is currently displayed?

A file should have a clear reason to change.

## Read the files in this order

1. `frontend/index.html`
2. `frontend/src/main.tsx`
3. `frontend/src/App.tsx`
4. `frontend/src/components/fleet-shell.tsx`
5. `frontend/src/pages/dashboard.tsx`
6. `frontend/src/data/mock-data.ts`
7. `frontend/src/index.css`

## Hands-on exercise

Choose one visible dashboard section, such as the requests table. Trace it through the files:

1. Which component renders the table?
2. Which data array does it read?
3. Where is that array currently defined?
4. Which visual component displays the request status?
5. What would need to change if the request data came from an API later?

## Checkpoint

Explain why `FleetShell` is outside the individual page components instead of being copied into every page.

A complete answer should mention that the navigation and header are shared, should not be duplicated, and should remain consistent during navigation.

## What we are not changing yet

We are not introducing:

- Redux
- Zustand
- A new router
- A component generator
- A complex design system
- A backend API

We are first learning the architecture that already exists.
