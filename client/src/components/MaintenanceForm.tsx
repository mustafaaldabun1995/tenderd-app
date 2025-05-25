import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAddMaintenance } from '../hooks/useVehicles';
import type { CreateMaintenanceRequest } from '../types';
import Button from './Button';
import { PlusIcon } from './Icons';

interface MaintenanceFormProps {
  vehicleId: number;
  onSuccess: () => void;
}

const MaintenanceForm = ({ vehicleId, onSuccess }: MaintenanceFormProps) => {
  const { theme } = useTheme();
  const addMaintenanceMutation = useAddMaintenance();

  const [formData, setFormData] = useState<CreateMaintenanceRequest>({
    description: '',
    cost: undefined,
  });

  const [errors, setErrors] = useState<{
    description?: string;
    cost?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.cost !== undefined && formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await addMaintenanceMutation.mutateAsync({
        vehicleId,
        maintenance: {
          description: formData.description.trim(),
          cost: formData.cost,
        },
      });

      // Clear form on success
      setFormData({
        description: '',
        cost: undefined,
      });
      setErrors({});

      onSuccess();
    } catch (error) {
      // Error handling is done through the mutation state
      console.error('Failed to add maintenance entry:', error);
    }
  };

  const handleInputChange = (field: keyof CreateMaintenanceRequest, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={`shadow rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Log New Maintenance Entry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="description"
            className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Description *
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="e.g. Oil change, Tire rotation, Brake inspection"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.description ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
              ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
              }`}
            disabled={addMaintenanceMutation.isPending}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label
            htmlFor="cost"
            className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Cost (optional)
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
            <input
              type="number"
              id="cost"
              value={formData.cost || ''}
              onChange={e => handleInputChange('cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.cost ? 'border-red-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              disabled={addMaintenanceMutation.isPending}
            />
          </div>
          {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
        </div>

        {addMaintenanceMutation.error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            Failed to add maintenance entry: {addMaintenanceMutation.error.message}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={() => {
              setFormData({ description: '', cost: undefined });
              setErrors({});
            }}
            disabled={addMaintenanceMutation.isPending}
            variant="ghost"
          >
            Clear
          </Button>

          <Button
            type="submit"
            disabled={addMaintenanceMutation.isPending || !formData.description.trim()}
            variant="primary"
            loading={addMaintenanceMutation.isPending}
            loadingText="Adding..."
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Add Entry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
