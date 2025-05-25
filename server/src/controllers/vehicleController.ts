import { Request, Response } from 'express';
import { db } from '../db';
import {
  vehicles,
  maintenanceRecords,
  type Vehicle,
  type NewVehicle,
  type NewMaintenanceRecord,
  insertVehicleSchema,
  insertMaintenanceRecordSchema,
} from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const createVehicleSchema = z.object({
  model: z.string().trim().min(1, 'Model is required').max(100, 'Model must be less than 100 characters'),
  type: z.string().trim().min(1, 'Type is required').max(50, 'Type must be less than 50 characters'),
  status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
  registrationNumber: z
    .string()
    .trim()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number must be less than 20 characters'),
  location: z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  lastMaintenance: z.string().datetime().optional(),
});

const updateVehicleSchema = z.object({
  model: z.string().trim().min(1, 'Model is required').max(100, 'Model must be less than 100 characters').optional(),
  type: z.string().trim().min(1, 'Type is required').max(50, 'Type must be less than 50 characters').optional(),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
  registrationNumber: z
    .string()
    .trim()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number must be less than 20 characters')
    .optional(),
  location: z
    .string()
    .trim()
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters')
    .optional(),
});

const createMaintenanceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  cost: z.number().min(0, 'Cost cannot be negative').optional(),
});

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const allVehicles = await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
    res.json(allVehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const vehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);

    if (vehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const validationResult = createVehicleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    const newVehicle: NewVehicle = {
      model: validatedData.model,
      type: validatedData.type,
      status: validatedData.status,
      registrationNumber: validatedData.registrationNumber,
      location: validatedData.location,
      lastMaintenance: validatedData.lastMaintenance ? new Date(validatedData.lastMaintenance) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(vehicles).values(newVehicle).returning();
    res.status(201).json(result[0]);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ message: 'Registration number already exists' });
    } else {
      res.status(500).json({ message: 'Error creating vehicle', error });
    }
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const validationResult = updateVehicleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    const existingVehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await db.update(vehicles).set(updatedVehicle).where(eq(vehicles.id, vehicleId)).returning();

    res.json(result[0]);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ message: 'Registration number already exists' });
    } else {
      res.status(500).json({ message: 'Error updating vehicle', error });
    }
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const existingVehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const result = await db.delete(vehicles).where(eq(vehicles.id, vehicleId)).returning();

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error });
  }
};

export const addMaintenance = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const validationResult = createMaintenanceSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    const existingVehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const newMaintenanceRecord: NewMaintenanceRecord = {
      vehicleId,
      description: validatedData.description,
      cost: validatedData.cost || null,
      performedAt: new Date(),
      createdAt: new Date(),
    };

    await db.insert(maintenanceRecords).values(newMaintenanceRecord);

    const updatedVehicle = await db
      .update(vehicles)
      .set({
        lastMaintenance: new Date(),
        status: 'maintenance',
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, vehicleId))
      .returning();

    res.json(updatedVehicle[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating maintenance record', error });
  }
};

export const getMaintenanceHistory = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const existingVehicle = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const maintenanceHistory = await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.vehicleId, vehicleId))
      .orderBy(desc(maintenanceRecords.performedAt));

    res.json(maintenanceHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maintenance history', error });
  }
};
