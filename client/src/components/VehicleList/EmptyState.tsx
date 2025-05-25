import React from 'react';
import Button from '../Button';
import { AddVehicleIcon } from '../Icons';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onAddVehicle: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery, onAddVehicle }) => {
  return (
    <div className="text-center py-12">
      <div className="text-orange-400 text-6xl mb-4">🚗</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No vehicles found</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {hasSearchQuery ? 'Try adjusting your search filters' : 'Get started by adding your first vehicle'}
      </p>
      {!hasSearchQuery && (
        <Button onClick={onAddVehicle} variant="primary" size="lg" icon={<AddVehicleIcon className="w-5 h-5" />}>
          Add Your First Vehicle
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
