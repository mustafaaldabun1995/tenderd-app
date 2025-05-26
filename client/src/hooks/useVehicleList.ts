import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles, useDeleteVehicle } from './useVehicles';
import { useUIStore, useFilterState } from '../store';
import type { ToastState } from '../types';

export const useVehicleList = () => {
  const navigate = useNavigate();
  const { data: vehicles = [], isLoading } = useVehicles();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const {
    setLastViewedVehicle,
    setSearchQuery,
    toggleSort,
  } = useUIStore();

  const { searchQuery, sortBy, sortDirection } = useFilterState();
  const deleteVehicleMutation = useDeleteVehicle();

  const selectedVehicle = selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null;

  const filteredVehicles = vehicles.filter(
    vehicle =>
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === undefined || bValue === undefined) return 0;

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  
  const openEditModal = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVehicleId(null);
  };
  
  const openDeleteDialog = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    setIsDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedVehicleId(null);
  };

  const handleModalSuccess = () => {
    showToast('🎉 Vehicle registered successfully!', 'success');
  };

  const handleEditSuccess = () => {
    showToast('🎉 Vehicle updated successfully!', 'success');
    closeEditModal();
  };

  const handleDelete = async () => {
    if (!selectedVehicleId) return;

    try {
      await deleteVehicleMutation.mutateAsync(selectedVehicleId);
      showToast('🗑️ Vehicle deleted successfully!', 'success');
    } catch {
      showToast('Failed to delete vehicle. Please try again.', 'error');
    } finally {
      closeDeleteDialog();
    }
  };

  const handleVehicleClick = (vehicleId: number) => {
    setLastViewedVehicle(vehicleId);
    navigate(`/vehicles/${vehicleId}`);
  };

  return {
    vehicles: sortedVehicles,
    isLoading,
    selectedVehicle,
    searchQuery,
    sortBy,
    sortDirection,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    toast,
    setSearchQuery,
    toggleSort,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    hideToast,
    handleModalSuccess,
    handleEditSuccess,
    handleDelete,
    handleVehicleClick,
    deleteVehicleMutation,
  };
};
