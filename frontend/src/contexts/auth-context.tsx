// =============================================================================
// AUTH CONTEXT — Authentication & Authorization
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file manages WHO is logged in and WHAT they can do.
// It provides authentication (login/logout) and authorization (capabilities).
//
// WHY REACT CONTEXT?
// ------------------
// React Context lets us share data across ALL components without passing props
// down through every level. This is called "prop drilling" and it's painful.
//
// WITHOUT CONTEXT (prop drilling):
//   <App user={user}>
//     <FleetShell user={user}>
//       <Sidebar user={user}>
//         <NavItem user={user} />  // user passed through 4 levels!
//
// WITH CONTEXT:
//   const { user } = useAuth();  // Any component can access user directly
//
// WHAT IS THE DIFFERENCE BETWEEN AUTHN AND AUTHZ?
// ----------------------------------------------
// - Authentication (AuthN): "Who are you?" → Login with email + password
// - Authorization (AuthZ): "What can you do?" → Check capabilities/permissions
//
// This file handles BOTH.
//
// =============================================================================

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '@/data/types';
import { getCapabilitiesForRole, type Capability } from '@/data/capabilities';

// =============================================================================
// TYPES
// =============================================================================

// AuthUser: The logged-in user's information
// WHY capabilities HERE?
// ---------------------
// We store capabilities with the user so we can check permissions anywhere:
//   if (user.capabilities.includes('manage_vehicles')) { ... }
// This avoids repeated lookups and keeps permissions in one place.
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  capabilities: Capability[]; // What this user is allowed to do
};

// AuthContextType: What the context provides to components
type AuthContextType = {
  user: AuthUser | null;           // Current user (null = not logged in)
  isAuthenticated: boolean;       // Quick check: is someone logged in?
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasCapability: (capability: Capability) => boolean; // Check permission
};

// =============================================================================
// CONTEXT CREATION
// =============================================================================
// createContext creates a "data pipe" that components can read from.
// The null default means "no one is logged in yet".
//
// WHY createContext?
// ------------------
// Without context, you'd have to pass user data through every component:
//   App → FleetShell → Sidebar → NavItem → ...
// With context, any component can just call useAuth() and get the user.
// =============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// MOCK USERS
// =============================================================================
// WHY MOCK USERS?
// --------------
// During development, we don't have a real backend. These mock users let us:
//   - Test the login flow
//   - See role-based UI in action
//   - Develop without a server
//
// WHEN THE BACKEND IS READY:
// -------------------------
// This array will be replaced by an API call:
//   const response = await fetch('/api/auth/login', { ... });
//   const { user, token } = await response.json();
//
// =============================================================================

const MOCK_USERS: (Omit<AuthUser, 'capabilities'> & { password: string })[] = [
  { id: 'USR-001', name: 'Fleet Manager', email: 'fleet.manager@fleet.ug', password: 'admin123', role: 'Fleet Manager', department: 'Administration' },
  { id: 'USR-002', name: 'System Administrator', email: 'admin@fleet.ug', password: 'admin123', role: 'Admin', department: 'Administration' },
  { id: 'USR-003', name: 'Dr. Grace Namusoke', email: 'grace.namusoke@fleet.ug', password: 'staff123', role: 'Staff', department: 'Public Health' },
  { id: 'USR-005', name: 'Robert Okello', email: 'robert.okello@fleet.ug', password: 'driver123', role: 'Driver', department: 'Field Operations' },
  { id: 'USR-007', name: 'Transport Supervisor', email: 'supervisor@fleet.ug', password: 'super123', role: 'Supervisor', department: 'Field Operations' },
];

