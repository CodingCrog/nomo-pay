import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}) => {
  // Build grid columns classes using complete class names
  const getColClass = (num: number, prefix?: string) => {
    const colMap: { [key: number]: string } = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };
    const base = colMap[num] || 'grid-cols-1';
    return prefix ? `${prefix}:${base}` : base;
  };
  
  const colClasses = [
    cols.xs && getColClass(cols.xs),
    cols.sm && getColClass(cols.sm, 'sm'),
    cols.md && getColClass(cols.md, 'md'),
    cols.lg && getColClass(cols.lg, 'lg'),
    cols.xl && getColClass(cols.xl, 'xl'),
    cols['2xl'] && getColClass(cols['2xl'], '2xl'),
  ].filter(Boolean).join(' ');
  
  // Gap classes
  const gapClasses = {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-3 sm:gap-4 md:gap-5 lg:gap-6',
    lg: 'gap-4 sm:gap-5 md:gap-6 lg:gap-8',
  }[gap];
  
  return (
    <div className={`grid ${colClasses} ${gapClasses} ${className}`}>
      {children}
    </div>
  );
};