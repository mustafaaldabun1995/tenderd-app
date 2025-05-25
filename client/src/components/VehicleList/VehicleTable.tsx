import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import SortableHeader from '../SortableHeader';
import VehicleTableRow from './VehicleTableRow';
import type { Vehicle } from '../../types';

interface VehicleTableProps {
  vehicles: Vehicle[];
  sortBy: 'model' | 'type' | 'status' | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: 'model' | 'type' | 'status') => void;
  onVehicleClick: (vehicleId: number) => void;
  onEdit: (vehicleId: number) => void;
  onDelete: (vehicleId: number) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  sortBy,
  sortDirection,
  onSort,
  onVehicleClick,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}>
            <tr>
              <SortableHeader
                label="Model"
                column="model"
                isActive={sortBy === 'model'}
                sortDirection={sortDirection}
                onClick={onSort}
              />
              <SortableHeader
                label="Type"
                column="type"
                isActive={sortBy === 'type'}
                sortDirection={sortDirection}
                onClick={onSort}
              />
              <SortableHeader
                label="Status"
                column="status"
                isActive={sortBy === 'status'}
                sortDirection={sortDirection}
                onClick={onSort}
              />
              <th
                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                  theme === 'dark' ? 'text-gray-300' : 'text-orange-700'
                }`}
              >
                Registration
              </th>
              <th
                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-orange-700'
                }`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
            {vehicles.map(vehicle => (
              <VehicleTableRow
                key={vehicle.id}
                vehicle={vehicle}
                onVehicleClick={onVehicleClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
