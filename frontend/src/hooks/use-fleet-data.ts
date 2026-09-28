// =============================================================================
// FLEET DATA HOOKS — Data Access Layer
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file contains React Query hooks that components use to read and write
// fleet data. It's the BRIDGE between the UI and the data store.
//
// WHY A SEPARATE DATA LAYER?
// -------------------------
// Without this file, every component would directly access the store:
//   // In Vehicles.tsx
//   const vehicles = useFleetStore((state) => state.vehicles);
//   const addVehicle = useFleetStore((state) => state.addVehicle);
//
// This works but has problems:
//   - No loading state (how do we show a spinner?)
//   - No error state (how do we show an error message?)
//   - No caching (refetch on every page visit?)
//   - No automatic refetching (stale data?)
//
// With React Query hooks:
//   const { data: vehicles, isLoading, error } = useVehicles();
//   // isLoading → show spinner
//   // error → show error message
//   // data → show the data
//
// WHAT IS REACT QUERY?
// -------------------
// React Query is a data fetching library that provides:
//   - Loading states: Know when data is being fetched
//   - Error states: Know when something went wrong
//   - Caching: Don't refetch data that hasn't changed
//   - Automatic refetching: Keep data fresh
//   - Optimistic updates: Update UI before server confirms
//
// WHY REACT QUERY + ZUSTAND?
// -------------------------
// - Zustand: The source of truth (where data lives)
// - React Query: The async interface (loading, error, caching)
//
// Think of it like a restaurant:
//   - Zustand = The kitchen (where food is prepared/stored)
//   - React Query = The waiter (takes orders, brings food, handles problems)
//
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFleetStore } from '@/stores/fleet-store';
import type { VehicleRequest } from '@/data/types';

// =============================================================================
// QUERY KEYS
// =============================================================================
// WHAT ARE QUERY KEYS?
// -------------------
// Query keys are identifiers for cached data. React Query uses them to:
//   - Store data in cache
//   - Know when to refetch
//   - Invalidate (clear) specific cache entries
//
// WHY AN OBJECT INSTEAD OF STRINGS?
// --------------------------------
// Using an object with named keys prevents typos:
//   queryKeys.vehicles  // Auto-complete helps
//   ['vehicles']         // Typo: ['vehilces'] — no error until runtime
//
// WHY FUNCTIONS FOR SINGLE-ITEM KEYS?
// ----------------------------------
// queryKeys.vehicle(id) creates a unique key for each vehicle:
//   queryKeys.vehicle('VHC-001') → ['vehicles', 'VHC-001']
//   queryKeys.vehicle('VHC-002') → ['vehicles', 'VHC-002']
//
// This way, each vehicle's data is cached separately.
// =============================================================================

export const queryKeys = {
  // Collection keys (for lists)
  vehicles: ['vehicles'] as const,
  drivers: ['drivers'] as const,
  requests: ['requests'] as const,
  trips: ['trips'] as const,
  maintenance: ['maintenance'] as const,
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

  // Single-item keys (functions that take an ID)
  vehicle: (id: string) => ['vehicles', id] as const,
  driver: (id: string) => ['drivers', id] as const,
  request: (id: string) => ['requests', id] as const,
  trip: (id: string) => ['trips', id] as const,
  maintenanceRecord: (id: string) => ['maintenance', id] as const,
  vehicleSummary: ['vehicle-summary'] as const,
};

// =============================================================================
// SIMULATED DELAY
// =============================================================================
// WHY SIMULATE A DELAY?
// --------------------
// In development, data comes instantly from the Zustand store.
// But in production, data comes from a server over the network (100-500ms).
//
// By adding a small delay, we can:
//   - Test loading states (spinners, skeletons)
//   - Develop UI that handles async data properly
//   - Catch race conditions early
//
// REMOVE THIS when connecting to a real backend.
// =============================================================================

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// VEHICLE HOOKS
// =============================================================================

// useVehicles: Get all vehicles
// WHY useQuery?
// -------------
// useQuery is for READING data. It handles:
//   - Loading state (isLoading)
//   - Error state (isError, error)
//   - Caching (don't refetch if data is fresh)
//   - Automatic refetching (keep data fresh)
//
// THE PATTERN:
// -----------
// const { data, isLoading, error } = useQuery({
//   queryKey: ['vehicles'],        // Cache key
//   queryFn: async () => { ... }, // How to fetch data
// });
//
// WHEN THE BACKEND IS READY:
// -------------------------
// Replace the queryFn body with:
//   const response = await fetch('/api/vehicles');
//   return response.json();
//
export function useVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: async () => {
      await delay(); // Remove in production
      return useFleetStore.getState().vehicles;
    },
  });
}

// useVehicle: Get a single vehicle by ID
// WHY A FUNCTION INSTEAD OF A HOOK?
// --------------------------------
// Hooks can't be called conditionally or in loops. By returning a function,
// the caller decides when to fetch:
//   const { data: vehicle } = useVehicle(vehicleId);
//
// The queryKey includes the ID, so each vehicle is cached separately.
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

// useVehicleSummary: Get fleet statistics
// WHY A SEPARATE HOOK?
// -------------------
// The summary is COMPUTED from vehicles. It's not stored separately.
// By making it a hook, we get caching and loading states for free.
export function useVehicleSummary() {
  return useQuery({
    queryKey: queryKeys.vehicleSummary,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().getVehicleSummary();
    },
  });
}

// =============================================================================
// DRIVER HOOKS
// =============================================================================

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

// =============================================================================
// REQUEST HOOKS
// =============================================================================

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

