import { useTheme } from '../../../context/ThemeContext';
import type { Vehicle } from '../../../types';

interface LocationTabProps {
  vehicle: Vehicle;
}

const LocationTab: React.FC<LocationTabProps> = ({ vehicle }) => {
  const { theme } = useTheme();

  return (
    <div className={`shadow rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3
        className={`text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Location & Status
      </h3>
      <div className="space-y-4">
        <div>
          <p
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            Current Location
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {vehicle.location}
          </p>
        </div>
        <div>
          <p
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            Current Status
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {vehicle.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationTab; 