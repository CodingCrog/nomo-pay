import { useState, useEffect } from 'react';
import { BREAKPOINTS, type Breakpoint } from '../constants/responsive';

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const getBreakpoint = (): Breakpoint => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) return '2xl';
      if (width >= BREAKPOINTS.xl) return 'xl';
      if (width >= BREAKPOINTS.lg) return 'lg';
      if (width >= BREAKPOINTS.md) return 'md';
      if (width >= BREAKPOINTS.sm) return 'sm';
      return 'xs';
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    // Set initial breakpoint
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

export const useIsMobile = (): boolean => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
};

export const useIsTablet = (): boolean => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md' || breakpoint === 'lg';
};

export const useIsDesktop = (): boolean => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
};