// =============================================================================
// AUTH PROVIDER
// =============================================================================
// This component wraps the entire app and provides auth data to all children.
//
// WHY A PROVIDER COMPONENT?
// ------------------------
// The Provider pattern lets us:
//   1. Hold state (the current user)
//   2. Provide functions (login, logout)
//   3. Make everything available to all child components
//
// USAGE (in App.tsx):
//   <AuthProvider>
//     <App />
//   </AuthProvider>
//
// Now any component inside <App /> can call useAuth() to get user data.
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // ─── USER STATE ───────────────────────────────────────────────────────────
  // WHY INITIALIZE FROM LOCALSTORAGE?
  // --------------------------------
  // Without this, refreshing the page would log the user out.
  // By reading from localStorage, the session persists across refreshes.
  //
  // WHY A FUNCTION INSTEAD OF A VALUE?
  // ----------------------------------
  // useState(() => { ... }) runs the function once on mount.
  // This is lazy initialization — it only runs when the component first renders.
  // This is more efficient than useState(localStorage.getItem(...)) which would
  // run on every render.
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('fleet_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null; // Corrupted data, treat as logged out
      }
    }
    return null;
  });

  // ─── LOGIN ───────────────────────────────────────────────────────────────
  // WHY ASYNC?
  // ---------
  // Login involves a network call (in production) or a delay (in mock).
  // async/await makes the code read like synchronous code.
  //
  // WHY RETURN BOOLEAN?
  // ------------------
  // The login function returns true/false so the UI can show feedback:
  //   const success = await login(email, password);
  //   if (success) { /* redirect */ } else { /* show error */ }
  //
  // WHEN THE BACKEND IS READY:
  // ------------------------
  // Replace the mock logic with:
  //   const response = await fetch('/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   if (response.ok) {
  //     const { user, token } = await response.json();
  //     setUser(user);
  //     localStorage.setItem('token', token);
  //     return true;
  //   }
  //   return false;
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email (case-insensitive) and password
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (found) {
      // Destructure to separate password from user data
      // WHY? We don't want to store the password in state
      const { password: _, ...authUser } = found;

      // Get capabilities for this user's role
      // WHY? Capabilities determine what the user can see and do
      const capabilities = getCapabilitiesForRole(authUser.role);

      const userWithCaps = { ...authUser, capabilities };
      setUser(userWithCaps);

      // Persist to localStorage so session survives refresh
      localStorage.setItem('fleet_user', JSON.stringify(userWithCaps));
      return true;
    }
    return false;
  };

  // ─── LOGOUT ──────────────────────────────────────────────────────────────
  // WHY REMOVE FROM LOCALSTORAGE?
  // ----------------------------
  // If we don't remove it, the user would still be "logged in" after logout
  // when the page refreshes.
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleet_user');
  };

  // ─── PERMISSION CHECK ─────────────────────────────────────────────────────
  // WHY THIS FUNCTION?
  // -----------------
  // Instead of checking permissions in every component:
  //   if (user.role === 'Admin') { ... }  // Bad: hardcoded role checks
  //
  // We use capabilities:
  //   if (hasCapability('manage_vehicles')) { ... }  // Good: flexible permissions
  //
  // WHY CAPABILITIES OVER ROLES?
  // ---------------------------
  // - Roles are broad: "Admin", "Driver", "Staff"
  // - Capabilities are specific: "manage_vehicles", "view_reports"
  // - You can change permissions without changing code
  // - A role can have different permissions in different contexts
  const hasCapability = (capability: Capability): boolean => {
    if (!user) return false;
    return user.capabilities.includes(capability);
  };

  // ─── PROVIDE TO CHILDREN ──────────────────────────────────────────────────
  // The value object contains everything components need.
  // Any component can now call useAuth() and get user, login, logout, etc.
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasCapability }}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// useAuth HOOK
// =============================================================================
// This is a custom hook that reads from the AuthContext.
//
// WHY A CUSTOM HOOK?
// -----------------
// Instead of every component doing:
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   const { user, login } = context;
//
// We wrap it in a hook:
//   const { user, login } = useAuth();
//
// This is cleaner and handles the error check for you.
//
// USAGE IN COMPONENTS:
// -------------------
//   const { user, isAuthenticated, login, logout, hasCapability } = useAuth();
//
// =============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. React Context: Share data across all components without prop drilling
// 2. Provider Pattern: Wrap children and provide data via context
// 3. Custom Hooks: Reusable logic that can use other hooks
// 4. Authentication: Verifying identity (who are you?)
// 5. Authorization: Checking permissions (what can you do?)
// 6. Capabilities: Fine-grained permissions (e.g., "manage_vehicles")
// 7. localStorage: Browser storage that persists across page refreshes
// 8. Lazy Initialization: useState(() => ...) runs only once on mount
//
// =============================================================================
