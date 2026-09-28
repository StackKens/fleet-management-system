// =============================================================================
// APP — Root Component & Application Entry Point
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This is the ROOT component of the entire application. It's the first thing
// that renders when the app starts. Think of it as the "front door" —
// everything else is inside.
//
// WHAT DOES IT DO?
// ---------------
// 1. Sets up PROVIDERS (context that wraps the whole app)
// 2. Defines ROUTES (URL → page mapping)
// 3. Handles AUTHENTICATION (redirect to login if not logged in)
// 4. Handles ERRORS (error boundary catches crashes)
//
// THE PROVIDER HIERARCHY:
// ----------------------
// Providers are like nesting dolls — each one wraps the next:
//
//   QueryClientProvider     ← React Query (data fetching)
//     └─ AuthProvider       ← Auth context (who is logged in?)
//       └─ TooltipProvider  ← Tooltip context (hover tooltips)
//         └─ WouterRouter  ← Routing (URL → page)
//           └─ Router       ← Route definitions
//             └─ Toaster   ← Toast notifications
//
// WHY THIS ORDER?
// --------------
// - QueryClientProvider must be first (other providers use React Query)
// - AuthProvider must be inside QueryClientProvider (auth uses React Query)
// - WouterRouter must be inside AuthProvider (routes check auth)
// - Toaster must be inside everything (toasts need auth for user-specific messages)
//
// =============================================================================

import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FleetShell } from '@/components/fleet-shell';
import { RouteGuard } from '@/components/route-guard';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { CAPABILITIES } from '@/data/capabilities';

// =============================================================================
// PAGE IMPORTS
// =============================================================================
// Each page is a component that renders when its route is matched.
// We import them all here so the router can reference them.
//
// WHY IMPORT ALL PAGES HERE?
// ------------------------
// - Centralized: All routes are defined in one place
// - Easy to find: "Where is the Vehicles route?" → Look here
// - Lazy loading: Could be optimized with React.lazy() for code splitting
// =============================================================================

import Dashboard from '@/pages/dashboard';
import Vehicles from '@/pages/vehicles';
import Drivers from '@/pages/drivers';
import Requests from '@/pages/requests';
import Assignments from '@/pages/assignments';
import Trips from '@/pages/trips';
import Maintenance from '@/pages/maintenance';
import Fuel from '@/pages/fuel';
import Reports from '@/pages/reports';
import Users from '@/pages/users';
import Settings from '@/pages/settings';
import Login from '@/pages/login';
import NotFound from '@/pages/not-found';
import MyVehicle from '@/pages/my-vehicle';
import MyTrips from '@/pages/my-trips';
import Inspections from '@/pages/inspections';
import MyFuel from '@/pages/my-fuel';
import ReportIssue from '@/pages/report-issue';
import Notifications from '@/pages/notifications';
import RequestVehicle from '@/pages/request-vehicle';
import MyRequests from '@/pages/my-requests';
import VehicleDetail from '@/pages/vehicle-detail';
import DriverDetail from '@/pages/driver-detail';
import Profile from '@/pages/profile';
import Roles from '@/pages/roles';
import Departments from '@/pages/departments';
import AuditLogs from '@/pages/audit-logs';

// =============================================================================
// ROUTER IMPORTS
// =============================================================================
// We use Wouter, a lightweight routing library.
//
// WHY WOUTER OVER REACT ROUTER?
// ----------------------------
// - Smaller: ~2KB vs React Router's ~15KB
// - Simpler: Less boilerplate, easier to understand
// - TypeScript-first: Excellent type inference
// - Hooks-based: useLocation(), useRoute(), etc.
//
// KEY COMPONENTS:
// - Router: The routing context provider
// - Route: Defines a URL → component mapping
// - Switch: Renders only the FIRST matching route
// - Redirect: Navigates to a different URL
// =============================================================================

import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from 'wouter';

// =============================================================================
// QUERY CLIENT CONFIGURATION
// =============================================================================
// React Query manages data fetching, caching, and synchronization.
//
// WHY THESE SETTINGS?
// ------------------
// - staleTime: 30000 (30 seconds)
//   Data is considered "fresh" for 30 seconds. Within that time, React Query
//   returns cached data without refetching. This reduces unnecessary requests.
//
// - retry: 1
//   If a request fails, retry once before giving up. This handles temporary
//   network issues without overwhelming the server.
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // Data is fresh for 30 seconds
      retry: 1,         // Retry failed requests once
    },
  },
});

// =============================================================================
// HOME COMPONENT
// =============================================================================
// The "/" route redirects to the dashboard.
// WHY? Users expect the home page to be the dashboard.
// =============================================================================

function Home() {
  return <Dashboard />;
}

