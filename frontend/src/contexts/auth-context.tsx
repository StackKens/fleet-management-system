import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '@/data/types';
import { getCapabilitiesForRole, type Capability } from '@/data/capabilities';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  capabilities: Capability[];
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasCapability: (capability: Capability) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: (Omit<AuthUser, 'capabilities'> & { password: string })[] = [
  { id: 'USR-001', name: 'Fleet Manager', email: 'fleet.manager@fleet.ug', password: 'admin123', role: 'Fleet Manager', department: 'Administration' },
  { id: 'USR-002', name: 'System Administrator', email: 'admin@fleet.ug', password: 'admin123', role: 'Admin', department: 'Administration' },
  { id: 'USR-003', name: 'Dr. Grace Namusoke', email: 'grace.namusoke@fleet.ug', password: 'staff123', role: 'Staff', department: 'Public Health' },
  { id: 'USR-005', name: 'Robert Okello', email: 'robert.okello@fleet.ug', password: 'driver123', role: 'Driver', department: 'Field Operations' },
  { id: 'USR-007', name: 'Transport Supervisor', email: 'supervisor@fleet.ug', password: 'super123', role: 'Supervisor', department: 'Field Operations' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('fleet_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (found) {
      const { password: _, ...authUser } = found;
      const capabilities = getCapabilitiesForRole(authUser.role);
      const userWithCaps = { ...authUser, capabilities };
      setUser(userWithCaps);
      localStorage.setItem('fleet_user', JSON.stringify(userWithCaps));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleet_user');
  };

  const hasCapability = (capability: Capability): boolean => {
    if (!user) return false;
    return user.capabilities.includes(capability);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasCapability }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
