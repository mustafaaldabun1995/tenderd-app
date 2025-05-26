import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../Button';
import { EditIcon, DeleteIcon } from '../../Icons';
import type { Vehicle } from '../../../types';

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onVehicleClick: (vehicleId: number) => void;
  onEdit: (vehicleId: number) => void;
  onDelete: (vehicleId: number) => void;
}

const VehicleTableRow: React.FC<VehicleTableRowProps> = ({
  vehicle,
  onVehicleClick,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'maintenance':
        return 'bg-orange-500/30 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <tr
      className={`transition-all duration-200 ${
        theme === 'dark' 
          ? 'hover:bg-gray-700 hover:shadow-lg' 
          : 'hover:bg-orange-50 hover:shadow-md'
      } cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
      onClick={() => onVehicleClick(vehicle.id)}
    >
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {vehicle.model}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {vehicle.type}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(vehicle.status)}`}
        >
          {vehicle.status}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {vehicle.registrationNumber}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            onClick={e => {
              e.stopPropagation();
              onEdit(vehicle.id);
            }}
            variant="primary"
            size="sm"
            icon={<EditIcon />}
            className="p-2"
            title="Edit Vehicle"
          />
          <Button
            onClick={e => {
              e.stopPropagation();
              onDelete(vehicle.id);
            }}
            variant="ghost"
            size="sm"
            icon={<DeleteIcon />}
            className="p-2 text-red-600 hover:text-red-700 border border-red-800/40 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/20"
            title="Delete Vehicle"
          />
        </div>
      </td>
    </tr>
  );
};

export default VehicleTableRow; 