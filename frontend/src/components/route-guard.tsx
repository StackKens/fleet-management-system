import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Capability } from '@/data/capabilities';

type RouteGuardProps = {
  children: ReactNode;
  requiredCapabilities: Capability | Capability[];
  fallback?: ReactNode;
};

export function RouteGuard({ children, requiredCapabilities, fallback }: RouteGuardProps) {
  const { isAuthenticated, hasCapability } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const capabilities = Array.isArray(requiredCapabilities) ? requiredCapabilities : [requiredCapabilities];
  const hasAccess = capabilities.some((cap) => hasCapability(cap));

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return <AccessDenied />;
  }

  return <>{children}</>;
}

function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Access Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role does not have permission to access this area. If you believe this is an error, please contact your system administrator.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
