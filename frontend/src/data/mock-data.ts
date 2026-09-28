import type {
  ActivityEvent,
  AppNotification,
  Assignment,
  AttentionItem,
  Department,
  Driver,
  Expense,
  FuelRecord,
  MaintenanceRecord,
  Report,
  Trip,
  User,
  Vehicle,
  VehicleRequest,
  VehicleSummary,
} from './types';

// ─── Vehicle Summary ─────────────────────────────────────────────────────────
export const vehicleSummary: VehicleSummary = {
  total: 42,
  available: 18,
  assigned: 17,
  inService: 4,
  maintenance: 3,
};

// ─── Vehicles ───────────────────────────────────────────────────────────────
export const vehicles: Vehicle[] = [
  { id: 'VHC-001', registration: 'UAX 482C', make: 'Toyota', model: 'Land Cruiser Prado', vehicleType: 'Field SUV', year: 2021, color: 'White', fuelType: 'Diesel', status: 'Assigned', mileage: 128420, driver: 'Robert Okello', department: 'Field Operations', lastService: '12 Jun 2024', nextService: '12 Sep 2024', insuranceExpiry: '15 Jan 2025', inspectionExpiry: '20 Mar 2025' },
  { id: 'VHC-002', registration: 'UBH 193K', make: 'Toyota', model: 'Hilux Double Cab', vehicleType: 'Pickup', year: 2020, color: 'Silver', fuelType: 'Diesel', status: 'Available', mileage: 92480, driver: null, department: 'Water & Sanitation', lastService: '28 Jun 2024', nextService: '28 Sep 2024', insuranceExpiry: '01 Feb 2025', inspectionExpiry: '10 Apr 2025' },
  { id: 'VHC-003', registration: 'UAT 706P', make: 'Isuzu', model: 'D-Max', vehicleType: 'Pickup', year: 2019, color: 'Blue', fuelType: 'Diesel', status: 'In service', mileage: 156210, driver: 'Moses Lwanga', department: 'Public Health', lastService: '03 Jul 2024', nextService: '03 Oct 2024', insuranceExpiry: '20 Dec 2024', inspectionExpiry: '15 Feb 2025' },
  { id: 'VHC-004', registration: 'UAZ 881M', make: 'Toyota', model: 'Hiace', vehicleType: 'Minibus', year: 2022, color: 'White', fuelType: 'Petrol', status: 'Assigned', mileage: 184700, driver: 'Sarah Atim', department: 'Programmes', lastService: '18 Jun 2024', nextService: '18 Sep 2024', insuranceExpiry: '10 Mar 2025', inspectionExpiry: '25 May 2025' },
  { id: 'VHC-005', registration: 'UBG 442D', make: 'Mitsubishi', model: 'Pajero', vehicleType: 'Field SUV', year: 2018, color: 'Black', fuelType: 'Diesel', status: 'Maintenance', mileage: 201300, driver: null, department: 'Field Operations', lastService: '30 May 2024', nextService: '30 Aug 2024', insuranceExpiry: '05 Jan 2025', inspectionExpiry: '12 Apr 2025' },
  { id: 'VHC-006', registration: 'UBA 221X', make: 'Toyota', model: 'Land Cruiser 79', vehicleType: 'Field SUV', year: 2017, color: 'Green', fuelType: 'Diesel', status: 'Available', mileage: 245800, driver: null, department: 'Field Operations', lastService: '15 Jul 2024', nextService: '15 Oct 2024', insuranceExpiry: '22 Feb 2025', inspectionExpiry: '18 Jun 2025' },
  { id: 'VHC-007', registration: 'UBF 556T', make: 'Nissan', model: 'Navara', vehicleType: 'Pickup', year: 2021, color: 'Red', fuelType: 'Diesel', status: 'Assigned', mileage: 87650, driver: 'James Kato', department: 'Water & Sanitation', lastService: '01 Jul 2024', nextService: '01 Oct 2024', insuranceExpiry: '08 Jan 2025', inspectionExpiry: '14 Mar 2025' },
  { id: 'VHC-008', registration: 'UBC 334W', make: 'Toyota', model: 'Hilux Single Cab', vehicleType: 'Pickup', year: 2020, color: 'White', fuelType: 'Diesel', status: 'Available', mileage: 112300, driver: null, department: 'Administration', lastService: '20 Jun 2024', nextService: '20 Sep 2024', insuranceExpiry: '17 Apr 2025', inspectionExpiry: '30 Jul 2025' },
  { id: 'VHC-009', registration: 'UBE 778R', make: 'Isuzu', model: 'NQR', vehicleType: 'Truck', year: 2019, color: 'White', fuelType: 'Diesel', status: 'In service', mileage: 198400, driver: 'David Ssemwanga', department: 'Logistics', lastService: '10 Jul 2024', nextService: '10 Oct 2024', insuranceExpiry: '28 Feb 2025', inspectionExpiry: '05 May 2025' },
  { id: 'VHC-010', registration: 'UBD 990L', make: 'Toyota', model: 'Corolla', vehicleType: 'Sedan', year: 2022, color: 'Silver', fuelType: 'Petrol', status: 'Available', mileage: 45200, driver: null, department: 'Administration', lastService: '05 Jul 2024', nextService: '05 Oct 2024', insuranceExpiry: '11 Mar 2025', inspectionExpiry: '22 Jun 2025' },
  { id: 'VHC-011', registration: 'UBG 112A', make: 'Mitsubishi', model: 'Canter', vehicleType: 'Truck', year: 2018, color: 'Blue', fuelType: 'Diesel', status: 'Maintenance', mileage: 267500, driver: null, department: 'Logistics', lastService: '25 May 2024', nextService: '25 Aug 2024', insuranceExpiry: '03 Jan 2025', inspectionExpiry: '09 Apr 2025' },
  { id: 'VHC-012', registration: 'UAX 556B', make: 'Toyota', model: 'Land Cruiser Prado', vehicleType: 'Field SUV', year: 2023, color: 'White', fuelType: 'Diesel', status: 'Assigned', mileage: 34800, driver: 'Grace Namutebi', department: 'Public Health', lastService: '08 Jul 2024', nextService: '08 Oct 2024', insuranceExpiry: '19 Feb 2025', inspectionExpiry: '27 May 2025' },
];

