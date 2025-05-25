"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenanceHistory = exports.addMaintenance = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicle = exports.getVehicles = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
// Enhanced validation schemas
const createVehicleSchema = zod_1.z.object({
    model: zod_1.z.string().trim().min(1, 'Model is required').max(100, 'Model must be less than 100 characters'),
    type: zod_1.z.string().trim().min(1, 'Type is required').max(50, 'Type must be less than 50 characters'),
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']).default('active'),
    registrationNumber: zod_1.z.string().trim().min(1, 'Registration number is required').max(20, 'Registration number must be less than 20 characters'),
    location: zod_1.z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
    lastMaintenance: zod_1.z.string().datetime().optional()
});
const updateVehicleSchema = zod_1.z.object({
    model: zod_1.z.string().trim().min(1, 'Model is required').max(100, 'Model must be less than 100 characters').optional(),
    type: zod_1.z.string().trim().min(1, 'Type is required').max(50, 'Type must be less than 50 characters').optional(),
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']).optional(),
    registrationNumber: zod_1.z.string().trim().min(1, 'Registration number is required').max(20, 'Registration number must be less than 20 characters').optional(),
    location: zod_1.z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters').optional(),
});
const createMaintenanceSchema = zod_1.z.object({
    description: zod_1.z.string().trim().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    cost: zod_1.z.number().min(0, 'Cost cannot be negative').optional()
});
// Get all vehicles
const getVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allVehicles = yield db_1.db.select().from(schema_1.vehicles).orderBy((0, drizzle_orm_1.desc)(schema_1.vehicles.createdAt));
        res.json(allVehicles);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error });
    }
});
exports.getVehicles = getVehicles;
// Get a single vehicle
const getVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = parseInt(req.params.id);
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID' });
        }
        const vehicle = yield db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).limit(1);
        if (vehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vehicle', error });
    }
});
exports.getVehicle = getVehicle;
// Create a new vehicle
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validationResult = createVehicleSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        const validatedData = validationResult.data;
        const newVehicle = {
            model: validatedData.model,
            type: validatedData.type,
            status: validatedData.status,
            registrationNumber: validatedData.registrationNumber,
            location: validatedData.location,
            lastMaintenance: validatedData.lastMaintenance ? new Date(validatedData.lastMaintenance) : new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = yield db_1.db.insert(schema_1.vehicles).values(newVehicle).returning();
        res.status(201).json(result[0]);
    }
    catch (error) {
        // Handle unique constraint violation for registration number
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ message: 'Registration number already exists' });
        }
        else {
            res.status(500).json({ message: 'Error creating vehicle', error });
        }
    }
});
exports.createVehicle = createVehicle;
// Update a vehicle
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = parseInt(req.params.id);
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID' });
        }
        // Validate request body
        const validationResult = updateVehicleSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        const validatedData = validationResult.data;
        // Check if vehicle exists
        const existingVehicle = yield db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).limit(1);
        if (existingVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const updatedVehicle = Object.assign(Object.assign({}, validatedData), { updatedAt: new Date() });
        const result = yield db_1.db
            .update(schema_1.vehicles)
            .set(updatedVehicle)
            .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId))
            .returning();
        res.json(result[0]);
    }
    catch (error) {
        // Handle unique constraint violation for registration number
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(400).json({ message: 'Registration number already exists' });
        }
        else {
            res.status(500).json({ message: 'Error updating vehicle', error });
        }
    }
});
exports.updateVehicle = updateVehicle;
// Delete a vehicle
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = parseInt(req.params.id);
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID' });
        }
        // Check if vehicle exists
        const existingVehicle = yield db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).limit(1);
        if (existingVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const result = yield db_1.db.delete(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).returning();
        res.json({ message: 'Vehicle deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error });
    }
});
exports.deleteVehicle = deleteVehicle;
// Add maintenance record
const addMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = parseInt(req.params.id);
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID' });
        }
        // Validate request body
        const validationResult = createMaintenanceSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        const validatedData = validationResult.data;
        // Check if vehicle exists
        const existingVehicle = yield db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).limit(1);
        if (existingVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        // Add maintenance record
        const newMaintenanceRecord = {
            vehicleId,
            description: validatedData.description,
            cost: validatedData.cost || null,
            performedAt: new Date(),
            createdAt: new Date(),
        };
        yield db_1.db.insert(schema_1.maintenanceRecords).values(newMaintenanceRecord);
        // Update vehicle status and last maintenance date
        const updatedVehicle = yield db_1.db
            .update(schema_1.vehicles)
            .set({
            lastMaintenance: new Date(),
            status: 'maintenance',
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId))
            .returning();
        res.json(updatedVehicle[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating maintenance record', error });
    }
});
exports.addMaintenance = addMaintenance;
// Get maintenance history for a vehicle
const getMaintenanceHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = parseInt(req.params.id);
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID' });
        }
        // Check if vehicle exists
        const existingVehicle = yield db_1.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId)).limit(1);
        if (existingVehicle.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const maintenanceHistory = yield db_1.db
            .select()
            .from(schema_1.maintenanceRecords)
            .where((0, drizzle_orm_1.eq)(schema_1.maintenanceRecords.vehicleId, vehicleId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.maintenanceRecords.performedAt));
        res.json(maintenanceHistory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance history', error });
    }
});
exports.getMaintenanceHistory = getMaintenanceHistory;
