import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { VehicleRequest } from '@/data/types';

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
  inspections: ['inspections'] as const,
  issues: ['issues'] as const,
};

export function useVehicles() {
  return useQuery({ queryKey: queryKeys.vehicles, queryFn: async () => (await api.get('/vehicles')).data });
}

export function useVehicle(id: string) {
  return useQuery({ queryKey: queryKeys.vehicle(id), queryFn: async () => (await api.get(`/vehicles/${id}`)).data });
}

export function useVehicleSummary() {
  return useQuery({ queryKey: queryKeys.vehicleSummary, queryFn: async () => (await api.get('/vehicles/summary')).data });
}

export function useDrivers() {
  return useQuery({ queryKey: queryKeys.drivers, queryFn: async () => (await api.get('/drivers')).data });
}

export function useDriver(id: string) {
  return useQuery({ queryKey: queryKeys.driver(id), queryFn: async () => (await api.get(`/drivers/${id}`)).data });
}

export function useRequests() {
  return useQuery({ queryKey: queryKeys.requests, queryFn: async () => (await api.get('/requests')).data });
}

export function useRequest(id: string) {
  return useQuery({ queryKey: queryKeys.request(id), queryFn: async () => (await api.get(`/requests/${id}`)).data });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: VehicleRequest['status']; reason?: string }) =>
      (await api.put(`/requests/${id}/status`, { status, reviewReason: reason })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useTrips() {
  return useQuery({ queryKey: queryKeys.trips, queryFn: async () => (await api.get('/trips')).data });
}

export function useTrip(id: string) {
  return useQuery({ queryKey: queryKeys.trip(id), queryFn: async () => (await api.get(`/trips/${id}`)).data });
}

export function useMaintenanceRecords() {
  return useQuery({ queryKey: queryKeys.maintenance, queryFn: async () => (await api.get('/maintenance')).data });
}

export function useMaintenanceRecord(id: string) {
  return useQuery({ queryKey: queryKeys.maintenanceRecord(id), queryFn: async () => (await api.get(`/maintenance/${id}`)).data });
}

export function useFuelRecords() {
  return useQuery({ queryKey: queryKeys.fuel, queryFn: async () => (await api.get('/fuel')).data });
}

export function useAssignments() {
  return useQuery({ queryKey: queryKeys.assignments, queryFn: async () => (await api.get('/assignments')).data });
}

export function useUsers() {
  return useQuery({ queryKey: queryKeys.users, queryFn: async () => (await api.get('/users')).data });
}

export function useDepartments() {
  return useQuery({ queryKey: queryKeys.departments, queryFn: async () => (await api.get('/departments')).data });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: async () => (await api.get('/notifications')).data });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.put(`/notifications/${id}/read`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

export function useAttentionItems() {
  return useQuery({ queryKey: queryKeys.attention, queryFn: async () => (await api.get('/reports/fleet-status')).data });
}

export function useActivity() {
  return useQuery({ queryKey: queryKeys.activity, queryFn: async () => (await api.get('/reports/fleet-status')).data });
}

export function useExpenses() {
  return useQuery({ queryKey: queryKeys.expenses, queryFn: async () => (await api.get('/reports/expense-summary')).data });
}

export function useInspections() {
  return useQuery({ queryKey: queryKeys.inspections, queryFn: async () => (await api.get('/inspections')).data });
}

export function useIssues() {
  return useQuery({ queryKey: queryKeys.issues, queryFn: async () => (await api.get('/issues')).data });
}

export function useReports() {
  return useQuery({ queryKey: queryKeys.reports, queryFn: async () => (await api.get('/reports')).data });
}
