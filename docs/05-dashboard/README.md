# Process 05 — Dashboard Walkthrough

## Goal

Understand one complete frontend page from data definition to visible browser output.

## What the dashboard currently represents

The dashboard is an operations overview. It attempts to show:

- Fleet availability summary
- Active vehicle requests
- Today's trips
- Items requiring attention
- Recent activity

The data is realistic, but it is currently temporary mock data.

## Dashboard file

```text
frontend/src/pages/dashboard.tsx
```

## Data file

```text
frontend/src/data/mock-data.ts
```

## Data types

`mock-data.ts` defines types for:

- `Vehicle`
- `VehicleSummary`
- `VehicleRequest`
- `Trip`
- `AttentionItem`
- `ActivityEvent`

A type is a description of the shape of data. It does not create data and it does not store data.

For example, a `VehicleRequest` type tells TypeScript that a request has an ID, requester, department, destination, date, and status.

## Dashboard helper components

### `StatusPill`

Displays a request or trip status with a consistent visual treatment.

### `SeverityMark`

Displays the severity of an attention item.

### `ActivityIcon`

Chooses an icon based on the activity type.

These are small presentational helpers. Keeping them focused makes the main page easier to read.

## Main `Dashboard` component

The `Dashboard` component currently:

1. Displays the greeting and operations heading.
2. Displays a local refresh time.
3. Maps summary values into a summary strip.
4. Maps requests into a table.
5. Maps trips into a table.
6. Maps attention items into a panel.
7. Maps activity events into a panel.
8. Uses Wouter links to navigate to future destinations.

## The most important React concept: mapping

An array of objects can be transformed into an array of JSX elements.

Conceptually:

```tsx
requests.map((request) => (
  <RequestRow key={request.id} request={request} />
))
```

The current code keeps more of the row markup inside the dashboard file. That is acceptable while the page is small. We can extract `RequestRow` later if the page becomes difficult to read.

Do not extract components only because a rule says so. Extract them when the code becomes harder to understand or reuse.

## The current request workflow shown by the UI

The dashboard displays requests with statuses such as:

```text
Pending → Approved or Declined
```

This is a visual representation of the first part of the real workflow:

```text
A department submits a request
        ↓
A fleet manager reviews it
        ↓
The request is approved or declined
```

The approval button and backend rules are not implemented yet. The current status values are only mock data.

## The current trip workflow shown by the UI

The trips table shows statuses such as:

```text
Scheduled
On route
Returned
```

The intended future workflow is:

```text
Approved request
        ↓
Vehicle and driver assigned
        ↓
Trip created
        ↓
Trip started
        ↓
Trip completed
        ↓
History recorded
```

The current table does not yet enforce these transitions. That will be a later frontend and backend concern.

## What is good about the current dashboard

- It communicates operational information clearly.
- The tables are readable and support scanning.
- The layout is responsive.
- The visual language is calm and professional.
- Types describe the shape of the sample data.
- The page is split into understandable sections.

## What is missing

- Loading state
- Empty state
- API error state
- Real filtering
- Create-request form
- Approval actions
- Pagination
- Sorting
- Data freshness
- Authentication context

We will add these when the corresponding workflow is ready, rather than adding complexity for its own sake.

## Hands-on exercise

1. Start the frontend.
2. Find the requests table.
3. Find the request whose ID ends in `0246`.
4. Trace it from `mock-data.ts` to its table row.
5. Change only the destination of that mock request temporarily.
6. Refresh the browser and observe the result.
7. Restore the original value.
8. Explain why the browser refresh restores the original data.

## Checkpoint

Answer in your own words:

1. Where does the dashboard get its data?
2. What is the difference between a type and a data value?
3. What does `.map()` do in this page?
4. Why does a real request need a stable ID?
5. Why would loading and error states be necessary when an API is connected?
6. What part of the real lifecycle is currently only represented visually?

## Next connection

The next important idea is not another visual page. It is learning how the dashboard can request data without embedding database logic inside the page component.

That will be studied after the routing and state processes are understood.
