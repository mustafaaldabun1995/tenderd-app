export interface Vehicle {
  id: number;
  model: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  registrationNumber: string;
  lastMaintenance: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  model: string;
  type: string;
  status?: 'active' | 'maintenance' | 'inactive';
  registrationNumber: string;
  location: string;
  lastMaintenance?: string;
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>;

export interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  description: string;
  cost: number | null;
  performedAt: string;
  createdAt: string;
}

export interface CreateMaintenanceRequest {
  description: string;
  cost?: number;
} 