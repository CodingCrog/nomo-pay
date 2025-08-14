import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { colors, colorMode, toggleColorMode } = useTheme();
  
  return (
    <button
      onClick={toggleColorMode}
      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
      style={{ 
        backgroundColor: colors.surface,
        color: colors.foreground1
      }}
    >
      {colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};