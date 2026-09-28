const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({ where: { name: 'Field Operations' }, update: {}, create: { name: 'Field Operations', head: 'Transport Supervisor' } }),
    prisma.department.upsert({ where: { name: 'Public Health' }, update: {}, create: { name: 'Public Health', head: 'Dr. Grace Namusoke' } }),
    prisma.department.upsert({ where: { name: 'Water & Sanitation' }, update: {}, create: { name: 'Water & Sanitation', head: 'Peter Ouma' } }),
    prisma.department.upsert({ where: { name: 'Programmes' }, update: {}, create: { name: 'Programmes', head: 'David Mugisha' } }),
    prisma.department.upsert({ where: { name: 'Logistics' }, update: {}, create: { name: 'Logistics', head: 'Michael Ssenyonga' } }),
    prisma.department.upsert({ where: { name: 'Administration' }, update: {}, create: { name: 'Administration', head: 'Fleet Manager' } }),
  ]);
  console.log(`Created ${departments.length} departments`);

  // Create users with hashed passwords
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'admin@fleet.ug' }, update: {}, create: { name: 'System Administrator', email: 'admin@fleet.ug', passwordHash, role: 'Admin', departmentId: departments[5].id } }),
    prisma.user.upsert({ where: { email: 'manager@fleet.ug' }, update: {}, create: { name: 'Fleet Manager', email: 'manager@fleet.ug', passwordHash, role: 'Fleet Manager', departmentId: departments[5].id } }),
    prisma.user.upsert({ where: { email: 'supervisor@fleet.ug' }, update: {}, create: { name: 'Transport Supervisor', email: 'supervisor@fleet.ug', passwordHash, role: 'Supervisor', departmentId: departments[0].id } }),
    prisma.user.upsert({ where: { email: 'driver@fleet.ug' }, update: {}, create: { name: 'Robert Okello', email: 'driver@fleet.ug', passwordHash, role: 'Driver', departmentId: departments[0].id } }),
    prisma.user.upsert({ where: { email: 'staff@fleet.ug' }, update: {}, create: { name: 'Dr. Grace Namusoke', email: 'staff@fleet.ug', passwordHash, role: 'Staff', departmentId: departments[1].id } }),
  ]);
  console.log(`Created ${users.length} users`);

  // Create vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({ where: { registration: 'UAX 482C' }, update: {}, create: { registration: 'UAX 482C', make: 'Toyota', model: 'Land Cruiser Prado', vehicleType: 'Field SUV', year: 2021, color: 'White', fuelType: 'Diesel', status: 'Available', mileage: 128420, departmentId: departments[0].id } }),
    prisma.vehicle.upsert({ where: { registration: 'UBH 193K' }, update: {}, create: { registration: 'UBH 193K', make: 'Toyota', model: 'Hilux Double Cab', vehicleType: 'Pickup', year: 2020, color: 'Silver', fuelType: 'Diesel', status: 'Available', mileage: 92480, departmentId: departments[2].id } }),
    prisma.vehicle.upsert({ where: { registration: 'UAT 706P' }, update: {}, create: { registration: 'UAT 706P', make: 'Isuzu', model: 'D-Max', vehicleType: 'Pickup', year: 2019, color: 'Blue', fuelType: 'Diesel', status: 'In service', mileage: 156210, departmentId: departments[1].id } }),
    prisma.vehicle.upsert({ where: { registration: 'UAZ 881M' }, update: {}, create: { registration: 'UAZ 881M', make: 'Toyota', model: 'Hiace', vehicleType: 'Minibus', year: 2022, color: 'White', fuelType: 'Petrol', status: 'Available', mileage: 184700, departmentId: departments[3].id } }),
    prisma.vehicle.upsert({ where: { registration: 'UBG 442D' }, update: {}, create: { registration: 'UBG 442D', make: 'Mitsubishi', model: 'Pajero', vehicleType: 'Field SUV', year: 2018, color: 'Black', fuelType: 'Diesel', status: 'Maintenance', mileage: 201300, departmentId: departments[0].id } }),
  ]);
  console.log(`Created ${vehicles.length} vehicles`);

  // Create drivers
  const drivers = await Promise.all([
    prisma.driver.upsert({ where: { email: 'robert.okello@fleet.ug' }, update: {}, create: { name: 'Robert Okello', phone: '+256 772 445 123', email: 'robert.okello@fleet.ug', licenseNumber: 'DL-2019-445123', licenseExpiry: '2026-03-14', status: 'Active', departmentId: departments[0].id, joinDate: '2019-01-15' } }),
    prisma.driver.upsert({ where: { email: 'moses.lwanga@fleet.ug' }, update: {}, create: { name: 'Moses Lwanga', phone: '+256 772 889 456', email: 'moses.lwanga@fleet.ug', licenseNumber: 'DL-2018-889456', licenseExpiry: '2025-08-22', status: 'Active', departmentId: departments[1].id, joinDate: '2018-03-03' } }),
    prisma.driver.upsert({ where: { email: 'sarah.atim@fleet.ug' }, update: {}, create: { name: 'Sarah Atim', phone: '+256 772 334 789', email: 'sarah.atim@fleet.ug', licenseNumber: 'DL-2020-334789', licenseExpiry: '2026-11-09', status: 'Active', departmentId: departments[3].id, joinDate: '2020-06-20' } }),
  ]);
  console.log(`Created ${drivers.length} drivers`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