// ─── Drivers ────────────────────────────────────────────────────────────────
export const drivers: Driver[] = [
  { id: 'DRV-001', name: 'Robert Okello', phone: '+256 772 445 123', email: 'robert.okello@fleet.ug', licenseNumber: 'DL-2019-445123', licenseExpiry: '14 Mar 2026', status: 'Active', department: 'Field Operations', assignedVehicle: 'UAX 482C', tripsCompleted: 342, rating: 4.8, joinDate: '15 Jan 2019' },
  { id: 'DRV-002', name: 'Moses Lwanga', phone: '+256 772 889 456', email: 'moses.lwanga@fleet.ug', licenseNumber: 'DL-2018-889456', licenseExpiry: '22 Aug 2025', status: 'Active', department: 'Public Health', assignedVehicle: 'UAT 706P', tripsCompleted: 518, rating: 4.6, joinDate: '03 Mar 2018' },
  { id: 'DRV-003', name: 'Sarah Atim', phone: '+256 772 334 789', email: 'sarah.atim@fleet.ug', licenseNumber: 'DL-2020-334789', licenseExpiry: '09 Nov 2026', status: 'Active', department: 'Programmes', assignedVehicle: 'UAZ 881M', tripsCompleted: 276, rating: 4.9, joinDate: '20 Jun 2020' },
  { id: 'DRV-004', name: 'James Kato', phone: '+256 772 556 234', email: 'james.kato@fleet.ug', licenseNumber: 'DL-2017-556234', licenseExpiry: '17 May 2025', status: 'Active', department: 'Water & Sanitation', assignedVehicle: 'UBF 556T', tripsCompleted: 623, rating: 4.5, joinDate: '11 Sep 2017' },
  { id: 'DRV-005', name: 'David Ssemwanga', phone: '+256 772 778 567', email: 'david.ssemwanga@fleet.ug', licenseNumber: 'DL-2016-778567', licenseExpiry: '30 Sep 2025', status: 'Active', department: 'Logistics', assignedVehicle: 'UBE 778R', tripsCompleted: 789, rating: 4.7, joinDate: '05 Feb 2016' },
  { id: 'DRV-006', name: 'Grace Namutebi', phone: '+256 772 223 890', email: 'grace.namutebi@fleet.ug', licenseNumber: 'DL-2021-223890', licenseExpiry: '12 Dec 2026', status: 'Active', department: 'Public Health', assignedVehicle: 'UAX 556B', tripsCompleted: 156, rating: 4.8, joinDate: '14 Aug 2021' },
  { id: 'DRV-007', name: 'Patrick Mugisha', phone: '+256 772 445 678', email: 'patrick.mugisha@fleet.ug', licenseNumber: 'DL-2015-445678', licenseExpiry: '08 Apr 2025', status: 'On leave', department: 'Field Operations', assignedVehicle: null, tripsCompleted: 912, rating: 4.4, joinDate: '22 Nov 2015' },
  { id: 'DRV-008', name: 'Agnes Kiconco', phone: '+256 772 889 012', email: 'agnes.kiconco@fleet.ug', licenseNumber: 'DL-2022-889012', licenseExpiry: '25 Jul 2027', status: 'Active', department: 'Field Operations', assignedVehicle: null, tripsCompleted: 89, rating: 4.9, joinDate: '01 Feb 2022' },
];

