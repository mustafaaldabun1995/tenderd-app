import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleApi } from '../services/vehicleApi';
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  CreateMaintenanceRequest,
} from '../types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  maintenance: (vehicleId: number) => [...vehicleKeys.detail(vehicleId), 'maintenance'] as const,
};

export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: vehicleApi.getVehicles,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVehicle = (id: number, enabled = true) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleApi.getVehicle(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMaintenanceHistory = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.maintenance(vehicleId),
    queryFn: () => vehicleApi.getMaintenanceHistory(vehicleId),
    enabled: !!vehicleId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicle: CreateVehicleRequest) => vehicleApi.createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicle }: { id: number; vehicle: UpdateVehicleRequest }) =>
      vehicleApi.updateVehicle(id, vehicle),
    onSuccess: data => {
      queryClient.setQueryData(vehicleKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vehicleApi.deleteVehicle(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

export const useAddMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, maintenance }: { vehicleId: number; maintenance: CreateMaintenanceRequest }) =>
      vehicleApi.addMaintenance(vehicleId, maintenance),
    onSuccess: (updatedVehicle, { vehicleId }) => {
      queryClient.setQueryData(vehicleKeys.detail(vehicleId), updatedVehicle);
      queryClient.invalidateQueries({ queryKey: vehicleKeys.maintenance(vehicleId) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};