// =============================================================================
// PROTECTED ROUTE WRAPPER
// =============================================================================
// This component wraps all protected routes. It checks if the user is logged in.
//
// WHY A WRAPPER INSTEAD OF CHECKING IN EACH ROUTE?
// ----------------------------------------------
// - DRY: Write the auth check once, apply to all routes
// - Consistent: All protected routes behave the same
// - Easy to change: Change auth logic in one place
//
// WHAT HAPPENS IF NOT AUTHENTICATED?
// --------------------------------
// The user is redirected to /login. After successful login, they're redirected
// back to /dashboard.
// =============================================================================

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

// =============================================================================
// LOGIN ROUTE WRAPPER
// =============================================================================
// This component handles the /login route.
//
// WHY A SPECIAL WRAPPER?
// ---------------------
// - If already logged in: redirect to /dashboard (no need to see login)
// - If not logged in: show the login page
//
// WHY NOT JUST SHOW LOGIN?
// -----------------------
// If a logged-in user visits /login, they should go to the dashboard instead.
// This is standard UX for login pages.
// =============================================================================

function LoginRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <Login />;
}

// =============================================================================
// ROUTER COMPONENT
// =============================================================================
// This is where all routes are defined. It's the "map" of the application.
//
// ROUTE STRUCTURE:
// ---------------
// /login                    → Login page (public)
// /                         → Dashboard (redirects to /dashboard)
// /dashboard                → Role-based dashboard (protected)
// /vehicles                 → Vehicle list (Fleet Manager, Supervisor)
// /vehicles/:id             → Vehicle detail (Fleet Manager, Supervisor)
// /drivers                  → Driver list (Fleet Manager, Supervisor)
// /drivers/:id              → Driver detail (Fleet Manager, Supervisor)
// /requests                 → Vehicle requests (Fleet Manager, Supervisor)
// /assignments              → Assignments (Fleet Manager, Supervisor)
// /trips                    → Trips (Fleet Manager, Supervisor)
// /maintenance              → Maintenance (Fleet Manager, Supervisor)
// /fuel                     → Fuel records (Fleet Manager, Supervisor)
// /reports                  → Reports (Fleet Manager, Supervisor)
// /my-vehicle               → Driver's vehicle (Driver)
// /my-trips                 → My trips (Driver, Staff)
// /inspections              → Submit inspections (Driver)
// /my-fuel                  → Submit fuel records (Driver)
// /report-issue             → Report issues (Driver)
// /request-vehicle          → Request a vehicle (Staff)
// /my-requests              → My requests (Staff)
// /notifications            → Notifications (all roles)
// /profile                  → User profile (all roles)
// /users                    → User management (Admin)
// /roles                    → Roles & permissions (Admin)
// /departments              → Department management (Admin, Fleet Manager)
// /audit-logs               → Audit logs (Admin)
// /settings                 → System settings (Admin)
// *                         → 404 Not Found (catch-all)
//
// WHY ROUTE GUARDS?
// ----------------
// Each protected route is wrapped in <RouteGuard> which checks permissions.
// This ensures users only see pages they're authorized for.
// =============================================================================