// ─── Vehicle Requests ───────────────────────────────────────────────────────
export const requests: VehicleRequest[] = [
  { id: 'REQ-0248', requester: 'Dr. Grace Namusoke', department: 'Public Health', destination: 'Mbarara District', requestedDate: '18 Jul 2024', startDate: '20 Jul 2024', endDate: '25 Jul 2024', purpose: 'Vaccination campaign supervision', status: 'Pending', vehicle: null, driver: null, reviewedBy: null, reviewedDate: null },
  { id: 'REQ-0247', requester: 'Peter Ouma', department: 'Water & Sanitation', destination: 'Gulu / Lira', requestedDate: '17 Jul 2024', startDate: '19 Jul 2024', endDate: '22 Jul 2024', purpose: 'Borehole installation assessment', status: 'Approved', vehicle: 'UBH 193K', driver: 'James Kato', reviewedBy: 'Fleet Manager', reviewedDate: '18 Jul 2024' },
  { id: 'REQ-0246', requester: 'Agnes Kiconco', department: 'Field Operations', destination: 'Fort Portal', requestedDate: '16 Jul 2024', startDate: '20 Jul 2024', endDate: '24 Jul 2024', purpose: 'Community outreach programme', status: 'Pending', vehicle: null, driver: null, reviewedBy: null, reviewedDate: null },
  { id: 'REQ-0245', requester: 'David Mugisha', department: 'Programmes', destination: 'Jinja', requestedDate: '15 Jul 2024', startDate: '22 Jul 2024', endDate: '26 Jul 2024', purpose: 'Training workshop delivery', status: 'Approved', vehicle: 'UAZ 881M', driver: 'Sarah Atim', reviewedBy: 'Fleet Manager', reviewedDate: '16 Jul 2024' },
  { id: 'REQ-0244', requester: 'Sarah Nalwoga', department: 'Administration', destination: 'Kampala', requestedDate: '14 Jul 2024', startDate: '15 Jul 2024', endDate: '15 Jul 2024', purpose: 'Airport pickup for visiting delegates', status: 'Completed', vehicle: 'UBD 990L', driver: 'David Ssemwanga', reviewedBy: 'Fleet Manager', reviewedDate: '14 Jul 2024' },
  { id: 'REQ-0243', requester: 'Michael Ssenyonga', department: 'Logistics', destination: 'Entebbe', requestedDate: '13 Jul 2024', startDate: '14 Jul 2024', endDate: '16 Jul 2024', purpose: 'Equipment transport to warehouse', status: 'Declined', vehicle: null, driver: null, reviewedBy: 'Fleet Manager', reviewedDate: '14 Jul 2024' },
  { id: 'REQ-0242', requester: 'Florence Akello', department: 'Public Health', destination: 'Arua', requestedDate: '12 Jul 2024', startDate: '15 Jul 2024', endDate: '20 Jul 2024', purpose: 'Health facility assessment', status: 'Completed', vehicle: 'UAX 482C', driver: 'Robert Okello', reviewedBy: 'Fleet Manager', reviewedDate: '13 Jul 2024' },
  { id: 'REQ-0241', requester: 'John Bosco', department: 'Water & Sanitation', destination: 'Masindi', requestedDate: '11 Jul 2024', startDate: '13 Jul 2024', endDate: '17 Jul 2024', purpose: 'Water quality testing', status: 'Completed', vehicle: 'UBF 556T', driver: 'James Kato', reviewedBy: 'Fleet Manager', reviewedDate: '12 Jul 2024' },
];

