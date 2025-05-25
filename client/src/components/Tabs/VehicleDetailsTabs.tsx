import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { VehicleTab } from '../../store';

interface VehicleDetailsTabsProps {
  activeTab: VehicleTab;
  onTabChange: (tab: VehicleTab) => void;
}

const VehicleDetailsTabs: React.FC<VehicleDetailsTabsProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const tabs: { id: VehicleTab; label: string }[] = [
    { id: 'info', label: 'Basic Info' },
    { id: 'maintenance', label: 'Maintenance History' },
    { id: 'location', label: 'Location & Status' },
    { id: 'analytics', label: 'Usage Analytics' },
  ];

  return (
    <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="overflow-x-auto scrollbar-hide">
        <nav className="-mb-px flex space-x-8 min-w-max px-4 sm:px-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0 transition-all duration-200
                ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'border-orange-400 text-orange-400'
                      : 'border-orange-500 text-orange-600'
                    : theme === 'dark'
                      ? 'border-transparent text-gray-400 hover:text-orange-300 hover:border-orange-400/50'
                      : 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default VehicleDetailsTabs;
