import React from 'react';

interface BackArrowIconProps {
  className?: string;
}

const BackArrowIcon: React.FC<BackArrowIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 12H5m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
};

export default BackArrowIcon; 