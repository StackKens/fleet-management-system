import { useAuth } from '@/contexts/auth-context';
import FleetManagerDashboard from './dashboard-fleet-manager';
import DriverDashboard from './dashboard-driver';
import StaffDashboard from './dashboard-staff';
import AdminDashboard from './dashboard-admin';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'Fleet Manager':
    case 'Supervisor':
      return <FleetManagerDashboard />;
    case 'Driver':
      return <DriverDashboard />;
    case 'Staff':
      return <StaffDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return <FleetManagerDashboard />;
  }
}
