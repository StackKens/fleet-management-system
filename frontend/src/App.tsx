import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FleetShell } from '@/components/fleet-shell';
import { RouteGuard } from '@/components/route-guard';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { CAPABILITIES } from '@/data/capabilities';
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
import Roles from '@/pages/roles';
import Departments from '@/pages/departments';
import AuditLogs from '@/pages/audit-logs';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from 'wouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function Home() {
  return <Dashboard />;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function LoginRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <Login />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginRoute} />
      <Route>
        <ProtectedRoute>
          <FleetShell>
            <RoutedErrorBoundary>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/dashboard" component={Dashboard} />

                {/* Fleet Manager / Supervisor routes */}
                <Route path="/vehicles">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_VEHICLES}>
                    <Vehicles />
                  </RouteGuard>
                </Route>
                <Route path="/drivers">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_DRIVERS}>
                    <Drivers />
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

                {/* Driver routes */}
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

                {/* Staff routes */}
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

                {/* Shared routes - accessible by Driver, Staff, Admin */}
                <Route path="/notifications">
                  <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_OWN_NOTIFICATIONS}>
                    <Notifications />
                  </RouteGuard>
                </Route>

                {/* Admin routes */}
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
                  <RouteGuard requiredCapabilities={[CAPABILITIES.MANAGE_DEPARTMENTS]}>
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

                <Route component={NotFound} />
              </Switch>
            </RoutedErrorBoundary>
          </FleetShell>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

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
