import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { Vehicle } from '../../types';
import Button from '../Button';
import { EditIcon, DeleteIcon } from '../Icons';

interface VehicleDetailsHeaderProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleDetailsHeader: React.FC<VehicleDetailsHeaderProps> = ({ vehicle, onEdit, onDelete }) => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center gap-2 sm:gap-4">
      <h1 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
        {vehicle.model}
      </h1>
      <div className="flex space-x-2 sm:space-x-3">
        <Button onClick={onEdit} variant="primary" size="sm" icon={<EditIcon />} className="p-2" title="Edit Vehicle" />
        <Button
          onClick={onDelete}
          variant="ghost"
          size="sm"
          icon={<DeleteIcon />}
          className="p-2 text-red-600 hover:text-red-700 border border-red-800/40 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/20"
          title="Delete Vehicle"
        />
      </div>
    </div>
  );
};

export default VehicleDetailsHeader;
