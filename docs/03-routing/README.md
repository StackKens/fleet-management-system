# Process 03 — Routing with Wouter

## Goal

Understand how the browser URL selects a React page and why the shared shell remains visible during navigation.

## What is routing?

Routing is the connection between a URL and the page that should be displayed.

For example:

```text
/dashboard → Dashboard page
/requests  → Requests destination
/trips     → Trips destination
```

The browser can display different application views without downloading and starting the whole application again.

## Current router location

The route definitions are in:

```text
frontend/src/App.tsx
```

The navigation links are mainly in:

```text
frontend/src/components/fleet-shell.tsx
```

## Wouter pieces currently used

### `WouterRouter`

Starts client-side routing and establishes the base URL.

### `Switch`

Chooses the first route that matches the current location.

### `Route`

Maps a URL path to a component or child content.

### `Link`

Navigates to a route without a full browser page reload.

### `useLocation`

Reads the current URL so the shell and navigation can determine which item is active.

## Current route table

| URL | Current destination |
| --- | --- |
| `/` | Dashboard |
| `/dashboard` | Dashboard |
| `/vehicles` | Vehicles placeholder |
| `/requests` | Requests placeholder |
| `/assignments` | Assignments placeholder |
| `/drivers` | Drivers placeholder |
| `/trips` | Trips placeholder |
| `/maintenance` | Maintenance placeholder |
| `/fuel` | Fuel placeholder |
| `/reports` | Reports placeholder |
| `/users` | Users placeholder |
| `/settings` | Settings placeholder |
| Unknown URL | Not-found page |

## Navigation flow

When the user clicks `Vehicles`:

```text
User clicks Link href="/vehicles"
        ↓
Wouter updates the browser URL
        ↓
Switch matches /vehicles
        ↓
Placeholder renders inside the existing shell
        ↓
Sidebar and header remain visible
```

## Why the shell remains visible

`FleetShell` wraps the `Switch`. The shell is not recreated for every page. Only the routed page content changes.

If the shell were inside each page, every page would have to recreate the navigation and we could eventually get inconsistent layouts.

## Active navigation

`fleet-shell.tsx` compares the current location with each navigation item's `href`.

When they match, it adds active styling and `aria-current="page"`.

This is a small example of deriving UI from the current route.

## What is not implemented yet

The current router does not yet provide:

- Login routes
- Protected routes
- Role-based route access
- Dynamic routes such as `/vehicles/:id`
- Nested route layouts
- Route-level data loading
- Server error boundaries for each API request

We will add these only when the corresponding product requirements become clear.

## Hands-on exercise

1. Start the frontend.
2. Click every navigation item.
3. Record the URL and page content for each item.
4. Click the browser refresh button on `/vehicles`.
5. Observe that the route is selected again from the URL.
6. Open an unknown URL such as `/does-not-exist`.
7. Explain why a router can display the correct page after a full browser refresh.

## Checkpoint

Answer in your own words:

1. What problem does routing solve?
2. What is the difference between a `Link` and a normal page reload?
3. What does `Switch` do?
4. Why is the shell outside the route switch?
5. How does the sidebar know which item is active?

## Important learning point

Routing changes what page is shown. It does not automatically load data from a database. Data loading will be a separate frontend concern, connected later to React Query and the backend API.
