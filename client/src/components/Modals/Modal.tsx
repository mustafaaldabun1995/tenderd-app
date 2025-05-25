import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'lg' }) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Add slight delay for smooth animation
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.classList.add('animate-fade-in');
          overlayRef.current.classList.remove('opacity-0');
        }
        if (modalRef.current) {
          modalRef.current.classList.add('animate-modal-in');
          modalRef.current.classList.remove('scale-95', 'opacity-0');
        }
      }, 10);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (overlayRef.current) {
      overlayRef.current.classList.add('animate-fade-out');
      overlayRef.current.classList.remove('animate-fade-in');
    }
    if (modalRef.current) {
      modalRef.current.classList.add('animate-modal-out');
      modalRef.current.classList.remove('animate-modal-in');
    }

    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0"
      onClick={handleOverlayClick}
    >
      <div
        className="absolute inset-0 backdrop-blur-md transition-all duration-300 opacity-90"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)',
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${maxWidthClasses[maxWidth]} transform rounded-3xl shadow-2xl 
          scale-95 opacity-0 max-h-[90vh] overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800 border border-gray-600/50' : 'bg-white border border-gray-200/50'}
        `}
        style={{
          boxShadow:
            theme === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        <div
          className={`
          relative flex items-center justify-between p-6 border-b 
          ${
            theme === 'dark'
              ? 'border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-750'
              : 'border-gray-200/50 bg-gradient-to-r from-gray-50 to-white'
          }
        `}
        >
          <h2
            className={`
            text-xl font-semibold 
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}
          >
            {title}
          </h2>
          <button
            onClick={handleClose}
            className={`
              group p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95
              ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }
            `}
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content with scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
