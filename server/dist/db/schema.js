"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMaintenanceRecordSchema = exports.insertVehicleSchema = exports.maintenanceRecords = exports.vehicles = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_zod_1 = require("drizzle-zod");
const drizzle_orm_1 = require("drizzle-orm");
exports.vehicles = (0, sqlite_core_1.sqliteTable)('vehicles', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    model: (0, sqlite_core_1.text)('model').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    status: (0, sqlite_core_1.text)('status', { enum: ['active', 'maintenance', 'inactive'] }).notNull().default('active'),
    registrationNumber: (0, sqlite_core_1.text)('registration_number').notNull().unique(),
    location: (0, sqlite_core_1.text)('location').notNull(),
    lastMaintenance: (0, sqlite_core_1.integer)('last_maintenance', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(unixepoch())`),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(unixepoch())`),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(unixepoch())`),
});
exports.maintenanceRecords = (0, sqlite_core_1.sqliteTable)('maintenance_records', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    vehicleId: (0, sqlite_core_1.integer)('vehicle_id').notNull().references(() => exports.vehicles.id, { onDelete: 'cascade' }),
    description: (0, sqlite_core_1.text)('description').notNull(),
    cost: (0, sqlite_core_1.integer)('cost'),
    performedAt: (0, sqlite_core_1.integer)('performed_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(unixepoch())`),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(unixepoch())`),
});
// Zod schemas for validation
exports.insertVehicleSchema = (0, drizzle_zod_1.createInsertSchema)(exports.vehicles);
exports.insertMaintenanceRecordSchema = (0, drizzle_zod_1.createInsertSchema)(exports.maintenanceRecords);
