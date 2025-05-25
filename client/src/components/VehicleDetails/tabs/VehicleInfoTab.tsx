import { useTheme } from '../../../context/ThemeContext';
import type { Vehicle } from '../../../types';

interface VehicleInfoTabProps {
  vehicle: Vehicle;
}

const VehicleInfoTab: React.FC<VehicleInfoTabProps> = ({ vehicle }) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`shadow rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Vehicle Information
        </h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Model</dt>
            <dd className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{vehicle.model}</dd>
          </div>
          <div>
            <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Type</dt>
            <dd className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{vehicle.type}</dd>
          </div>
          <div>
            <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Registration Number
            </dt>
            <dd className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
              {vehicle.registrationNumber}
            </dd>
          </div>
          <div>
            <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</dt>
            <dd className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  vehicle.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : vehicle.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {vehicle.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default VehicleInfoTab;
