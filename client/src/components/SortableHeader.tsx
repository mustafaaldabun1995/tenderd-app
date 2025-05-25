import { useTheme } from '../context/ThemeContext';

interface SortableHeaderProps {
  label: string;
  column: 'model' | 'type' | 'status';
  isActive: boolean;
  sortDirection: 'asc' | 'desc';
  onClick: (column: 'model' | 'type' | 'status') => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, column, isActive, sortDirection, onClick }) => {
  const { theme } = useTheme();

  return (
    <th
      className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none
        transition-all duration-200 hover:bg-opacity-80 whitespace-nowrap ${
          theme === 'dark'
            ? `text-gray-300 hover:bg-gray-600 ${isActive ? 'bg-orange-500/20 text-orange-300' : ''}`
            : `text-orange-700 hover:bg-orange-100 ${isActive ? 'bg-orange-500/40 text-orange-800' : ''}`
        }`}
      onClick={() => onClick(column)}
    >
      <div className="flex items-center space-x-2 group">
        <span className={isActive ? 'font-semibold' : ''}>{label}</span>
        <div className="flex flex-col justify-center h-4 w-3">
          {isActive ? (
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${
                sortDirection === 'desc' ? 'rotate-180' : ''
              } ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className={`w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;
