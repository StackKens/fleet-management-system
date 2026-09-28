# Process 01 — Orientation: Run and Inspect the Frontend

## Goal

By the end of this process, you should be able to start the frontend, open it in a browser, locate the important files, and describe what happens before React renders the dashboard.

This process does not require code changes.

## Why this comes first

Before changing a project, we need a reliable way to observe it. If we cannot run the application and reproduce its current behavior, every later change becomes guesswork.

## Step 1 — Check the tools

Open a terminal and run:

```bash
node --version
npm --version
```

The application uses a current Node.js release. You do not need to understand every tool in the terminal yet. You only need to know that Node.js runs JavaScript outside the browser and npm installs project dependencies.

## Step 2 — Install the frontend dependencies

Run:

```bash
cd "C:\Users\MY PC\Desktop\fleet-management-system\frontend"
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. It is repeatable, which makes it safer for learning projects than guessing which versions should be installed.

## Step 3 — Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The development server watches source files and refreshes the browser when you save changes. This is different from a production build, which creates optimized files for deployment.

Stop the server with `Ctrl + C`.

## Step 4 — Inspect the page

1. Open the browser's developer tools.
2. Select the Elements panel.
3. Locate the element with `id="root"`.
4. Expand the rendered HTML.
5. Find text such as `Operations overview` and `Good morning, Fleet Manager`.
6. Notice that React content is rendered inside the root element.

The root element itself is almost empty in `index.html`. React creates the visible content during application startup.

## Step 5 — Observe the current behavior

Try each of these actions:

1. Click `Dashboard`.
2. Click `Vehicles`.
3. Click `Requests`.
4. Click `Trips`.
5. Click the dashboard `Refresh` button.
6. Resize the browser to a narrow width and open the mobile menu.

Write down what changes and what stays the same.

## What should stay the same?

The sidebar and header should remain visible while the page content changes. That is because the shared `FleetShell` wraps the routed page.

## What does not happen yet?

The dashboard data does not come from a server. The Refresh button changes a local time display; it does not fetch fresh data.

## Files to read in this process

Read these files, but do not edit them yet:

- `frontend/package.json`
- `frontend/index.html`
- `frontend/src/main.tsx`
- `frontend/vite.config.ts`
- `frontend/src/App.tsx`

## Hands-on exercise

Answer these questions in your own words:

1. What is the purpose of the terminal command `npm run dev`?
2. What is the purpose of `index.html`?
3. What does `createRoot` do?
4. Which file contains the route definitions?
5. Which file contains the sidebar and header?

## Checkpoint

Do not continue until you can explain this sentence clearly:

> The browser loads the HTML entry point, React attaches to the root element, the application providers are prepared, the router chooses the current page, the shared shell renders, and the dashboard displays mock data.

## If something goes wrong

Do not reinstall or rewrite everything. Use this order:

1. Read the terminal error.
2. Confirm you are in the `frontend` directory.
3. Confirm the URL and port.
4. Run `npm ci` only if dependencies are missing.
5. Run `npm run typecheck` if TypeScript reports an error.
6. Ask for help with the exact error message if the problem remains.