// useUpdateRequestStatus: Update a request's status (approve/decline)
// WHY useMutation INSTEAD OF useQuery?
// -----------------------------------
// useQuery is for READING data (GET requests).
// useMutation is for WRITING data (POST, PUT, PATCH, DELETE).
//
// useMutation provides:
//   - isPending: Is the mutation in progress? (show loading state)
//   - isError: Did it fail? (show error message)
//   - isSuccess: Did it succeed? (show success message, close modal)
//   - mutate: Function to trigger the mutation
//
// THE PATTERN:
// -----------
// const updateStatus = useUpdateRequestStatus();
// updateStatus.mutate(
//   { id: 'REQ-0248', status: 'Approved' },
//   {
//     onSuccess: () => { /* close modal, show toast */ },
//     onError: () => { /* show error toast */ },
//   }
// );
//
// WHY INVALIDATE QUERIES AFTER MUTATION?
// --------------------------------------
// After updating a request, the cached data is stale.
// Invalidation tells React Query: "This data changed, refetch it."
// This keeps the UI in sync with the store.
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reviewedBy, reason }: { id: string; status: VehicleRequest['status']; reviewedBy?: string; reason?: string }) => {
      await delay();
      useFleetStore.getState().updateRequestStatus(id, status, reviewedBy, reason);
      return useFleetStore.getState().requests.find((r) => r.id === id);
    },
    onSuccess: () => {
      // Invalidate (clear cache for) requests and notifications
      // This forces React Query to refetch the data
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// =============================================================================
// TRIP HOOKS
// =============================================================================

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

// =============================================================================
// MAINTENANCE HOOKS
// =============================================================================

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

// =============================================================================
// FUEL HOOKS
// =============================================================================

export function useFuelRecords() {
  return useQuery({
    queryKey: queryKeys.fuel,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().fuelRecords;
    },
  });
}

// =============================================================================
// ASSIGNMENT HOOKS
// =============================================================================

export function useAssignments() {
  return useQuery({
    queryKey: queryKeys.assignments,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().assignments;
    },
  });
}

// =============================================================================
// USER HOOKS
// =============================================================================
// WHY MAP DRIVERS TO USERS?
// -----------------------
// The User type and Driver type are similar but not identical.
// The frontend needs User objects (with role, lastLogin, etc.).
// The store has Driver objects (with licenseNumber, rating, etc.).
//
// This hook maps Driver data to User format:
//   driver → { id, name, email, role, department, phone, status, lastLogin, joinDate }
//
// WHEN THE BACKEND IS READY:
// -------------------------
// This hook will fetch from /api/users instead of mapping drivers.
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

// =============================================================================
// DEPARTMENT HOOKS
// =============================================================================

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().departments ?? [];
    },
  });
}

// =============================================================================
// NOTIFICATION HOOKS
// =============================================================================

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().notifications;
    },
  });
}

// useMarkNotificationRead: Mark a single notification as read
// WHY A MUTATION?
// --------------
// Marking as read is a WRITE operation (it changes data).
// We use useMutation for all write operations.
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(100);
      useFleetStore.getState().markNotificationRead(id);
      return id;
    },
    onSuccess: () => {
      // Refetch notifications to update the unread count
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// =============================================================================
// ATTENTION ITEMS
// =============================================================================
// WHAT ARE ATTENTION ITEMS?
// ------------------------
// Attention items are alerts that need the Fleet Manager's attention:
//   - "Vehicle UAT 706P is due for service"
//   - "Insurance for UBG 442D expires in 15 days"
//   - "Driver James Kato's license expires soon"
//
// These are computed from the data (vehicles, drivers) and shown on the dashboard.
// =============================================================================

export function useAttentionItems() {
  return useQuery({
    queryKey: queryKeys.attention,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().attentionItems ?? [];
    },
  });
}

// =============================================================================
// ACTIVITY HOOKS
// =============================================================================

export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().activity ?? [];
    },
  });
}

// =============================================================================
// EXPENSE HOOKS
// =============================================================================

export function useExpenses() {
  return useQuery({
    queryKey: queryKeys.expenses,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().expenses ?? [];
    },
  });
}

// =============================================================================
// INSPECTION HOOKS
// =============================================================================

export function useInspections() {
  return useQuery({
    queryKey: queryKeys.inspections,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().inspections ?? [];
    },
  });
}

// =============================================================================
// ISSUE HOOKS
// =============================================================================

export function useIssues() {
  return useQuery({
    queryKey: queryKeys.issues,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().issues ?? [];
    },
  });
}

// =============================================================================
// REPORT HOOKS
// =============================================================================

export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: async () => {
      await delay();
      return useFleetStore.getState().reports ?? [];
    },
  });
}

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. useQuery: For READING data (GET)
//    - Returns: { data, isLoading, isError, error }
//    - Caches data automatically
//    - Refetches when data is stale
//
// 2. useMutation: For WRITING data (POST, PUT, PATCH, DELETE)
//    - Returns: { mutate, isPending, isError, isSuccess }
//    - Doesn't cache (each call is unique)
//    - Can invalidate queries after success
//
// 3. queryClient: The cache manager
//    - invalidateQueries: Clear cache and refetch
//    - setQueryData: Manually update cache
//    - getQueryData: Read cached data
//
// 4. Query Keys: Unique identifiers for cached data
//    - Collections: ['vehicles']
//    - Single items: ['vehicles', 'VHC-001']
//    - Invalidation: Clear all keys starting with ['vehicles']
//
// 5. Why This Pattern?
//    - Components don't need to know HOW data is fetched
//    - Loading/error states are handled automatically
//    - Caching reduces unnecessary network requests
//    - Easy to swap mock data for real API calls
//
// =============================================================================
