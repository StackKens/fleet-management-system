// =============================================================================
// ROUTE GUARD — Frontend Route Protection
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file protects routes based on user permissions. If a user tries to
// access a page they're not allowed to see, they get an "Access Denied" page.
//
// WHY DO WE NEED ROUTE PROTECTION?
// ------------------------------
// Without route protection, any user can type any URL and see any page:
//   - Driver types /admin/users → sees all users (BAD!)
//   - Staff types /vehicles → sees fleet management (BAD!)
//   - Anyone types /settings → sees system settings (BAD!)
//
// With route protection:
//   - Driver types /admin/users → sees "Access Denied" (GOOD!)
//   - Staff types /vehicles → sees "Access Denied" (GOOD!)
//
// IMPORTANT: Frontend protection is NOT security!
// ----------------------------------------------
// A determined user can bypass frontend checks by:
//   - Modifying JavaScript in the browser
//   - Calling the API directly with tools like Postman
//
// REAL security comes from the BACKEND, which must also check permissions.
// This frontend check is for USER EXPERIENCE, not security.
//
// Think of it like a "Staff Only" sign on a door:
//   - It keeps honest people out
//   - A determined person can break the door
//   - You still need a lock (backend) for real security
//
// =============================================================================

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Capability } from '@/data/capabilities';

// =============================================================================
// ROUTE GUARD COMPONENT
// =============================================================================
// This component wraps a route and checks if the user has permission to view it.
//
// HOW IT WORKS:
// 1. Check if user is authenticated (logged in)
// 2. Check if user has the required capability
// 3. If both pass: render the page
// 4. If either fails: render "Access Denied"
//
// PROPS:
// - children: The page content to render if authorized
// - requiredCapabilities: The capability/capabilities needed to view this page
// - fallback: Optional custom "access denied" UI
//
// USAGE:
//   <Route path="/vehicles">
//     <RouteGuard requiredCapabilities={CAPABILITIES.VIEW_VEHICLES}>
//       <Vehicles />
//     </RouteGuard>
//   </Route>
//
// WHY AN ARRAY OF CAPABILITIES?
// ----------------------------
// Some pages can be accessed by multiple roles:
//   - /my-trips can be accessed by Drivers AND Staff
//   - /notifications can be accessed by Drivers, Staff, AND Admin
//
// By accepting an array, we support "any of these capabilities" logic:
//   requiredCapabilities: [CAPABILITIES.VIEW_ASSIGNED_TRIPS, CAPABILITIES.VIEW_OWN_TRIPS]
//   → User needs EITHER view_assigned_trips OR view_own_trips
// =============================================================================

type RouteGuardProps = {
  children: ReactNode;
  requiredCapabilities: Capability | Capability[];
  fallback?: ReactNode;
};

export function RouteGuard({ children, requiredCapabilities, fallback }: RouteGuardProps) {
  const { isAuthenticated, hasCapability } = useAuth();

  // STEP 1: Check if user is logged in
  // WHY? If not logged in, they shouldn't see any protected content
  if (!isAuthenticated) {
    return null; // The ProtectedRoute in App.tsx will redirect to /login
  }

  // STEP 2: Normalize to array
  // WHY? It's easier to work with an array consistently
  // If a single capability was passed, wrap it in an array
  const capabilities = Array.isArray(requiredCapabilities) ? requiredCapabilities : [requiredCapabilities];

  // STEP 3: Check if user has ANY of the required capabilities
  // WHY "any" instead of "all"?
  // - "Any" means: if you have at least one of these, you're in
  // - This supports multiple roles accessing the same page
  // - Example: /my-trips needs view_assigned_trips OR view_own_trips
  const hasAccess = capabilities.some((cap) => hasCapability(cap));

  // STEP 4: Render content or access denied
  if (!hasAccess) {
    // If a custom fallback was provided, use it
    if (fallback) return <>{fallback}</>;
    // Otherwise, show the default access denied page
    return <AccessDenied />;
  }

  // User is authorized — render the page content
  return <>{children}</>;
}

// =============================================================================
// ACCESS DENIED COMPONENT
// =============================================================================
// This is the default "you can't see this page" UI.
//
// WHY A FRIENDLY MESSAGE INSTEAD OF A BLANK PAGE?
// ---------------------------------------------
// - Users understand what happened
// - They know it's a permission issue, not a bug
// - They have a way to navigate back
//
// WHAT SHOULD THIS PAGE INCLUDE?
// -----------------------------
// - Clear message: "You don't have permission to view this page"
// - Explanation: "Your role doesn't have access to this area"
// - Action: "Return to Dashboard" button
// =============================================================================

function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Icon: A "no entry" symbol */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        {/* Clear heading */}
        <h2 className="text-xl font-semibold text-foreground">Access Restricted</h2>

        {/* Explanation */}
        <p className="mt-2 text-sm text-muted-foreground">
          Your role does not have permission to access this area. If you believe this is an error, please contact your system administrator.
        </p>

        {/* Navigation back to safety */}
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

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Route Guard: A wrapper that checks permissions before rendering a page
// 2. Capability-Based Access: Check specific permissions, not just roles
// 3. Frontend vs Backend Security: Frontend is UX, backend is security
// 4. Friendly Error Messages: Tell users what happened and what to do
// 5. Multiple Capabilities: Support "any of these" for shared pages
//
// WHY THIS PATTERN?
// ----------------
// - Security: Users can't see pages they shouldn't
// - UX: Clear feedback instead of blank pages or errors
// - Maintainable: One component handles all route protection
// - Flexible: Easy to add new routes with different permissions
//
// =============================================================================
