import React from 'react';
import { useTheme } from '../context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  loadingText = 'Loading...',
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const isIconOnly = !children && !loading;
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeStyles = {
    sm: isIconOnly ? 'p-2 rounded-lg' : 'px-3 py-2 text-sm rounded-lg',
    md: isIconOnly ? 'p-2 rounded-lg' : 'px-4 py-2 rounded-lg',
    lg: isIconOnly ? 'p-3 rounded-xl' : 'px-6 py-3 rounded-xl text-lg',
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        light:
          'bg-orange-500/10 text-orange-700 border border-orange-200 hover:bg-orange-300/20 focus:ring-orange-500/50',
        dark: 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 focus:ring-orange-500/50',
      },
      secondary: {
        light: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 focus:ring-gray-500/50',
        dark: 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 focus:ring-gray-500/50',
      },
      danger: {
        light:
          'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 focus:ring-red-500/50',
        dark: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 focus:ring-red-500/50',
      },
      ghost: {
        light: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500/50',
        dark: 'text-gray-300 hover:text-white hover:bg-gray-700 focus:ring-gray-500/50',
      },
    };

    return variants[variant][theme];
  };

  const animationStyles =
    loading || disabled
      ? ''
      : isIconOnly
        ? 'transition-all duration-200 btn-gradient shadow-lg hover:shadow-xl focus:ring-2 focus:outline-none'
        : 'transition-all duration-200 btn-gradient shadow-lg hover:shadow-xl focus:ring-2 focus:outline-none shadow-lg hover:shadow-xl';

  const LoadingSpinner = () => <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />;

  const getIconSpacing = () => {
    if (isIconOnly) return '';

    const spacing = {
      sm: iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5',
      md: iconPosition === 'left' ? 'mr-2' : 'ml-2',
      lg: iconPosition === 'left' ? 'mr-3' : 'ml-3',
    };
    return spacing[size];
  };

  const buttonStyles = [
    baseStyles,
    sizeStyles[size],
    getVariantStyles(),
    animationStyles,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonStyles} disabled={disabled || loading} {...props}>
      {loading && <LoadingSpinner />}
      {isIconOnly ? (
        icon
      ) : (
        <>
          {!loading && icon && iconPosition === 'left' && <span className={getIconSpacing()}>{icon}</span>}
          <span>{loading ? loadingText : children}</span>
          {!loading && icon && iconPosition === 'right' && <span className={getIconSpacing()}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
