# Fleet Management System — Frontend (Beginner's Guide)

## What Is This?

This is the **frontend** (what users see and interact with) of a Fleet Management System. Think of it like the dashboard of a car — it shows you information and lets you press buttons, but it doesn't actually store the data or do the heavy lifting. That's the backend's job.

This frontend is built with **React** and **TypeScript**, and it's designed so that different users (Fleet Managers, Drivers, Staff, Admins) see different things based on their role.

---

## Table of Contents

1. [What is React?](#what-is-react)
2. [What is TypeScript?](#what-is-typescript)
3. [Project Structure](#project-structure)
4. [How the App Works](#how-the-app-works)
5. [Understanding Roles](#understanding-roles)
6. [State Management](#state-management)
7. [Data Flow](#data-flow)
8. [Routing](#routing)
9. [UI Components](#ui-components)
10. [Forms and Validation](#forms-and-validation)
11. [Responsive Design](#responsive-design)
12. [Key Concepts for Beginners](#key-concepts-for-beginners)

---

## What is React?

React is a JavaScript library for building user interfaces. Instead of writing raw HTML and JavaScript, you build **components** — reusable pieces of UI.

### Why React?

- **Components**: Like LEGO blocks. You build small pieces and combine them to make complex UIs.
- **Declarative**: You describe WHAT the UI should look like, and React figures out HOW to update it.
- **Virtual DOM**: React keeps a copy of the DOM in memory and only updates what changed, making it fast.

### Example Component

```tsx
// This is a simple React component
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Why this matters**: Every button, form, table, and page in this app is a component. Understanding components is the key to understanding React.

---

## What is TypeScript?

TypeScript is JavaScript with **types**. It helps catch errors before you run the code.

### Why TypeScript?

- **Catch errors early**: If you try to pass a string where a number is expected, TypeScript warns you.
- **Better autocomplete**: Your editor knows what properties an object has.
- **Self-documenting code**: Types tell you what a function expects and returns.

### Example

```typescript
// Without TypeScript (JavaScript)
function add(a, b) {
  return a + b;
}
// What if someone calls add("hello", "world")? It would concatenate strings!

// With TypeScript
function add(a: number, b: number): number {
  return a + b;
}
// Now add("hello", "world") gives an error — good!
```

**Why this matters**: All the data in this app (vehicles, drivers, requests) has a type. This prevents bugs like trying to read `vehicle.name` when the vehicle doesn't exist.

---

## Project Structure

```
frontend/src/
├── components/       # Reusable UI pieces (buttons, modals, tables)
│   ├── ui/           # Basic building blocks (Button, Input, Modal, etc.)
│   ├── fleet-shell.tsx   # Main layout (sidebar + header + content)
│   ├── route-guard.tsx   # Protects routes based on user permissions
│   └── error-boundary.tsx # Catches errors and shows a friendly message
├── contexts/         # Global state that many components need
│   └── auth-context.tsx  # Who is logged in? What can they do?
├── data/             # Static data and configuration
│   ├── types.ts          # TypeScript type definitions
│   ├── mock-data.ts      # Fake data for development
│   ├── capabilities.ts   # What each role is allowed to do
│   ├── navigation.ts     # Menu items for each role
│   └── status-variants.ts # Color mappings for status badges
├── hooks/            # Reusable logic for data fetching
│   ├── use-fleet-data.ts # Hooks for vehicles, drivers, requests, etc.
│   └── use-toast.ts      # Hook for showing toast notifications
├── pages/            # Full pages (one per route)
│   ├── dashboard.tsx     # Role-based dashboard
│   ├── vehicles.tsx      # Vehicle list
│   ├── vehicle-detail.tsx # Single vehicle details
│   ├── drivers.tsx       # Driver list
│   ├── driver-detail.tsx # Single driver details
│   ├── requests.tsx      # Vehicle requests (Fleet Manager)
│   ├── request-vehicle.tsx # Request a vehicle (Staff)
│   ├── my-requests.tsx   # My requests (Staff)
│   ├── my-trips.tsx      # My trips (Driver/Staff)
│   ├── my-vehicle.tsx    # My assigned vehicle (Driver)
│   ├── inspections.tsx   # Submit inspections (Driver)
│   ├── my-fuel.tsx       # Submit fuel records (Driver)
│   ├── report-issue.tsx  # Report vehicle issues (Driver)
│   ├── trips.tsx         # All trips (Fleet Manager)
│   ├── assignments.tsx   # Vehicle/driver assignments
│   ├── maintenance.tsx   # Maintenance records
│   ├── fuel.tsx          # Fuel records (Fleet Manager)
│   ├── reports.tsx       # Reports
│   ├── users.tsx         # User management (Admin)
│   ├── roles.tsx         # Roles & permissions (Admin)
│   ├── departments.tsx   # Department management
│   ├── audit-logs.tsx    # Audit logs (Admin)
│   ├── settings.tsx      # System settings (Admin)
│   ├── notifications.tsx # Notifications
│   ├── profile.tsx       # User profile
│   └── login.tsx         # Login page
├── stores/           # Central data store
│   └── fleet-store.ts    # All fleet data lives here
├── App.tsx           # Root component — sets up providers and routes
├── main.tsx          # Entry point — renders the app
└── index.css         # Global styles (Tailwind CSS)
```

**Why this structure**: Separation of concerns. Components are reusable, pages are specific, data is centralized. This makes the app easier to maintain and understand.

---

## How the App Works

### The Big Picture

```
User opens browser
       ↓
   Login page
       ↓
   Enter email + password
       ↓
   AuthContext checks credentials
       ↓
   User is logged in with a role
       ↓
   App shows role-specific navigation
       ↓
   User interacts with pages
       ↓
   Pages read/write data via hooks
       ↓
   Hooks read/write Zustand store
       ↓
   UI updates automatically
```

### Why This Flow?

- **Single source of truth**: All data lives in one place (Zustand store). No confusion about where data comes from.
- **Role-based from the start**: The user's role determines what they see and can do.
- **Reactive UI**: When data changes, the UI updates automatically. No manual refreshing.

---

## Understanding Roles

This app has **5 roles**, each with different responsibilities:

### 1. Fleet Manager
- **Who**: The person who manages daily fleet operations
- **Can do**: Manage vehicles, drivers, approve requests, assign vehicles, schedule trips, manage maintenance, view reports
- **Cannot do**: Manage users, roles, or system settings (that's Admin's job)

### 2. Driver
- **Who**: The person who drives the vehicles
- **Can do**: View assigned vehicle, view assigned trips, start/complete trips, submit inspections, submit fuel records, report issues
- **Cannot do**: See other drivers' data, manage fleet, approve requests

### 3. Staff (Vehicle Requester)
- **Who**: An employee who needs a vehicle for a trip
- **Can do**: Request a vehicle, view own requests, view own trips, cancel pending requests
- **Cannot do**: See other employees' requests, manage vehicles, approve requests

### 4. System Administrator
- **Who**: The person who manages the platform itself
- **Can do**: Manage users, roles, departments, view audit logs, manage system settings
- **Cannot do**: Perform daily fleet operations (that's Fleet Manager's job)

### 5. Supervisor
- **Who**: Similar to Fleet Manager but with slightly fewer permissions
- **Can do**: View fleet data, approve requests, manage assignments and trips
- **Cannot do**: Manage users, roles, or fuel records

### Why Roles Matter

Roles prevent chaos. Imagine if a Driver could delete vehicles from the system, or a Staff member could approve their own requests. Roles keep everyone in their lane.

---

## State Management

### What is State?

State is **data that changes over time**. In this app, state includes:
- Who is logged in
- The list of vehicles
- The list of requests
- Whether a modal is open
- Form input values

### Zustand Store

This app uses **Zustand** for state management. Think of it as a **central data room** that all components can access.

```typescript
// stores/fleet-store.ts (simplified)
const useFleetStore = create((set, get) => ({
  // Data
  vehicles: [],
  drivers: [],
  requests: [],
  
  // Actions (functions that modify data)
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [...state.vehicles, vehicle]
  })),
  
  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),
}));
```

### Why Zustand?

- **Simple**: No boilerplate. Just define data and actions.
- **No provider needed**: Unlike Redux, you don't need to wrap your app in a provider.
- **Selective re-renders**: Components only re-render when the data they use changes.

### How Components Use the Store

```typescript
// In a component
const vehicles = useFleetStore((state) => state.vehicles);
const addVehicle = useFleetStore((state) => state.addVehicle);

// Now you can read vehicles and call addVehicle
```

### React Query

React Query is used **on top of** Zustand to provide:
- **Loading states**: Show spinners while data is being fetched
- **Error states**: Show error messages if something goes wrong
- **Caching**: Don't refetch data that hasn't changed
- **Automatic refetching**: Keep data fresh

**Why both?** Zustand is the source of truth. React Query provides the async interface (loading, error, caching). Together they make data handling robust.

---

## Data Flow

### How Data Moves Through the App

```
1. User interacts with UI (clicks "Add Vehicle")
       ↓
2. Component calls store action (addVehicle)
       ↓
3. Store updates state (vehicles array gets new item)
       ↓
4. React detects state change
       ↓
5. Components using vehicles re-render
       ↓
6. UI shows the new vehicle
```

### Why This Matters

This is **unidirectional data flow**. Data flows in one direction: from store → UI. Actions flow from UI → store. This makes the app predictable and easy to debug.

### Example: Adding a Vehicle

```typescript
// 1. User fills out the form and clicks "Add Vehicle"
// 2. The form's onSubmit handler calls:
addVehicle({
  registration: 'UAX 123A',
  make: 'Toyota',
  model: 'Land Cruiser',
  // ... other fields
});

// 3. The store adds the vehicle to the vehicles array
// 4. The vehicles table re-renders to show the new vehicle
// 5. The dashboard stats update to show the new total
```

---

## Routing

### What is Routing?

Routing maps **URLs to pages**. When you visit `/vehicles`, you see the Vehicles page. When you visit `/drivers`, you see the Drivers page.

### Wouter

This app uses **wouter**, a lightweight routing library.

```tsx
// App.tsx (simplified)
<Switch>
  <Route path="/login" component={Login} />
  <Route path="/dashboard" component={Dashboard} />
  <Route path="/vehicles" component={Vehicles} />
  <Route path="/vehicles/:id" component={VehicleDetail} />
  <Route path="/drivers" component={Drivers} />
  <Route component={NotFound} /> {/* 404 page */}
</Switch>
```

### Route Parameters

`/vehicles/:id` means the `:id` part is dynamic. Visiting `/vehicles/VHC-001` shows the detail for vehicle VHC-001.

```tsx
// In VehicleDetail component
const { id } = useParams(); // Gets the id from the URL
const vehicle = useVehicle(id); // Fetches that specific vehicle
```

### Route Protection

Not everyone can access every page. The `RouteGuard` component checks permissions:

```tsx
<Route path="/vehicles">
  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_VEHICLES}>
    <Vehicles />
  </RouteGuard>
</Route>
```

If a user without `VIEW_VEHICLES` capability tries to access `/vehicles`, they see an "Access Denied" page.

**Why route protection matters**: It's the first line of defense. Even if someone manually types a URL, they can't see pages they're not authorized for. (Note: This is frontend-only protection. The backend must also enforce these rules.)

---

## UI Components

### Component Library

The app has a custom UI component library in `src/components/ui/`. These are the building blocks:

| Component | What It Does | Example |
|-----------|-------------|---------|
| `Button` | Clickable button with variants | Save, Cancel, Delete |
| `Input` | Text input field | Name, Email, Search |
| `Select` | Dropdown selector | Status filter, Role selector |
| `Textarea` | Multi-line text input | Notes, Description |
| `Modal` | Dialog overlay | Add Vehicle, Confirm Delete |
| `ConfirmDialog` | Yes/No confirmation | Delete confirmation |
| `Badge` | Status indicator | Pending, Approved, Active |
| `Card` | Content container | Stats cards, detail panels |
| `Table` | Data table | Vehicle list, Driver list |
| `Pagination` | Page navigation | Page 1, 2, 3... |
| `EmptyState` | No data message | "No vehicles found" |
| `LoadingState` | Loading spinner | "Loading vehicles..." |
| `FormField` | Label + input + error | Form fields with validation |
| `PageHeader` | Page title + actions | "Vehicles" + "Add Vehicle" button |
| `Avatar` | User initials in a circle | "RO" for Robert Okello |
| `Toast` | Success/error notification | "Vehicle added successfully" |

### Why Custom Components?

- **Consistency**: Every button looks and behaves the same way
- **Reusability**: Write once, use everywhere
- **Maintainability**: Change the Button component, all buttons update

---

## Forms and Validation

### How Forms Work

Forms in this app follow a consistent pattern:

```tsx
function AddVehicleForm() {
  // 1. State for form data
  const [formData, setFormData] = useState({
    registration: '',
    make: '',
    model: '',
  });
  
  // 2. State for errors
  const [errors, setErrors] = useState({});
  
  // 3. Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.registration) newErrors.registration = 'Required';
    if (!formData.make) newErrors.make = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 4. Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit to store...
  };
  
  // 5. Render form
  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Registration" required error={errors.registration}>
        <Input value={formData.registration} onChange={...} />
      </FormField>
      {/* More fields... */}
      <Button type="submit">Add Vehicle</Button>
    </form>
  );
}
```

### Why This Pattern?

- **Controlled inputs**: Every input's value is stored in React state. This gives you full control.
- **Validation before submit**: Catch errors before they reach the store.
- **Clear error messages**: Users know exactly what went wrong.
- **Required field indicators**: The `required` prop shows a red asterisk.

### Form States

Forms have several states:

| State | What It Looks Like |
|-------|-------------------|
| **Empty** | Blank form, ready for input |
| **Filled** | User has entered data |
| **Invalid** | Red borders + error messages |
| **Submitting** | Button shows "Saving..." and is disabled |
| **Success** | Toast notification, form closes |
| **Error** | Toast notification with error message |

---

## Responsive Design

### What is Responsive Design?

The app should look good on all screen sizes:
- **Desktop** (1920px+): Full layout with sidebar
- **Tablet** (768px-1024px): Adapted layout
- **Mobile** (< 768px): Stacked layout, hamburger menu

### How It Works

The app uses **Tailwind CSS** with breakpoint prefixes:

```tsx
// Example: A form grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* On mobile: 1 column (stacked) */}
  {/* On desktop: 2 columns (side by side) */}
</div>
```

### Breakpoints

| Prefix | Width | Typical Device |
|--------|-------|----------------|
| (none) | 0px+ | Mobile (default) |
| `sm:` | 640px+ | Large mobile / small tablet |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Laptop |
| `xl:` | 1280px+ | Desktop |

### Mobile Navigation

On mobile, the sidebar becomes a **hamburger menu**:

```tsx
// Desktop: sidebar always visible
<div className="hidden md:block">Sidebar</div>

// Mobile: hamburger button
<button className="md:hidden">☰</button>

// Mobile: sidebar slides in as overlay
{mobileOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="absolute inset-0 bg-black/50" onClick={close} />
    <Sidebar />
  </div>
)}
```

---

## Key Concepts for Beginners

### 1. Props (Properties)

Props are how you pass data from a parent component to a child component.

```tsx
// Parent
<Button label="Save" onClick={handleSave} />

// Child (Button component)
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Why**: Props make components reusable. The same Button component can say "Save", "Cancel", or "Delete" depending on what label you pass.

### 2. useState

`useState` is a React hook for managing local component state.

```tsx
const [count, setCount] = useState(0);
// count = current value
// setCount = function to update the value
```

**Why**: When state changes, React automatically re-renders the component. This is how the UI stays in sync with data.

### 3. useEffect

`useEffect` is a React hook for side effects (data fetching, subscriptions, etc.).

```tsx
useEffect(() => {
  // This runs when the component mounts
  fetchData();
}, []); // Empty array = run once
```

**Why**: Side effects shouldn't happen during render. useEffect provides a safe place for them.

### 4. Conditional Rendering

Showing different UI based on conditions:

```tsx
{isLoading ? (
  <LoadingSpinner />
) : vehicles.length === 0 ? (
  <EmptyState message="No vehicles found" />
) : (
  <VehicleTable vehicles={vehicles} />
)}
```

**Why**: Users should always see something meaningful — a spinner while loading, an empty state when there's no data, or the actual content.

### 5. Mapping Over Arrays

Rendering a list of items:

```tsx
{vehicles.map((vehicle) => (
  <VehicleRow key={vehicle.id} vehicle={vehicle} />
))}
```

**Why**: Instead of manually writing HTML for each vehicle, you map over the array and generate components automatically.

### 6. The `key` Prop

When rendering lists, each item needs a unique `key`:

```tsx
{vehicles.map((vehicle) => (
  <VehicleRow key={vehicle.id} vehicle={vehicle} />
))}
```

**Why**: React uses keys to track which items changed. Without keys, React might re-render everything unnecessarily.

### 7. Lifting State Up

When two components need the same data, move the state to their common parent:

```tsx
// Instead of each component having its own copy:
const Parent = () => {
  const [search, setSearch] = useState('');
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <DataList search={search} />
    </>
  );
};
```

**Why**: Shared state stays in sync. If each component had its own copy, they could show different data.

### 8. Container vs Presentational Components

- **Container components**: Handle data and logic (e.g., `Vehicles` page)
- **Presentational components**: Handle display only (e.g., `VehicleRow`)

**Why**: Separation of concerns. Presentational components are reusable and easy to test.

---

## Common Patterns in This App

### Pattern 1: List Page with Search and Filter

```
┌─────────────────────────────────────────┐
│ PageHeader: "Vehicles" + [Add Vehicle]  │
├─────────────────────────────────────────┤
│ Search: [________] Status: [All ▼]      │
├─────────────────────────────────────────┤
│ Table:                                  │
│ Registration | Make | Status | Actions  │
│ UAX 482C    | Toyota| Active | [Edit]   │
│ UBH 193K    | Toyota| Available|[Edit]  │
├─────────────────────────────────────────┤
│ Pagination: < 1 2 3 >                   │
└─────────────────────────────────────────┘
```

### Pattern 2: Detail Page

```
┌─────────────────────────────────────────┐
│ ← Back to Vehicles                      │
├─────────────────────────────────────────┤
│ UAX 482C                    [Active]    │
│ Toyota Land Cruiser (2021)              │
├─────────────────────────────────────────┤
│ Stats: Mileage | Trips | Distance | Cost│
├──────────────────────┬──────────────────┤
│ Vehicle Information  │ Fuel History     │
│ Service & Compliance │ Cost Summary     │
│ Recent Trips         │                  │
│ Maintenance History  │                  │
└──────────────────────┴──────────────────┘
```

### Pattern 3: Form Modal

```
┌─────────────────────────────────────────┐
│ Add Vehicle                       [X]   │
├─────────────────────────────────────────┤
│ Registration: [________] *              │
│ Vehicle Type:  [________] *             │
│ Make:          [________] *             │
│ Model:         [________] *             │
│ ...                                     │
├─────────────────────────────────────────┤
│           [Cancel]  [Add Vehicle]       │
└─────────────────────────────────────────┘
```

---

## Summary

| Concept | What It Is | Why It Matters |
|---------|-----------|----------------|
| **React** | UI library | Build interfaces with reusable components |
| **TypeScript** | Typed JavaScript | Catch errors early, better tooling |
| **Zustand** | State management | Central data store, simple API |
| **React Query** | Data fetching | Loading states, caching, error handling |
| **Wouter** | Routing | Map URLs to pages |
| **Tailwind CSS** | Styling | Utility-first, responsive design |
| **Roles** | Access control | Different users see different things |
| **Components** | UI building blocks | Reusable, maintainable code |
| **Props** | Component inputs | Make components reusable |
| **useState** | Local state | Track changing data in components |
| **Forms** | User input | Validation, error handling, feedback |

---

**Next Steps**: Read the backend documentation to understand how data is stored, secured, and served to this frontend.