// ─── Trips ──────────────────────────────────────────────────────────────────
export const trips: Trip[] = [
  { id: 'TRP-0914', vehicle: 'UAX 482C', driver: 'Robert Okello', destination: 'Mbale District', departure: 'Today, 06:30', expectedReturn: 'Today, 18:00', actualReturn: null, status: 'On route', purpose: 'Vaccination campaign', mileageStart: 128420, mileageEnd: null, fuelUsed: null },
  { id: 'TRP-0913', vehicle: 'UAZ 881M', driver: 'Sarah Atim', destination: 'Luwero District', departure: 'Today, 07:00', expectedReturn: 'Today, 17:30', actualReturn: null, status: 'On route', purpose: 'Training workshop', mileageStart: 184700, mileageEnd: null, fuelUsed: null },
  { id: 'TRP-0915', vehicle: 'UBH 193K', driver: 'Unassigned', destination: 'Mbarara District', departure: 'Tomorrow, 06:00', expectedReturn: 'Tomorrow, 19:00', actualReturn: null, status: 'Scheduled', purpose: 'Borehole assessment', mileageStart: 92480, mileageEnd: null, fuelUsed: null },
  { id: 'TRP-0912', vehicle: 'UAX 556B', driver: 'Grace Namutebi', destination: 'Kampala', departure: 'Yesterday, 08:00', expectedReturn: 'Yesterday, 14:00', actualReturn: 'Yesterday, 13:45', status: 'Returned', purpose: 'Delegate pickup', mileageStart: 34800, mileageEnd: 35120, fuelUsed: 42 },
  { id: 'TRP-0911', vehicle: 'UBF 556T', driver: 'James Kato', destination: 'Masindi', departure: '15 Jul 2024, 06:00', expectedReturn: '17 Jul 2024, 18:00', actualReturn: '17 Jul 2024, 17:30', status: 'Returned', purpose: 'Water quality testing', mileageStart: 87650, mileageEnd: 88900, fuelUsed: 156 },
  { id: 'TRP-0910', vehicle: 'UBE 778R', driver: 'David Ssemwanga', destination: 'Entebbe', departure: '14 Jul 2024, 09:00', expectedReturn: '14 Jul 2024, 15:00', actualReturn: '14 Jul 2024, 14:30', status: 'Returned', purpose: 'Equipment transport', mileageStart: 198400, mileageEnd: 198650, fuelUsed: 31 },
  { id: 'TRP-0909', vehicle: 'UAX 482C', driver: 'Robert Okello', destination: 'Arua', departure: '10 Jul 2024, 05:30', expectedReturn: '12 Jul 2024, 19:00', actualReturn: '12 Jul 2024, 18:45', status: 'Returned', purpose: 'Health facility assessment', mileageStart: 127800, mileageEnd: 128420, fuelUsed: 380 },
  { id: 'TRP-0908', vehicle: 'UBD 990L', driver: 'David Ssemwanga', destination: 'Kampala', departure: '09 Jul 2024, 07:00', expectedReturn: '09 Jul 2024, 12:00', actualReturn: '09 Jul 2024, 11:30', status: 'Returned', purpose: 'Airport pickup', mileageStart: 45200, mileageEnd: 45380, fuelUsed: 22 },
];

