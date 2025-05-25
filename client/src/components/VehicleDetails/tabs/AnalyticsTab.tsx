import { useTheme } from '../../../context/ThemeContext';

const AnalyticsTab: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`shadow rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3
        className={`text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Usage Analytics
      </h3>
      <div
        className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Analytics data will be available soon
      </div>
    </div>
  );
};

export default AnalyticsTab; 