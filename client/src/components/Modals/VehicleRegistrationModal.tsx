import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCreateVehicle } from '../../hooks/useVehicles';
import { type CreateVehicleRequest } from '../../types';
import Modal from './Modal';
import Button from '../Button';
import { PlusIcon } from '../Icons';

interface VehicleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const VehicleRegistrationModal: React.FC<VehicleRegistrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const createVehicleMutation = useCreateVehicle();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateVehicleRequest>({
    model: '',
    type: '',
    status: 'active',
    registrationNumber: '',
    location: '',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.type.trim()) {
      newErrors.type = 'Type is required';
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createVehicleMutation.mutateAsync(formData);

      setFormData({
        model: '',
        type: '',
        status: 'active',
        registrationNumber: '',
        location: '',
      });
      setErrors({});

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating vehicle:', error);
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
    
    if (createVehicleMutation.error) {
      createVehicleMutation.reset();
    }
  };

  const handleClose = () => {
    if (!createVehicleMutation.isPending) {
      setFormData({
        model: '',
        type: '',
        status: 'active',
        registrationNumber: '',
        location: '',
      });
      setErrors({});
      createVehicleMutation.reset();
      onClose();
    }
  };

  const isSubmitting = createVehicleMutation.isPending;
  const apiError = createVehicleMutation.error;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register New Vehicle" maxWidth="2xl">
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
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Registration Failed</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {apiError.message || 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="model"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Vehicle Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. Toyota Camry"
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 input-focus
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500'
                }
                ${errors.model ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake' : ''}
              `}
              disabled={isSubmitting}
            />
            {errors.model && (
              <p className="text-red-500 text-sm flex items-center animate-slide-up">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.model}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="type"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g. Sedan, SUV, Truck"
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 input-focus
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500'
                }
                ${errors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake' : ''}
              `}
              disabled={isSubmitting}
            />
            {errors.type && (
              <p className="text-red-500 text-sm flex items-center animate-slide-up">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.type}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="status"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-2 py-3 rounded-xl border-2 transition-all duration-200 input-focus
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-white'
                    : 'bg-gray-50/50 border-gray-200 text-gray-900'
                }
              `}
              disabled={isSubmitting}
            >
              <option value="active">🟢 Active</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="inactive">🔴 Inactive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="registrationNumber"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. ABC-123"
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 input-focus
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500'
                }
                ${
                  errors.registrationNumber
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake'
                    : ''
                }
              `}
              disabled={isSubmitting}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm flex items-center animate-slide-up">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.registrationNumber}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="location"
            className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Current Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Downtown Garage, Parking Lot A"
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 input-focus
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
              ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500'
              }
              ${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake' : ''}
            `}
            disabled={isSubmitting}
          />
          {errors.location && (
            <p className="text-red-500 text-sm flex items-center animate-slide-up">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.location}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" onClick={handleClose} disabled={isSubmitting} variant="secondary" size="lg">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="lg"
            loading={isSubmitting}
            loadingText="Registering..."
            icon={<PlusIcon className="w-5 h-5" />}
          >
            Register Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleRegistrationModal;