// ─── Maintenance ────────────────────────────────────────────────────────────
export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'MNT-001', vehicle: 'UAT 706P', type: 'Routine service', status: 'In progress', description: 'Full service at 156,000 km interval. Oil change, filter replacement, brake inspection.', reportedDate: '03 Jul 2024', scheduledDate: '05 Jul 2024', completedDate: null, cost: 0, partsReplaced: [], workshop: 'Kampala Central Garage', mileageAtService: 156210 },
  { id: 'MNT-002', vehicle: 'UBG 442D', type: 'Repair', status: 'In progress', description: 'Transmission failure. Vehicle immobile at Fort Portal station.', reportedDate: '28 Jun 2024', scheduledDate: '01 Jul 2024', completedDate: null, cost: 0, partsReplaced: [], workshop: 'Fort Portal Workshop', mileageAtService: 201300 },
  { id: 'MNT-003', vehicle: 'UBG 112A', type: 'Repair', status: 'Scheduled', description: 'Hydraulic system leak on loading bed. Requires seal replacement and pressure test.', reportedDate: '15 Jul 2024', scheduledDate: '22 Jul 2024', completedDate: null, cost: 0, partsReplaced: [], workshop: 'Kampala Central Garage', mileageAtService: 267500 },
  { id: 'MNT-004', vehicle: 'UAX 482C', type: 'Routine service', status: 'Completed', description: '128,000 km service. Oil, filters, brake pads, tire rotation.', reportedDate: '10 Jun 2024', scheduledDate: '12 Jun 2024', completedDate: '12 Jun 2024', cost: 485000, partsReplaced: ['Engine oil', 'Oil filter', 'Air filter', 'Brake pads'], workshop: 'Kampala Central Garage', mileageAtService: 128420 },
  { id: 'MNT-005', vehicle: 'UAZ 881M', type: 'Inspection', status: 'Completed', description: 'Pre-trip safety inspection for long-distance assignment.', reportedDate: '17 Jun 2024', scheduledDate: '18 Jun 2024', completedDate: '18 Jun 2024', cost: 75000, partsReplaced: [], workshop: 'Kampala Central Garage', mileageAtService: 184700 },
  { id: 'MNT-006', vehicle: 'UBE 778R', type: 'Repair', status: 'Completed', description: 'Suspension repair. Replaced front shock absorbers and bushings.', reportedDate: '05 Jun 2024', scheduledDate: '08 Jun 2024', completedDate: '10 Jun 2024', cost: 320000, partsReplaced: ['Front shock absorbers', 'Bushings'], workshop: 'Kampala Central Garage', mileageAtService: 198400 },
  { id: 'MNT-007', vehicle: 'UBH 193K', type: 'Routine service', status: 'Completed', description: '92,000 km service. Standard maintenance schedule.', reportedDate: '25 Jun 2024', scheduledDate: '28 Jun 2024', completedDate: '28 Jun 2024', cost: 420000, partsReplaced: ['Engine oil', 'Oil filter', 'Air filter'], workshop: 'Kampala Central Garage', mileageAtService: 92480 },
  { id: 'MNT-008', vehicle: 'UBA 221X', type: 'Emergency', status: 'Completed', description: 'Engine overheating on field assignment. Replaced coolant and thermostat.', reportedDate: '20 May 2024', scheduledDate: '20 May 2024', completedDate: '22 May 2024', cost: 180000, partsReplaced: ['Coolant', 'Thermostat'], workshop: 'Field Repair Team', mileageAtService: 245800 },
];

// ─── Fuel Records ───────────────────────────────────────────────────────────
export const fuelRecords: FuelRecord[] = [
  { id: 'FUL-001', vehicle: 'UAX 482C', driver: 'Robert Okello', date: '18 Jul 2024', liters: 65, costPerLiter: 5200, totalCost: 338000, mileage: 128420, fuelStation: 'Shell Kampala Road', fuelType: 'Diesel' },
  { id: 'FUL-002', vehicle: 'UAZ 881M', driver: 'Sarah Atim', date: '18 Jul 2024', liters: 48, costPerLiter: 5200, totalCost: 249600, mileage: 184700, fuelStation: 'Shell Kampala Road', fuelType: 'Petrol' },
  { id: 'FUL-003', vehicle: 'UBF 556T', driver: 'James Kato', date: '17 Jul 2024', liters: 72, costPerLiter: 5200, totalCost: 374400, mileage: 87650, fuelStation: 'Total Bombo Road', fuelType: 'Diesel' },
  { id: 'FUL-004', vehicle: 'UAX 556B', driver: 'Grace Namutebi', date: '17 Jul 2024', liters: 55, costPerLiter: 5200, totalCost: 286000, mileage: 34800, fuelStation: 'Shell Kampala Road', fuelType: 'Diesel' },
  { id: 'FUL-005', vehicle: 'UBE 778R', driver: 'David Ssemwanga', date: '16 Jul 2024', liters: 80, costPerLiter: 5200, totalCost: 416000, mileage: 198400, fuelStation: 'Total Entebbe Road', fuelType: 'Diesel' },
  { id: 'FUL-006', vehicle: 'UBD 990L', driver: 'David Ssemwanga', date: '15 Jul 2024', liters: 35, costPerLiter: 5400, totalCost: 189000, mileage: 45200, fuelStation: 'Shell Kampala Road', fuelType: 'Petrol' },
  { id: 'FUL-007', vehicle: 'UAT 706P', driver: 'Moses Lwanga', date: '15 Jul 2024', liters: 68, costPerLiter: 5200, totalCost: 353600, mileage: 156210, fuelStation: 'Total Bombo Road', fuelType: 'Diesel' },
  { id: 'FUL-008', vehicle: 'UAX 482C', driver: 'Robert Okello', date: '14 Jul 2024', liters: 70, costPerLiter: 5200, totalCost: 364000, mileage: 127800, fuelStation: 'Shell Kampala Road', fuelType: 'Diesel' },
  { id: 'FUL-009', vehicle: 'UBH 193K', driver: 'James Kato', date: '13 Jul 2024', liters: 60, costPerLiter: 5200, totalCost: 312000, mileage: 92480, fuelStation: 'Total Bombo Road', fuelType: 'Diesel' },
  { id: 'FUL-010', vehicle: 'UAZ 881M', driver: 'Sarah Atim', date: '12 Jul 2024', liters: 45, costPerLiter: 5400, totalCost: 243000, mileage: 184200, fuelStation: 'Shell Kampala Road', fuelType: 'Petrol' },
];