function Router() {
  return (
    <Switch>
      {/* PUBLIC ROUTES */}
      <Route path="/login" component={LoginRoute} />

      {/* PROTECTED ROUTES */}
      <Route>
        <ProtectedRoute>
          <FleetShell>
            <RoutedErrorBoundary>
              <Switch>
                {/* HOME & DASHBOARD */}
                <Route path="/" component={Home} />
                <Route path="/dashboard" component={Dashboard} />

                {/* FLEET MANAGER / SUPERVISOR ROUTES */}
                <Route path="/vehicles">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_VEHICLES}>
                    <Vehicles />
                  </RouteGuard>
                </Route>
                <Route path="/vehicles/:id">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_VEHICLES}>
                    <VehicleDetail />
                  </RouteGuard>
                </Route>
                <Route path="/drivers">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_DRIVERS}>
                    <Drivers />
                  </RouteGuard>
                </Route>
                <Route path="/drivers/:id">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_DRIVERS}>
                    <DriverDetail />
                  </RouteGuard>
                </Route>
                <Route path="/requests">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_REQUESTS}>
                    <Requests />
                  </RouteGuard>
                </Route>
                <Route path="/assignments">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_ASSIGNMENTS}>
                    <Assignments />
                  </RouteGuard>
                </Route>
                <Route path="/trips">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_TRIPS}>
                    <Trips />
                  </RouteGuard>
                </Route>
                <Route path="/maintenance">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_MAINTENANCE}>
                    <Maintenance />
                  </RouteGuard>
                </Route>
                <Route path="/fuel">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_FUEL}>
                    <Fuel />
                  </RouteGuard>
                </Route>
                <Route path="/reports">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_REPORTS}>
                    <Reports />
                  </RouteGuard>
                </Route>

                {/* DRIVER ROUTES */}
                <Route path="/my-vehicle">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_ASSIGNED_VEHICLE}>
                    <MyVehicle />
                  </RouteGuard>
                </Route>
                <Route path="/my-trips">
                  <RouteGuard requiredCapabilities={[CAPABILITIES.VIEW_ASSIGNED_TRIPS, CAPABILITIES.VIEW_OWN_TRIPS]}>
                    <MyTrips />
                  </RouteGuard>
                </Route>
                <Route path="/inspections">
                  <RouteGuard requiredCapabilities={CAPABILITIES.SUBMIT_INSPECTION}>
                    <Inspections />
                  </RouteGuard>
                </Route>
                <Route path="/my-fuel">
                  <RouteGuard requiredCapabilities={CAPABILITIES.SUBMIT_FUEL}>
                    <MyFuel />
                  </RouteGuard>
                </Route>
                <Route path="/report-issue">
                  <RouteGuard requiredCapabilities={CAPABILITIES.REPORT_VEHICLE_ISSUE}>
                    <ReportIssue />
                  </RouteGuard>
                </Route>

                {/* STAFF ROUTES */}
                <Route path="/request-vehicle">
                  <RouteGuard requiredCapabilities={CAPABILITIES.CREATE_VEHICLE_REQUEST}>
                    <RequestVehicle />
                  </RouteGuard>
                </Route>
                <Route path="/my-requests">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_OWN_REQUESTS}>
                    <MyRequests />
                  </RouteGuard>
                </Route>

                {/* SHARED ROUTES (accessible by multiple roles) */}
                <Route path="/notifications">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_OWN_NOTIFICATIONS}>
                    <Notifications />
                  </RouteGuard>
                </Route>
                <Route path="/profile">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_OWN_NOTIFICATIONS}>
                    <Profile />
                  </RouteGuard>
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/users">
                  <RouteGuard requiredCapabilities={CAPABILITIES.MANAGE_USERS}>
                    <Users />
                  </RouteGuard>
                </Route>
                <Route path="/roles">
                  <RouteGuard requiredCapabilities={CAPABILITIES.MANAGE_ROLES}>
                    <Roles />
                  </RouteGuard>
                </Route>
                <Route path="/departments">
                  <RouteGuard requiredCapabilities={CAPABILITIES.MANAGE_DEPARTMENTS}>
                    <Departments />
                  </RouteGuard>
                </Route>
                <Route path="/audit-logs">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_AUDIT_LOGS}>
                    <AuditLogs />
                  </RouteGuard>
                </Route>
                <Route path="/settings">
                  <RouteGuard requiredCapabilities={CAPABILITIES.MANAGE_SYSTEM_SETTINGS}>
                    <Settings />
                  </RouteGuard>
                </Route>

                {/* 404 CATCH-ALL */}
                <Route component={NotFound} />
              </Switch>
            </RoutedErrorBoundary>
          </FleetShell>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

// =============================================================================
// ROUTE ERROR BOUNDARY
// =============================================================================
// This component wraps the routes and catches any rendering errors.
//
// WHY AN ERROR BOUNDARY?
// ---------------------
// Without it, a single error in any page crashes the entire app.
// With it, the error is caught and a friendly message is shown.
//
// WHY resetKey={location}?
// -----------------------
// When the route changes, the error boundary resets.
// This means: if you encounter an error on one page, navigating to another
// page will clear the error and render the new page normally.
//
// WITHOUT resetKey:
//   Error on /vehicles → error boundary shows → navigate to /drivers →
//   error boundary still shows (stuck!)
//
// WITH resetKey:
//   Error on /vehicles → error boundary shows → navigate to /drivers →
//   error boundary resets → /drivers renders normally
// =============================================================================

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

// =============================================================================
// APP COMPONENT (ROOT)
// =============================================================================
// This is the root component that React renders into the DOM.
//
// THE PROVIDER TREE:
// ----------------
// <QueryClientProvider>     ← React Query (data fetching)
//   <AuthProvider>         ← Auth context (who is logged in?)
//     <TooltipProvider>     ← Tooltip context (hover tooltips)
//       <WouterRouter>      ← Routing (URL → page)
//         <Router />       ← Route definitions
//       <Toaster />         ← Toast notifications
//
// WHY THIS STRUCTURE?
// ------------------
// Each provider wraps the next, so inner components can access outer context.
// For example:
//   - Router can use useAuth() because it's inside AuthProvider
//   - Pages can use useQuery() because they're inside QueryClientProvider
//   - Toaster can use useAuth() because it's inside AuthProvider
// =============================================================================

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Root Component: The top-level component that renders everything
// 2. Providers: Context wrappers that share data across the app
// 3. Routing: Maps URLs to page components
// 4. Route Protection: Checks permissions before rendering pages
// 5. Error Boundary: Catches rendering errors gracefully
// 6. Query Client: Configures React Query (caching, retrying)
// 7. Switch: Renders only the first matching route
// 8. Redirect: Navigates to a different URL programmatically
//
// WHY THIS ARCHITECTURE?
// ---------------------
// - Separation of concerns: Routing, auth, data, and UI are separate
// - Maintainability: Easy to add new routes or change existing ones
// - Security: Every protected route checks permissions
// - UX: Friendly error handling and loading states
// - Scalability: Easy to add new pages, roles, and permissions
//
// =============================================================================
