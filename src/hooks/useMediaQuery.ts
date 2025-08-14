import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

// Preset media queries
export const useIsSmallScreen = () => useMediaQuery('(max-width: 639px)');
export const useIsMediumScreen = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1024px)');
export const useIsTouchDevice = () => useMediaQuery('(hover: none) and (pointer: coarse)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');