// ─── Assignments ────────────────────────────────────────────────────────────
export const assignments: Assignment[] = [
  { id: 'ASG-001', vehicle: 'UAX 482C', driver: 'Robert Okello', department: 'Field Operations', startDate: '01 Jul 2024', endDate: null, status: 'Active', purpose: 'Vaccination campaign supervision' },
  { id: 'ASG-002', vehicle: 'UAZ 881M', driver: 'Sarah Atim', department: 'Programmes', startDate: '01 Jul 2024', endDate: null, status: 'Active', purpose: 'Training workshop delivery' },
  { id: 'ASG-003', vehicle: 'UBF 556T', driver: 'James Kato', department: 'Water & Sanitation', startDate: '01 Jul 2024', endDate: null, status: 'Active', purpose: 'Borehole installation assessment' },
  { id: 'ASG-004', vehicle: 'UBE 778R', driver: 'David Ssemwanga', department: 'Logistics', startDate: '01 Jul 2024', endDate: null, status: 'Active', purpose: 'Equipment transport' },
  { id: 'ASG-005', vehicle: 'UAX 556B', driver: 'Grace Namutebi', department: 'Public Health', startDate: '01 Jul 2024', endDate: null, status: 'Active', purpose: 'Health facility assessment' },
  { id: 'ASG-006', vehicle: 'UAT 706P', driver: 'Moses Lwanga', department: 'Public Health', startDate: '01 Jun 2024', endDate: '03 Jul 2024', status: 'Completed', purpose: 'Mobile clinic support' },
  { id: 'ASG-007', vehicle: 'UBD 990L', driver: 'David Ssemwanga', department: 'Administration', startDate: '10 Jul 2024', endDate: '10 Jul 2024', status: 'Completed', purpose: 'Delegate airport pickup' },
  { id: 'ASG-008', vehicle: 'UBH 193K', driver: 'James Kato', department: 'Water & Sanitation', startDate: '15 Jul 2024', endDate: null, status: 'Active', purpose: 'Water quality testing' },
];

// ─── Users ──────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'USR-001', name: 'Fleet Manager', email: 'fleet.manager@fleet.ug', role: 'Fleet Manager', department: 'Administration', phone: '+256 772 000 001', status: 'Active', lastLogin: 'Today, 08:30', joinDate: '01 Jan 2020' },
  { id: 'USR-002', name: 'System Administrator', email: 'admin@fleet.ug', role: 'Admin', department: 'Administration', phone: '+256 772 000 002', status: 'Active', lastLogin: 'Today, 07:45', joinDate: '01 Jan 2020' },
  { id: 'USR-003', name: 'Dr. Grace Namusoke', email: 'grace.namusoke@fleet.ug', role: 'Staff', department: 'Public Health', phone: '+256 772 111 222', status: 'Active', lastLogin: 'Yesterday, 16:20', joinDate: '15 Mar 2021' },
  { id: 'USR-004', name: 'Peter Ouma', email: 'peter.ouma@fleet.ug', role: 'Staff', department: 'Water & Sanitation', phone: '+256 772 333 444', status: 'Active', lastLogin: 'Today, 09:10', joinDate: '20 Jun 2022' },
  { id: 'USR-005', name: 'Robert Okello', email: 'robert.okello@fleet.ug', role: 'Driver', department: 'Field Operations', phone: '+256 772 445 123', status: 'Active', lastLogin: 'Today, 06:15', joinDate: '15 Jan 2019' },
  { id: 'USR-006', name: 'Sarah Atim', email: 'sarah.atim@fleet.ug', role: 'Driver', department: 'Programmes', phone: '+256 772 334 789', status: 'Active', lastLogin: 'Today, 06:45', joinDate: '20 Jun 2020' },
  { id: 'USR-007', name: 'Transport Supervisor', email: 'supervisor@fleet.ug', role: 'Supervisor', department: 'Field Operations', phone: '+256 772 555 666', status: 'Active', lastLogin: 'Today, 08:00', joinDate: '10 Sep 2019' },
  { id: 'USR-008', name: 'Agnes Kiconco', email: 'agnes.kiconco@fleet.ug', role: 'Staff', department: 'Field Operations', phone: '+256 772 889 012', status: 'Active', lastLogin: 'Yesterday, 14:30', joinDate: '01 Feb 2022' },
  { id: 'USR-009', name: 'David Mugisha', email: 'david.mugisha@fleet.ug', role: 'Staff', department: 'Programmes', phone: '+256 772 777 888', status: 'Active', lastLogin: 'Today, 10:05', joinDate: '12 Apr 2021' },
  { id: 'USR-010', name: 'Michael Ssenyonga', email: 'michael.senyonga@fleet.ug', role: 'Staff', department: 'Logistics', phone: '+256 772 999 000', status: 'Inactive', lastLogin: '30 Jun 2024', joinDate: '05 Aug 2020' },
];

