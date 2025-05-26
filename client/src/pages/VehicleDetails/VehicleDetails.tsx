import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVehicle, useDeleteVehicle } from '../../hooks/useVehicles';
import { useTheme } from '../../context/ThemeContext';
import { useUIStore } from '../../store';
import { EditVehicleModal, ConfirmationModal } from '../../components/Modals';
import Toast from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  VehicleDetailsHeader,
  VehicleInfoTab,
  MaintenanceTab,
  LocationTab,
  AnalyticsTab,
  VehicleDetailsTabs,
} from '../../components/VehicleDetails';
import Button from '../../components/Button.tsx';
import BackArrowIcon from '../../components/Icons/BackArrowIcon.tsx';
import type { ToastState } from '../../types';

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const {
    activeTab,
    setActiveTab,
    setLastViewedVehicle,
  } = useUIStore();

  const vehicleId = id ? parseInt(id, 10) : 0;
  const deleteVehicleMutation = useDeleteVehicle();
  const { data: vehicle, isLoading, error } = useVehicle(vehicleId, !deleteVehicleMutation.isPending);

  useEffect(() => {
    if (vehicleId && !isNaN(vehicleId)) {
      setLastViewedVehicle(vehicleId);
    }
  }, [vehicleId, setLastViewedVehicle]);

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleEditSuccess = () => {
    showToast('🎉 Vehicle updated successfully!', 'success');
  };

  const handleMaintenanceSuccess = () => {
    showToast('🔧 Maintenance entry added successfully!', 'success');
  };

  const handleDelete = async () => {
    try {
      await deleteVehicleMutation.mutateAsync(vehicleId);
      showToast('🗑️ Vehicle deleted successfully!', 'success');
      navigate('/vehicles');
    } catch {
      showToast('Failed to delete vehicle. Please try again.', 'error');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading vehicle..." />;
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {error ? 'Error loading vehicle' : 'Vehicle not found'}
        </h2>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {error?.message || 'The vehicle you are looking for does not exist.'}
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className={`mt-4 ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
          }`}
        >
          Back to Vehicle List
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <VehicleInfoTab vehicle={vehicle} />;
      case 'maintenance':
        return (
          <MaintenanceTab vehicle={vehicle} vehicleId={vehicleId} onMaintenanceSuccess={handleMaintenanceSuccess} />
        );
      case 'location':
        return <LocationTab vehicle={vehicle} />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <VehicleDetailsHeader vehicle={vehicle} onEdit={handleEdit} onDelete={handleDeleteClick} />
        <VehicleDetailsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
        <div className="mt-8 mb-6">
          <Link to="/vehicles">
            <Button variant="primary" icon={<BackArrowIcon className="w-5 h-5" />} iconPosition="left">
              Back to homepage
            </Button>
          </Link>
        </div>
      </div>
      {isEditModalOpen && (
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          vehicle={vehicle}
        />
      )}
      {isDeleteDialogOpen && (
        <ConfirmationModal
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Vehicle"
          message={`Are you sure you want to delete "${vehicle.model}" (${vehicle.registrationNumber})? This action cannot be undone and will remove all associated data including maintenance records.`}
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

export default VehicleDetails;
