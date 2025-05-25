import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUpdateVehicle } from '../../hooks/useVehicles';
import type { Vehicle, UpdateVehicleRequest } from '../../types';
import Modal from './Modal';
import Button from '../Button';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: Vehicle;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ isOpen, onClose, onSuccess, vehicle }) => {
  const { theme } = useTheme();
  const updateVehicleMutation = useUpdateVehicle();

  const [formData, setFormData] = useState<UpdateVehicleRequest>({
    model: '',
    type: '',
    status: 'active',
    registrationNumber: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && vehicle) {
      setFormData({
        model: vehicle.model,
        type: vehicle.type,
        status: vehicle.status,
        registrationNumber: vehicle.registrationNumber,
        location: vehicle.location,
      });
      setErrors({});

      if (updateVehicleMutation.error) {
        updateVehicleMutation.reset();
      }
    }
  }, [isOpen, vehicle]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.model?.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.type?.trim()) {
      newErrors.type = 'Type is required';
    }
    if (!formData.registrationNumber?.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateVehicleMutation.mutateAsync({ id: vehicle.id, vehicle: formData });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    if (updateVehicleMutation.error) {
      updateVehicleMutation.reset();
    }
  };

  const handleClose = () => {
    if (!updateVehicleMutation.isPending) {
      setErrors({});
      updateVehicleMutation.reset();
      onClose();
    }
  };

  const isSubmitting = updateVehicleMutation.isPending;
  const apiError = updateVehicleMutation.error;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Vehicle" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Update Failed</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {apiError.message || 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Vehicle Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.model
                  ? 'border-red-500 focus:ring-red-500'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                    : 'border-gray-300 bg-white focus:ring-blue-500'
              } focus:border-transparent focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="e.g. Toyota Camry"
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Vehicle Type *
            </label>
            <input
              type="text"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.type
                  ? 'border-red-500 focus:ring-red-500'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                    : 'border-gray-300 bg-white focus:ring-blue-500'
              } focus:border-transparent focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="e.g. Sedan, SUV, Truck"
            />
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Registration Number *
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.registrationNumber
                  ? 'border-red-500 focus:ring-red-500'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                    : 'border-gray-300 bg-white focus:ring-blue-500'
              } focus:border-transparent focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="e.g. ABC-1234"
            />
            {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              name="status"
              value={formData.status || 'active'}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                  : 'border-gray-300 bg-white focus:ring-blue-500'
              } focus:border-transparent focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              errors.location
                ? 'border-red-500 focus:ring-red-500'
                : theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500'
                  : 'border-gray-300 bg-white focus:ring-blue-500'
            } focus:border-transparent focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            placeholder="e.g. Garage A, Fleet Center"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" onClick={handleClose} disabled={isSubmitting} variant="secondary" size="lg">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="lg"
            loading={isSubmitting}
            loadingText="Updating..."
          >
            Update Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditVehicleModal;