// ─── Departments ────────────────────────────────────────────────────────────
export const departments: Department[] = [
  { id: 'DPT-001', name: 'Field Operations', head: 'Transport Supervisor', vehicleCount: 12, driverCount: 8 },
  { id: 'DPT-002', name: 'Public Health', head: 'Dr. Grace Namusoke', vehicleCount: 8, driverCount: 5 },
  { id: 'DPT-003', name: 'Water & Sanitation', head: 'Peter Ouma', vehicleCount: 6, driverCount: 4 },
  { id: 'DPT-004', name: 'Programmes', head: 'David Mugisha', vehicleCount: 7, driverCount: 5 },
  { id: 'DPT-005', name: 'Logistics', head: 'Michael Ssenyonga', vehicleCount: 5, driverCount: 3 },
  { id: 'DPT-006', name: 'Administration', head: 'Fleet Manager', vehicleCount: 4, driverCount: 2 },
];

// ─── Notifications ──────────────────────────────────────────────────────────
export const notifications: AppNotification[] = [
  { id: 'NOT-001', type: 'maintenance', title: 'UAT 706P service due', message: 'Service interval reached at 156,000 km. Book workshop inspection.', timestamp: '2 hours ago', read: false, link: '/maintenance' },
  { id: 'NOT-002', type: 'request', title: '2 requests need review', message: 'Pending requests for Mbarara District and Fort Portal.', timestamp: '3 hours ago', read: false, link: '/requests' },
  { id: 'NOT-003', type: 'assignment', title: 'Trip without a driver', message: 'UBH 193K is scheduled for Mbarara tomorrow at 06:00.', timestamp: '5 hours ago', read: false, link: '/trips' },
  { id: 'NOT-004', type: 'document', title: '3 insurance renewals approaching', message: 'Renewals are due within the next 30 days.', timestamp: '1 day ago', read: true, link: '/vehicles' },
  { id: 'NOT-005', type: 'maintenance', title: 'UBG 442D transmission failure', message: 'Vehicle immobile at Fort Portal. Awaiting repair assessment.', timestamp: '1 day ago', read: true, link: '/maintenance' },
  { id: 'NOT-006', type: 'system', title: 'Daily fleet availability snapshot recorded', message: 'Fleet status snapshot has been archived.', timestamp: '2 days ago', read: true, link: '/reports' },
];

// ─── Attention Items ────────────────────────────────────────────────────────
export const attentionItems: AttentionItem[] = [
  { id: 'ATT-01', category: 'Maintenance', title: 'UAT 706P service due', detail: 'Service interval reached at 156,000 km. Book workshop inspection.', severity: 'high' },
  { id: 'ATT-02', category: 'Requests', title: '2 requests need review', detail: 'Pending requests for Mbarara District and Fort Portal.', severity: 'medium' },
  { id: 'ATT-03', category: 'Assignments', title: 'Trip without a driver', detail: 'UBH 193K is scheduled for Mbarara tomorrow at 06:00.', severity: 'medium' },
  { id: 'ATT-04', category: 'Documents', title: '3 insurance renewals approaching', detail: 'Renewals are due within the next 30 days.', severity: 'low' },
];

