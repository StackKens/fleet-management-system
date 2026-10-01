# Week 8 — Testing and Refinement

This document records the Week 8 testing and refinement work: what was tested,
what was found, what was fixed, and the challenges encountered. It matches the
"Testing and Refinement" section of the internship report.

## What was done

Week 8 was used for testing and refinement. I tested the system as a whole and
reviewed the implemented features and workflows, especially the vehicle request,
assignment and fleet management workflows. I found some errors and interface
problems and corrected them. I also improved the responsiveness and usability of
the interface. Most of the testing was done by using the system in the way the
users would. The backend project also has an API test script (run with
`npm test`).

### What the API test script covers

The backend includes an API test script (`backend/tests/api.test.js`, run with
`npm test`) that sends real HTTP requests to the running server and checks each
response, printing PASS/FAIL and exiting with a non-zero code if anything fails.
It covers:

- the server health check;
- user registration (201, JWT token returned);
- login with valid and invalid credentials (200/401);
- access to a protected route with and without a token (200/401);
- retrieving the logged-in user's profile;
- role-based access (a Staff user is refused the user list with 403, while an
  Admin can retrieve it);
- listing vehicles;
- the vehicle status summary;
- the list of report types.

At the end of Week 8 all **29 checks passed**.

## Table 2.5: Features tested during Week 8

| Feature | What was checked | Result |
|---|---|---|
| Login and role-based access | A user can log in and reaches only the areas allowed for the role | Passed after one fix. Each user reached the correct dashboard and only their permitted areas were shown (Staff, Driver, Fleet Manager and Admin tested). Two API checks failed at first because the test logged in with a different random email from the one it registered; the test was corrected to reuse the same address. A Staff user is correctly refused the user list (403), confirming role-based access works. |
| Vehicle management | Vehicle records can be managed and are saved in the database | Passed after two fixes. A vehicle was created, retrieved, updated and deleted, and was still present when read back from the database. Problem found: sending an unexpected field returned a 500 server error instead of a clear message. Cause: validation schemas had been written but never attached to the routes. The validation middleware was wired in, so bad input now returns 400 with a reason. A duplicate `@id` in the Prisma schema (which blocked schema validation) was also removed. |
| Vehicle requests | A request submitted through the form is saved | Passed. A request posted to `POST /api/requests` was saved and returned by `GET /api/requests` (201 then 200), confirming it persisted. |
| Vehicle assignment | A vehicle can be assigned to a request | Passed. An assignment linking a vehicle, driver and request was created (201) and appeared in the assignment list when retrieved. |
| Frontend, backend and database | Data entered in the interface reaches the database and can be retrieved | The API-to-database round trip is verified, but the current frontend runs on sample data in the browser, so the interface is not yet wired to the API. See "Current limitations" below. |
| Responsive layout | Pages display properly on different screen sizes | Passed. Pages and the dashboard header were checked at desktop, tablet and mobile widths and laid out correctly after responsive adjustments. |

> Note: there is currently no driver API route. Drivers exist in the database via
> seed data, but no endpoint creates or updates them. Driver management was
> therefore not tested through the API.

## Errors found and fixed

1. **Failing tests that were actually test bugs.** The API script first reported
   4 failures. Two were caused by the test generating a random email twice
   (`Date.now()` changed between registration and login), and two by a test user
   with the Staff role trying to list all users. The app was behaving correctly
   in both cases; the test data was fixed.

2. **A hidden database schema error.** The Prisma schema had a duplicate `@id`
   attribute on the `Notification` and `ActivityLog` models, which stopped
   `prisma validate` and would have broken migration/generation. It only
   appeared when the schema was validated directly, not when the app was run.

3. **Validation that was never applied.** Validation schemas existed in the
   codebase but were not attached to any route, so an unexpected field produced
   a 500 internal error instead of a helpful 400. The validation middleware was
   wired into the vehicle and request routes, improving reliability and the
   quality of error messages.

## Challenges

During Week 8 the most useful work came from testing the system the way a user
would, which exposed problems that are easy to miss when reading code:

1. **Failing tests that were actually test bugs.** A failing test does not
   automatically mean the application is wrong. The login and user-list
   failures had to be traced back to the test itself before changing any
   application code.

2. **A hidden database schema error.** The duplicate `@id` only appeared when
   the schema was validated directly. This showed the value of running the
   project's own checks rather than assuming a working app means a valid schema.

3. **Validation that was never applied.** Writing validation is not enough; it
   has to be attached to the routes. Input validation belongs at the edge of the
   API so that bad data is rejected with a clear message.

4. **Distinguishing a bug from correct behaviour.** A Staff account being refused
   access to the user list looked like a failure until it was confirmed that this
   is the intended role-based restriction. Documenting the expected behaviour for
   each role made this easier to judge.

5. **Connecting the pieces.** The biggest remaining challenge is the
   frontend-to-backend integration. The API and database are working and tested,
   and an API client exists in the frontend, but the interface still runs on
   sample data, so end-to-end checks need to be done through the interface rather
   than the API. This is the main item to complete.

Generally, testing against real data and real flows, and checking the API
responses rather than assuming them, was what uncovered the real problems.

## Current limitations

The frontend currently uses a client-side mock user list for login and an
in-browser store for data. The API client (`frontend/src/lib/api.ts`) exists but
is not yet imported anywhere, so the interface does not yet persist to the
database. The backend API and database side is working and tested.

## How to run the tests

```bash
# From the backend folder, start the server first
cd backend
npm start

# In another terminal, run the API tests
npm test
```

Expected result:

```
=== Results: 29 passed, 0 failed ===
```
