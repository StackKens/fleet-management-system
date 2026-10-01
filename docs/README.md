# Fleet Management System Learning Documentation

This folder is the learning home for the Fleet Management System.

The root `README.md` is kept as the original project overview. Detailed learning notes and step-by-step walkthroughs live here so the project overview is not overwhelmed by teaching material.

## Current learning boundary

We are focusing on the frontend first. We will understand the existing React application before changing its architecture or connecting it to a backend.

The current frontend is a realistic UI prototype:

- It has a working application shell and dashboard.
- It uses temporary mock data.
- It has not connected to an API or database.
- It has not implemented forms, authentication, or business workflows.

## Documentation map

Read these documents in order:

1. [01 — Orientation](01-orientation/README.md)
   - Run the frontend and learn how to inspect it in the browser.
2. [02 — Frontend architecture](02-frontend-architecture/README.md)
   - Understand how the browser, React, the shell, and the dashboard connect.
3. [03 — Routing](03-routing/README.md)
   - Learn how Wouter chooses pages and preserves the application shell.
4. [04 — State and data](04-state-and-data/README.md)
   - Separate local UI state, server state, and mock data.
5. [05 — Dashboard walkthrough](05-dashboard/README.md)
   - Understand the dashboard components, types, and mock-data flow.
6. [06 — Frontend learning roadmap](06-frontend-roadmap/README.md)
   - Follow the milestones in a deliberate order.
7. [07 — Learning log](07-learning-log/README.md)
   - Record questions, experiments, and understanding after each session.

## Reports

- [Week 8 — Testing and refinement](17-week-8-testing-and-refinement/README.md)
  - Testing results, errors found and fixed, and the challenges encountered.

## How we will learn

For every learning process, we will use this sequence:

### 1. Understand the problem

What user or engineering problem are we solving?

### 2. Understand the real-world workflow

What would happen in a real fleet operation?

### 3. Inspect the current code

What already exists? What is working? What is missing?

### 4. Explain the technical idea

What is the concept, why is it needed, and where does it belong?

### 5. Make one small change

We will not make a large unexplained rewrite.

### 6. Test the change

We will test the exact behavior in the browser and with the available project checks.

### 7. Explain and verify

You will be asked to explain the change in your own words before we move forward.

## Current technology

- React 18
- TypeScript
- Vite
- Wouter for routing
- Tailwind CSS v4 for styling
- Radix UI foundations for reusable interface primitives
- TanStack React Query is installed for future server data
- Lucide React for icons
- Express is present in the backend skeleton

## Important current limitations

The current application does not yet have:

- A database
- A frontend API client
- Real API queries
- Request creation or approval workflows
- Authentication or authorization
- Automated tests
- A complete vehicles page
- A complete requests page

This is intentional. We will build those pieces in order after understanding the foundation.

## Our working rule

When you do not understand something, stop and ask about that specific concept. We will first explain and diagnose it, then make the smallest appropriate change. We will not replace working functionality just to try a different solution.