// ─── Activity ───────────────────────────────────────────────────────────────
export const activity: ActivityEvent[] = [
  { id: 'ACT-01', message: 'Robert Okello checked out UAX 482C for Mbale District', timestamp: 'Today, 06:21', type: 'assignment' },
  { id: 'ACT-02', message: 'Request REQ-0247 approved by Fleet Operations', timestamp: 'Today, 05:48', type: 'request' },
  { id: 'ACT-03', message: 'UAT 706P marked for scheduled service', timestamp: 'Yesterday, 16:32', type: 'maintenance' },
  { id: 'ACT-04', message: 'Daily fleet availability snapshot recorded', timestamp: 'Yesterday, 08:00', type: 'system' },
  { id: 'ACT-05', message: 'Fuel record added for UBF 556T — 72L diesel', timestamp: 'Yesterday, 14:15', type: 'fuel' },
  { id: 'ACT-06', message: 'Trip TRP-0912 returned — UAX 556B, 320 km', timestamp: 'Yesterday, 13:45', type: 'trip' },
];

// ─── Expenses ───────────────────────────────────────────────────────────────
export const expenses: Expense[] = [
  { id: 'EXP-001', vehicle: 'UAX 482C', category: 'Maintenance', amount: 485000, date: '12 Jun 2024', description: '128,000 km service — oil, filters, brake pads', recordedBy: 'Fleet Manager' },
  { id: 'EXP-002', vehicle: 'UBE 778R', category: 'Repair', amount: 320000, date: '10 Jun 2024', description: 'Suspension repair — front shock absorbers', recordedBy: 'Fleet Manager' },
  { id: 'EXP-003', vehicle: 'UBA 221X', category: 'Repair', amount: 180000, date: '22 May 2024', description: 'Engine overheating — coolant and thermostat', recordedBy: 'Fleet Manager' },
  { id: 'EXP-004', vehicle: 'UAX 482C', category: 'Fuel', amount: 338000, date: '18 Jul 2024', description: 'Diesel — 65L at Shell Kampala Road', recordedBy: 'Robert Okello' },
  { id: 'EXP-005', vehicle: 'UAZ 881M', category: 'Fuel', amount: 249600, date: '18 Jul 2024', description: 'Petrol — 48L at Shell Kampala Road', recordedBy: 'Sarah Atim' },
  { id: 'EXP-006', vehicle: 'UBF 556T', category: 'Fuel', amount: 374400, date: '17 Jul 2024', description: 'Diesel — 72L at Total Bombo Road', recordedBy: 'James Kato' },
  { id: 'EXP-007', vehicle: 'UAX 556B', category: 'Fuel', amount: 286000, date: '17 Jul 2024', description: 'Diesel — 55L at Shell Kampala Road', recordedBy: 'Grace Namutebi' },
  { id: 'EXP-008', vehicle: 'UBE 778R', category: 'Fuel', amount: 416000, date: '16 Jul 2024', description: 'Diesel — 80L at Total Entebbe Road', recordedBy: 'David Ssemwanga' },
  { id: 'EXP-009', vehicle: 'UBD 990L', category: 'Fuel', amount: 189000, date: '15 Jul 2024', description: 'Petrol — 35L at Shell Kampala Road', recordedBy: 'David Ssemwanga' },
  { id: 'EXP-010', vehicle: 'UAT 706P', category: 'Fuel', amount: 353600, date: '15 Jul 2024', description: 'Diesel — 68L at Total Bombo Road', recordedBy: 'Moses Lwanga' },
];

// ─── Reports ────────────────────────────────────────────────────────────────
export const reports: Report[] = [
  { id: 'RPT-001', type: 'Vehicle utilization', title: 'Monthly vehicle utilization report', description: 'Vehicle usage rates, availability and assignment coverage for the current month.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-002', type: 'Fuel consumption', title: 'Fuel consumption summary', description: 'Total fuel issued, consumption rates and cost analysis by vehicle.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-003', type: 'Maintenance costs', title: 'Maintenance cost analysis', description: 'Maintenance expenditure by vehicle, type and workshop for the quarter.', generatedDate: '01 Jul 2024', period: 'Q3 2024' },
  { id: 'RPT-004', type: 'Trip summary', title: 'Trip log summary', description: 'All trips completed, distance covered and fuel consumed.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-005', type: 'Driver activity', title: 'Driver performance report', description: 'Driver trip counts, ratings and compliance summary.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-006', type: 'Fleet status', title: 'Fleet status overview', description: 'Current fleet composition, status distribution and readiness.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-007', type: 'Expense summary', title: 'Operational expense report', description: 'All fleet-related expenses categorized by type and department.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
  { id: 'RPT-008', type: 'Request summary', title: 'Vehicle request summary', description: 'Request volumes, approval rates and processing times.', generatedDate: '01 Jul 2024', period: 'Jul 2024' },
];
