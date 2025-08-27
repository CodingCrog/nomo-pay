/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorMode = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  background1: string;
  background2: string;
  background3: string;
  surface: string;
  error: string;
  disabled: string;
  foreground1: string;
  foreground2: string;
  foreground3: string;
  // Additional colors for components
  text1: string;
  text2: string;
  border: string;
  // Card specific colors
  gbCardGradient: string[];
  numberedCardGradient: string[];
}

interface ThemeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  primary: '#B8860B', // Dark goldenrod
  onPrimary: '#ffffff',
  primaryContainer: '#f9f0e0',
  secondary: '#6B6B6B', // Gray/Silver tone
  onSecondary: '#ffffff',
  secondaryContainer: '#e9e1d1',
  background1: '#FAF7F2',
  background2: '#f8f2e8',
  background3: '#f0e5d2',
  surface: '#ffffff',
  error: '#ef4444',
  disabled: '#E0E0E0',
  foreground1: 'rgba(0, 0, 0, 0.87)',
  foreground2: 'rgba(0, 0, 0, 0.74)',
  foreground3: 'rgba(0, 0, 0, 0.60)',
  // Additional colors
  text1: 'rgba(0, 0, 0, 0.87)',
  text2: 'rgba(0, 0, 0, 0.60)',
  border: 'rgba(0, 0, 0, 0.12)',
  // Card gradients - Gold and Silver
  gbCardGradient: ['#FFD700', '#FFBF00', '#B8860B'], // Gold gradient
  numberedCardGradient: ['#E5E5E5', '#C0C0C0', '#A8A8A8'], // Silver gradient
};

const darkColors: ThemeColors = {
  primary: '#FFD700', // Gold
  onPrimary: '#000000',
  primaryContainer: '#4a3e26',
  secondary: '#C0C0C0', // Silver
  onSecondary: '#000000',
  secondaryContainer: '#e6d0a3',
  background1: '#1a2332', // Dark blue-gray (fully opaque)
  background2: '#1e293b', // Slightly lighter dark blue
  background3: '#2d3748',
  surface: '#2d3748',
  error: '#ef4444',
  disabled: '#4A4A4A',
  foreground1: 'rgba(255, 255, 255, 0.98)',
  foreground2: 'rgba(255, 255, 255, 0.94)',
  foreground3: 'rgba(255, 255, 255, 0.87)',
  // Additional colors
  text1: 'rgba(255, 255, 255, 0.98)',
  text2: 'rgba(255, 255, 255, 0.70)',
  border: 'rgba(255, 255, 255, 0.12)',
  // Card gradients - metallic for dark mode
  gbCardGradient: ['#FFD700', '#DAA520', '#B8860B'], // Gold shades for dark
  numberedCardGradient: ['#F5F5F5', '#D3D3D3', '#B8B8B8'], // Platinum/Silver for dark
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('colorMode');
    return (saved as ColorMode) || 'light';
  });

  const colors = colorMode === 'light' ? lightColors : darkColors;

  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
    // Update document class for Tailwind dark mode
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export hook separately for fast refresh
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}