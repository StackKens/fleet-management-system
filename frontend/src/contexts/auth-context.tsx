import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '@/data/types';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 'USR-001', name: 'Fleet Manager', email: 'fleet.manager@fleet.ug', password: 'admin123', role: 'Fleet Manager', department: 'Administration' },
  { id: 'USR-002', name: 'System Administrator', email: 'admin@fleet.ug', password: 'admin123', role: 'Admin', department: 'Administration' },
  { id: 'USR-003', name: 'Dr. Grace Namusoke', email: 'grace.namusoke@fleet.ug', password: 'staff123', role: 'Staff', department: 'Public Health' },
  { id: 'USR-005', name: 'Robert Okello', email: 'robert.okello@fleet.ug', password: 'driver123', role: 'Driver', department: 'Field Operations' },
  { id: 'USR-007', name: 'Transport Supervisor', email: 'supervisor@fleet.ug', password: 'super123', role: 'Supervisor', department: 'Field Operations' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (found) {
      const { password: _, ...authUser } = found;
      setUser(authUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
