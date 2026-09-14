import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FleetShell } from '@/components/fleet-shell';
import Dashboard from '@/pages/dashboard';
import NotFound from '@/pages/not-found';
import Placeholder from '@/pages/placeholder';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return <Dashboard />;
}

function Router() {
  return (
    <FleetShell>
      <RoutedErrorBoundary>
        <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/vehicles">
          <Placeholder title="Vehicles" description="Vehicle records, availability, mileage and operating status will be managed here." phase="Next phase" />
        </Route>
        <Route path="/requests">
          <Placeholder title="Requests" description="Request intake, review and approval workflows will be managed here." phase="Next phase" />
        </Route>
        <Route path="/assignments">
          <Placeholder title="Assignments" description="Vehicle and driver allocation for approved requests will be managed here." phase="Next phase" />
        </Route>
        <Route path="/drivers">
          <Placeholder title="Drivers" description="Driver profiles, licensing and assignment history will be managed here." phase="Next phase" />
        </Route>
        <Route path="/trips">
          <Placeholder title="Trips" description="Trip scheduling, dispatch status and return tracking will be managed here." phase="Next phase" />
        </Route>
        <Route path="/maintenance">
          <Placeholder title="Maintenance" description="Workshop bookings, service history and vehicle readiness will be managed here." phase="Next phase" />
        </Route>
        <Route path="/fuel">
          <Placeholder title="Fuel" description="Fuel issues, consumption records and cost controls will be managed here." phase="Next phase" />
        </Route>
        <Route path="/reports">
          <Placeholder title="Reports" description="Fleet performance and operational reports will be available here." phase="Next phase" />
        </Route>
        <Route path="/users">
          <Placeholder title="Users" description="Workspace users, roles and access controls will be managed here." phase="Next phase" />
        </Route>
        <Route path="/settings">
          <Placeholder title="Settings" description="Fleet policies, operating defaults and workspace settings will be managed here." phase="Next phase" />
        </Route>
        <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </FleetShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
