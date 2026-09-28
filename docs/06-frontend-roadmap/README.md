# Process 06 — Frontend Learning Roadmap

## Goal

Build the frontend in a deliberate order so each new concept has a clear purpose.

## The rule

Do not move to a new milestone until you can explain the current one and have tested the current application.

## Phase 0 — Orientation

Documentation:

- [Process 01 — Orientation](../01-orientation/README.md)

Done when you can run the frontend and describe the difference between the terminal, browser, and source code.

## Phase 1 — Frontend architecture

Documentation:

- [Process 02 — Frontend architecture](../02-frontend-architecture/README.md)

Done when you can trace the render path from `index.html` to `Dashboard`.

## Phase 2 — Routing

Documentation:

- [Process 03 — Routing](../03-routing/README.md)

Done when you can explain how Wouter selects pages and why the shell remains visible.

## Phase 3 — State and data

Documentation:

- [Process 04 — State and data](../04-state-and-data/README.md)

Done when you can distinguish local UI state, shared client state, and server state.

## Phase 4 — Dashboard understanding

Documentation:

- [Process 05 — Dashboard walkthrough](../05-dashboard/README.md)

Done when you can trace a request or trip from mock data to the browser.

## Phase 5 — Small frontend components

We will learn by extracting or creating small pieces only when the current page needs them.

Possible practice work:

- A reusable status badge
- A reusable empty state
- A reusable loading state
- A reusable error message
- A small vehicle list component

Done when you can explain the difference between a page component and a reusable UI component.

## Phase 6 — Vehicle request workflow

We will build the first meaningful business workflow in the frontend:

```text
Enter request information
        ↓
Validate the information
        ↓
Show the new pending request
        ↓
Open the request in a list
```

Initially, the data will remain temporary in memory or mock data. We will not jump to a database yet.

Done when you can explain:

- Controlled inputs
- Form events
- Validation
- State updates
- List updates
- User feedback

## Phase 7 — Approval workflow

We will learn how a pending request becomes approved or declined, including:

- Allowed status changes
- Confirmation
- Disabled actions
- Error feedback
- History information

The frontend will eventually improve the experience, but the backend will later enforce the rule.

## Phase 8 — Frontend quality

We will gradually add:

- Loading states
- Empty states
- Error states
- Keyboard and accessibility checks
- Type checks
- Production builds
- Small automated tests where useful
- Clear Git commits

## Phase 9 — API-ready frontend

Only after the frontend workflows are clear will we connect the frontend to a backend API.

This milestone will introduce:

- `fetch`
- JSON responses
- HTTP status codes
- React Query queries
- Mutations
- Query invalidation
- API loading and error states

The frontend will remain separate from the database. The backend will be the layer that talks to the database.

## Phase 10 — Backend learning

We will move to the backend after the frontend milestone is understood. That phase will cover Express fundamentals, routes, services, middleware, validation, authentication, authorization, PostgreSQL, Prisma, migrations, and seed data.

We will not implement the backend prematurely just to make a button appear functional.

## Definition of understanding

Before moving on, you should be able to answer:

- What problem does this feature solve?
- Which files are involved?
- What data does it need?
- Who is allowed to perform the action?
- What happens when the action fails?
- How will we test it?
- What should happen when there are many records?
- How will this connect to the backend later?

## Current first milestone

Start with:

1. [Process 01 — Orientation](../01-orientation/README.md)
2. [Process 02 — Frontend architecture](../02-frontend-architecture/README.md)
3. [Process 03 — Routing](../03-routing/README.md)
4. [Process 04 — State and data](../04-state-and-data/README.md)
5. [Process 05 — Dashboard walkthrough](../05-dashboard/README.md)

We will begin the first hands-on lesson from Process 01 before making any source-code change.
