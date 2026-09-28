import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FleetShell } from '@/components/fleet-shell';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
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
                <Route path="/vehicles" component={Vehicles} />
                <Route path="/drivers" component={Drivers} />
                <Route path="/requests" component={Requests} />
                <Route path="/assignments" component={Assignments} />
                <Route path="/trips" component={Trips} />
                <Route path="/maintenance" component={Maintenance} />
                <Route path="/fuel" component={Fuel} />
                <Route path="/reports" component={Reports} />
                <Route path="/users" component={Users} />
                <Route path="/settings" component={Settings} />
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
