export type VehicleStatus = 'Available' | 'Assigned' | 'In service' | 'Maintenance';
export type RequestStatus = 'Pending' | 'Approved' | 'Declined';
export type TripStatus = 'On route' | 'Scheduled' | 'Returned';
export type AttentionSeverity = 'high' | 'medium' | 'low';
export type ActivityType = 'assignment' | 'request' | 'maintenance' | 'system';

export type Vehicle = {
  registration: string;
  make: string;
  model: string;
  vehicleType: string;
  status: VehicleStatus;
  mileage: number;
  driver: string;
  lastService: string;
};

export type VehicleSummary = {
  total: number;
  available: number;
  assigned: number;
  inService: number;
  maintenance: number;
};

export type VehicleRequest = {
  id: string;
  requester: string;
  department: string;
  destination: string;
  requestedDate: string;
  status: RequestStatus;
};

export type Trip = {
  id: string;
  vehicle: string;
  driver: string;
  destination: string;
  departure: string;
  expectedReturn: string;
  status: TripStatus;
};

export type AttentionItem = {
  id: string;
  category: string;
  title: string;
  detail: string;
  severity: AttentionSeverity;
};

export type ActivityEvent = {
  id: string;
  message: string;
  timestamp: string;
  type: ActivityType;
};

export const vehicleSummary: VehicleSummary = {
  total: 42,
  available: 18,
  assigned: 17,
  inService: 4,
  maintenance: 3,
};

export const vehicles: Vehicle[] = [
  { registration: 'UAX 482C', make: 'Toyota', model: 'Land Cruiser Prado', vehicleType: 'Field SUV', status: 'Assigned', mileage: 128420, driver: 'Robert Okello', lastService: '12 Jun 2024' },
  { registration: 'UBH 193K', make: 'Toyota', model: 'Hilux Double Cab', vehicleType: 'Pickup', status: 'Available', mileage: 92480, driver: 'Unassigned', lastService: '28 Jun 2024' },
  { registration: 'UAT 706P', make: 'Isuzu', model: 'D-Max', vehicleType: 'Pickup', status: 'In service', mileage: 156210, driver: 'Moses Lwanga', lastService: '03 Jul 2024' },
  { registration: 'UAZ 881M', make: 'Toyota', model: 'Hiace', vehicleType: 'Minibus', status: 'Assigned', mileage: 184700, driver: 'Sarah Atim', lastService: '18 Jun 2024' },
  { registration: 'UBG 442D', make: 'Mitsubishi', model: 'Pajero', vehicleType: 'Field SUV', status: 'Maintenance', mileage: 201300, driver: 'Unassigned', lastService: '30 May 2024' },
];

export const requests: VehicleRequest[] = [
  { id: 'REQ-0248', requester: 'Dr. Grace Namusoke', department: 'Public Health', destination: 'Mbarara District', requestedDate: '18 Jul 2024', status: 'Pending' },
  { id: 'REQ-0247', requester: 'Peter Ouma', department: 'Water & Sanitation', destination: 'Gulu / Lira', requestedDate: '19 Jul 2024', status: 'Approved' },
  { id: 'REQ-0246', requester: 'Agnes Kiconco', department: 'Field Operations', destination: 'Fort Portal', requestedDate: '20 Jul 2024', status: 'Pending' },
  { id: 'REQ-0245', requester: 'David Mugisha', department: 'Programmes', destination: 'Jinja', requestedDate: '22 Jul 2024', status: 'Approved' },
];

export const trips: Trip[] = [
  { id: 'TRP-0914', vehicle: 'UAX 482C', driver: 'Robert Okello', destination: 'Mbale District', departure: 'Today, 06:30', expectedReturn: 'Today, 18:00', status: 'On route' },
  { id: 'TRP-0913', vehicle: 'UAZ 881M', driver: 'Sarah Atim', destination: 'Luwero District', departure: 'Today, 07:00', expectedReturn: 'Today, 17:30', status: 'On route' },
  { id: 'TRP-0915', vehicle: 'UBH 193K', driver: 'Unassigned', destination: 'Mbarara District', departure: 'Tomorrow, 06:00', expectedReturn: 'Tomorrow, 19:00', status: 'Scheduled' },
];

export const attentionItems: AttentionItem[] = [
  { id: 'ATT-01', category: 'Maintenance', title: 'UAT 706P service due', detail: 'Service interval reached at 156,000 km. Book workshop inspection.', severity: 'high' },
  { id: 'ATT-02', category: 'Requests', title: '2 requests need review', detail: 'Pending requests for Mbarara District and Fort Portal.', severity: 'medium' },
  { id: 'ATT-03', category: 'Assignments', title: 'Trip without a driver', detail: 'UBH 193K is scheduled for Mbarara tomorrow at 06:00.', severity: 'medium' },
  { id: 'ATT-04', category: 'Documents', title: '3 insurance renewals approaching', detail: 'Renewals are due within the next 30 days.', severity: 'low' },
];

export const activity: ActivityEvent[] = [
  { id: 'ACT-01', message: 'Robert Okello checked out UAX 482C for Mbale District', timestamp: 'Today, 06:21', type: 'assignment' },
  { id: 'ACT-02', message: 'Request REQ-0247 approved by Fleet Operations', timestamp: 'Today, 05:48', type: 'request' },
  { id: 'ACT-03', message: 'UAT 706P marked for scheduled service', timestamp: 'Yesterday, 16:32', type: 'maintenance' },
  { id: 'ACT-04', message: 'Daily fleet availability snapshot recorded', timestamp: 'Yesterday, 08:00', type: 'system' },
];