import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '@/data/types';
import { getCapabilitiesForRole, type Capability } from '@/data/capabilities';
import { api } from '@/lib/api';

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
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;

      localStorage.setItem('fleet_token', userData.token);

      const capabilities = getCapabilitiesForRole(userData.role);
      const userWithCaps = { ...userData, capabilities };
      setUser(userWithCaps);
      localStorage.setItem('fleet_user', JSON.stringify(userWithCaps));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleet_user');
    localStorage.removeItem('fleet_token');
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
