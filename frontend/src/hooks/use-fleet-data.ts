import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFleetStore } from '@/stores/fleet-store';
import type { VehicleRequest } from '@/data/types';

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const queryKeys = {
  vehicles: ['vehicles'] as const,
  vehicle: (id: string) => ['vehicles', id] as const,
  vehicleSummary: ['vehicle-summary'] as const,
  drivers: ['drivers'] as const,
  driver: (id: string) => ['drivers', id] as const,
  requests: ['requests'] as const,
  request: (id: string) => ['requests', id] as const,
  trips: ['trips'] as const,
  trip: (id: string) => ['trips', id] as const,
  maintenance: ['maintenance'] as const,
  maintenanceRecord: (id: string) => ['maintenance', id] as const,
  fuel: ['fuel'] as const,
  assignments: ['assignments'] as const,
  users: ['users'] as const,
  departments: ['departments'] as const,
  notifications: ['notifications'] as const,
  attention: ['attention'] as const,
  activity: ['activity'] as const,
  expenses: ['expenses'] as const,
  reports: ['reports'] as const,
};

// ─── Simulated delay ────────────────────────────────────────────────────────
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Vehicle Hooks ──────────────────────────────────────────────────────────
export function useVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().vehicles;
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: queryKeys.vehicle(id),
    queryFn: async () => {
      await delay();
      const vehicle = useFleetStore.getState().vehicles.find((v) => v.id === id);
      if (!vehicle) throw new Error('Vehicle not found');
      return vehicle;
    },
  });
}

export function useVehicleSummary() {
  return useQuery({
    queryKey: queryKeys.vehicleSummary,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().getVehicleSummary();
    },
  });
}

// ─── Driver Hooks ───────────────────────────────────────────────────────────
export function useDrivers() {
  return useQuery({
    queryKey: queryKeys.drivers,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().drivers;
    },
  });
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: queryKeys.driver(id),
    queryFn: async () => {
      await delay();
      const driver = useFleetStore.getState().drivers.find((d) => d.id === id);
      if (!driver) throw new Error('Driver not found');
      return driver;
    },
  });
}

// ─── Request Hooks ──────────────────────────────────────────────────────────
export function useRequests() {
  return useQuery({
    queryKey: queryKeys.requests,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().requests;
    },
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.request(id),
    queryFn: async () => {
      await delay();
      const request = useFleetStore.getState().requests.find((r) => r.id === id);
      if (!request) throw new Error('Request not found');
      return request;
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reviewedBy, reason }: { id: string; status: VehicleRequest['status']; reviewedBy?: string; reason?: string }) => {
      await delay();
      useFleetStore.getState().updateRequestStatus(id, status, reviewedBy, reason);
      return useFleetStore.getState().requests.find((r) => r.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// ─── Trip Hooks ─────────────────────────────────────────────────────────────
export function useTrips() {
  return useQuery({
    queryKey: queryKeys.trips,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().trips;
    },
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: queryKeys.trip(id),
    queryFn: async () => {
      await delay();
      const trip = useFleetStore.getState().trips.find((t) => t.id === id);
      if (!trip) throw new Error('Trip not found');
      return trip;
    },
  });
}

// ─── Maintenance Hooks ──────────────────────────────────────────────────────
export function useMaintenanceRecords() {
  return useQuery({
    queryKey: queryKeys.maintenance,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().maintenanceRecords;
    },
  });
}

export function useMaintenanceRecord(id: string) {
  return useQuery({
    queryKey: queryKeys.maintenanceRecord(id),
    queryFn: async () => {
      await delay();
      const record = useFleetStore.getState().maintenanceRecords.find((m) => m.id === id);
      if (!record) throw new Error('Maintenance record not found');
      return record;
    },
  });
}

// ─── Fuel Hooks ─────────────────────────────────────────────────────────────
export function useFuelRecords() {
  return useQuery({
    queryKey: queryKeys.fuel,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().fuelRecords;
    },
  });
}

// ─── Assignment Hooks ───────────────────────────────────────────────────────
export function useAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().assignments;
    },
  });
}

// ─── User Hooks ─────────────────────────────────────────────────────────────
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      await delay();
      const drivers = useFleetStore.getState().drivers;
      return drivers.map((d) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        role: (d.department === 'Administration' ? 'Admin' : d.department === 'Field Operations' ? 'Driver' : 'Staff') as 'Admin' | 'Fleet Manager' | 'Driver' | 'Staff' | 'Supervisor',
        department: d.department,
        phone: d.phone,
        status: d.status === 'Active' ? 'Active' as const : 'Inactive' as const,
        lastLogin: 'Today, 09:00',
        joinDate: d.joinDate,
      }));
    },
  });
}

// ─── Department Hooks ───────────────────────────────────────────────────────
export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().departments ?? [];
    },
  });
}

// ─── Notification Hooks ─────────────────────────────────────────────────────
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().notifications;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(100);
      useFleetStore.getState().markNotificationRead(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// ─── Attention Hooks ────────────────────────────────────────────────────────
export function useAttentionItems() {
  return useQuery({
    queryKey: queryKeys.attention,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().attentionItems ?? [];
    },
  });
}

// ─── Activity Hooks ─────────────────────────────────────────────────────────
export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().activity ?? [];
    },
  });
}

// ─── Expense Hooks ──────────────────────────────────────────────────────────
export function useExpenses() {
  return useQuery({
    queryKey: queryKeys.expenses,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().expenses ?? [];
    },
  });
}

// ─── Inspection Hooks ───────────────────────────────────────────────────────
export function useInspections() {
  return useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().inspections;
    },
  });
}

// ─── Issue Hooks ────────────────────────────────────────────────────────────
export function useIssues() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().issues;
    },
  });
}

// ─── Report Hooks ───────────────────────────────────────────────────────────
export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().reports ?? [];
    },
  });
}
