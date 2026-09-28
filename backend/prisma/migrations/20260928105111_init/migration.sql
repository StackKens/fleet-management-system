-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "head" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Staff',
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "last_login" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "department_id" TEXT,
    CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registration" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "fuel_type" TEXT NOT NULL DEFAULT 'Diesel',
    "status" TEXT NOT NULL DEFAULT 'Available',
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "last_service" TEXT,
    "next_service" TEXT,
    "insurance_expiry" TEXT,
    "inspection_expiry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "department_id" TEXT,
    CONSTRAINT "vehicles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_expiry" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "trips_completed" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "join_date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "department_id" TEXT,
    CONSTRAINT "drivers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vehicle_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "reviewed_by_id" TEXT,
    "reviewed_date" TEXT,
    "review_reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "requester_id" TEXT NOT NULL,
    "department_id" TEXT,
    CONSTRAINT "vehicle_requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vehicle_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vehicle_requests_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "purpose" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "department_id" TEXT,
    "request_id" TEXT,
    "assigned_by_id" TEXT,
    CONSTRAINT "assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "assignments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "vehicle_requests" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "expected_return" TEXT NOT NULL,
    "actual_return" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "purpose" TEXT,
    "mileage_start" INTEGER NOT NULL DEFAULT 0,
    "mileage_end" INTEGER,
    "fuel_used" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "driver_id_2" TEXT,
    "assignment_id" TEXT,
    CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_driver_id_2_fkey" FOREIGN KEY ("driver_id_2") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "trips_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "description" TEXT NOT NULL,
    "reported_date" TEXT NOT NULL,
    "scheduled_date" TEXT NOT NULL,
    "completed_date" TEXT,
    "cost" REAL NOT NULL DEFAULT 0,
    "parts_replaced" TEXT,
    "workshop" TEXT NOT NULL,
    "mileage_at_service" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    CONSTRAINT "maintenance_records_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fuel_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "liters" REAL NOT NULL,
    "cost_per_liter" REAL NOT NULL,
    "total_cost" REAL NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel_station" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "driver_id_2" TEXT,
    CONSTRAINT "fuel_records_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fuel_records_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fuel_records_driver_id_2_fkey" FOREIGN KEY ("driver_id_2") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT,
    "recorded_by_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_id" TEXT NOT NULL,
    CONSTRAINT "expenses_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "result" TEXT NOT NULL DEFAULT 'Pending',
    "mileage" INTEGER NOT NULL,
    "notes" TEXT,
    "date" TEXT NOT NULL,
    "submitted_by_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT,
    CONSTRAINT "inspections_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "inspections_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inspections_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "issues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "description" TEXT NOT NULL,
    "location" TEXT,
    "date" TEXT NOT NULL,
    "reported_by_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT,
    CONSTRAINT "issues_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "issues_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "issues_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_registration_key" ON "vehicles"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_email_key" ON "drivers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_license_number_key" ON "drivers"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_request_id_key" ON "assignments"("request_id");
