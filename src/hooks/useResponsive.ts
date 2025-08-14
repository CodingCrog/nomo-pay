import { useBreakpoint } from './useBreakpoint';
import type { Breakpoint, ResponsiveValue } from '../constants/responsive';

export const useResponsive = <T>(value: ResponsiveValue<T>): T => {
  const breakpoint = useBreakpoint();
  
  // If it's not an object, return the value as-is
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }
  
  // Cast to responsive object
  const responsiveObj = value as Partial<Record<Breakpoint, T>>;
  
  // Breakpoint hierarchy for fallback
  const breakpointHierarchy: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointHierarchy.indexOf(breakpoint);
  
  // Try to find value for current breakpoint or fall back to smaller ones
  for (let i = currentIndex; i < breakpointHierarchy.length; i++) {
    const bp = breakpointHierarchy[i];
    if (bp in responsiveObj) {
      return responsiveObj[bp]!;
    }
  }
  
  // If no breakpoint value found, try to find the smallest defined breakpoint
  for (let i = breakpointHierarchy.length - 1; i >= 0; i--) {
    const bp = breakpointHierarchy[i];
    if (bp in responsiveObj) {
      return responsiveObj[bp]!;
    }
  }
  
  // This shouldn't happen if the input is properly formed
  throw new Error('No responsive value found');
};

// Utility hook for responsive class names
export const useResponsiveClass = (
  baseClass: string,
  responsiveClasses?: Partial<Record<Breakpoint, string>>
): string => {
  const breakpoint = useBreakpoint();
  
  if (!responsiveClasses) return baseClass;
  
  const additionalClass = responsiveClasses[breakpoint];
  return additionalClass ? `${baseClass} ${additionalClass}` : baseClass;
};