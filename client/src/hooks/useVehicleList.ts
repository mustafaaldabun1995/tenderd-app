import { useNavigate } from 'react-router-dom';
import { useVehicles, useDeleteVehicle } from './useVehicles';
import { useUIStore, useModalState, useFilterState, useToastState } from '../store';

export const useVehicleList = () => {
  const navigate = useNavigate();
  const { data: vehicles = [], isLoading } = useVehicles();

  const {
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    setSearchQuery,
    toggleSort,
    showToast,
    hideToast,
    setLastViewedVehicle,
  } = useUIStore();

  const { isAddModalOpen, isEditModalOpen, isDeleteDialogOpen, selectedVehicleId } = useModalState();
  const { searchQuery, sortBy, sortDirection } = useFilterState();
  const toast = useToastState();
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
