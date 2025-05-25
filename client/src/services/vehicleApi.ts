import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  MaintenanceRecord,
  CreateMaintenanceRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const vehicleApi = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles`);
    return handleApiResponse(response);
  },

  getVehicle: async (id: number): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    return handleApiResponse(response);
  },

  createVehicle: async (vehicle: CreateVehicleRequest): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });
    return handleApiResponse(response);
  },

  updateVehicle: async (id: number, vehicle: UpdateVehicleRequest): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });
    return handleApiResponse(response);
  },

  deleteVehicle: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  },

  getMaintenanceHistory: async (vehicleId: number): Promise<MaintenanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/maintenance`);
    return handleApiResponse(response);
  },

  addMaintenance: async (vehicleId: number, maintenance: CreateMaintenanceRequest): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenance),
    });
    return handleApiResponse(response);
  },
};
