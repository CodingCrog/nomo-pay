import React from 'react';
import { useBreakpoint } from '../../hooks';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  fullWidth = false,
  noPadding = false,
}) => {
  const breakpoint = useBreakpoint();
  
  // Responsive max-width classes
  const maxWidthClass = fullWidth ? 'w-full' : {
    'xs': 'max-w-full',
    'sm': 'max-w-full sm:max-w-xl',
    'md': 'max-w-full sm:max-w-xl md:max-w-3xl',
    'lg': 'max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl',
    'xl': 'max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl',
    '2xl': 'max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-screen-2xl',
  }[breakpoint];
  
  // Responsive padding classes
  const paddingClass = noPadding ? '' : {
    'xs': 'px-3',
    'sm': 'px-4',
    'md': 'px-6',
    'lg': 'px-8',
    'xl': 'px-10',
    '2xl': 'px-12',
  }[breakpoint];
  
  return (
    <div className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};