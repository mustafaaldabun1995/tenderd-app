import { useVehicleList } from '../hooks/useVehicleList';
import { VehicleRegistrationModal, EditVehicleModal, ConfirmationModal } from '../components/Modals';
import { VehicleListHeader, VehicleTable, EmptyState } from '../components/VehicleList';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const VehicleList = () => {
  const {
    vehicles,
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
  } = useVehicleList();

  if (isLoading) {
    return <LoadingSpinner message="Loading vehicles..." />;
  }

  return (
    <>
      <div className="space-y-6">
        <VehicleListHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddVehicle={openAddModal} />
        {vehicles.length === 0 ? (
          <EmptyState hasSearchQuery={!!searchQuery} onAddVehicle={openAddModal} />
        ) : (
          <VehicleTable
            vehicles={vehicles}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={toggleSort}
            onVehicleClick={handleVehicleClick}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
          />
        )}
      </div>
      {isAddModalOpen && (
        <VehicleRegistrationModal isOpen={isAddModalOpen} onClose={closeAddModal} onSuccess={handleModalSuccess} />
      )}
      {isEditModalOpen && selectedVehicle && (
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          vehicle={selectedVehicle}
          onSuccess={handleEditSuccess}
        />
      )}
      {isDeleteDialogOpen && (
        <ConfirmationModal
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Vehicle"
          message={
            selectedVehicle
              ? `Are you sure you want to delete "${selectedVehicle.model}" (${selectedVehicle.registrationNumber})? This action cannot be undone and will remove all associated data including maintenance records.`
              : ''
          }
          confirmText="Delete Vehicle"
          cancelText="Cancel"
          confirmButtonColor="red"
          isLoading={deleteVehicleMutation.isPending}
        />
      )}
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
      )}
    </>
  );
};

export default VehicleList;
