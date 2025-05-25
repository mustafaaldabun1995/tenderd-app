import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useMaintenanceHistory } from '../../../hooks/useVehicles';
import MaintenanceForm from '../../MaintenanceForm';
import type { Vehicle } from '../../../types';

interface MaintenanceTabProps {
  vehicle: Vehicle;
  vehicleId: number;
  onMaintenanceSuccess: () => void;
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  vehicle,
  vehicleId,
  onMaintenanceSuccess,
}) => {
  const { theme } = useTheme();
  const {
    data: maintenanceHistory = [],
    isLoading: isMaintenanceLoading,
    error: maintenanceError,
  } = useMaintenanceHistory(vehicleId);

  return (
    <div className="space-y-6">
      {/* Add New Maintenance Form */}
      <MaintenanceForm vehicleId={vehicleId} onSuccess={onMaintenanceSuccess} />

      {/* Maintenance History */}
      <div
        className={`shadow rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Maintenance History
          </h3>
          {maintenanceHistory.length > 0 && (
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {maintenanceHistory.length} record{maintenanceHistory.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Last Maintenance Info */}
        {vehicle.lastMaintenance && (
          <div
            className={`border-l-4 border-blue-500 pl-4 py-3 mb-6 rounded-r-lg ${
              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}
          >
            <p
              className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}
            >
              Last Maintenance
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {new Date(vehicle.lastMaintenance).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isMaintenanceLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p
                className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Loading maintenance history...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {maintenanceError && (
          <div
            className={`text-center py-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
          >
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">Error loading maintenance history</p>
            <p className="text-sm mt-1 opacity-75">{maintenanceError.message}</p>
          </div>
        )}

        {/* Maintenance Records */}
        {!isMaintenanceLoading && !maintenanceError && (
          <>
            {maintenanceHistory.length > 0 ? (
              <div className="space-y-4">
                {maintenanceHistory.map((record, index) => (
                  <div
                    key={record.id}
                    className={`group border rounded-xl p-4 transition-all duration-200 hover:shadow-md
                      ${
                        theme === 'dark'
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              index === 0
                                ? 'bg-green-500'
                                : theme === 'dark'
                                  ? 'bg-gray-500'
                                  : 'bg-gray-400'
                            }`}
                          ></div>
                          <h4
                            className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}
                          >
                            {record.description}
                          </h4>
                          {index === 0 && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                theme === 'dark'
                                  ? 'bg-green-900/30 text-green-300'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              Latest
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <p
                          className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {new Date(record.performedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {record.cost && (
                          <p
                            className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                          >
                            ${record.cost.toFixed(2)}
                          </p>
                        )}
                        {!record.cost && (
                          <p
                            className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                          >
                            No cost recorded
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`text-xs mt-3 pt-3 border-t ${
                        theme === 'dark'
                          ? 'border-gray-600 text-gray-500'
                          : 'border-gray-200 text-gray-400'
                      }`}
                    >
                      Added on{' '}
                      {new Date(record.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="text-lg font-medium mb-2">No maintenance records found</h4>
                <p className="text-sm">
                  Use the form above to log your first maintenance entry.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTab; 