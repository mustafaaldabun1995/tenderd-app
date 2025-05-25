import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../Button';
import { AddVehicleIcon } from '../Icons';

interface VehicleListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddVehicle: () => void;
}

const VehicleListHeader: React.FC<VehicleListHeaderProps> = ({ searchQuery, onSearchChange, onAddVehicle }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-grow">
        <input
          type="text"
          placeholder="Filter vehicles..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className={`px-4 py-2 border rounded-lg flex-grow transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300'
          }`}
        />
      </div>
      <Button
        onClick={onAddVehicle}
        variant="primary"
        size="md"
        icon={<AddVehicleIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />}
      >
        Add Vehicle
      </Button>
    </div>
  );
};

export default VehicleListHeader;
