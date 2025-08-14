import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ActionButtonProps {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'outline',
  size = 'md',
  className = '',
}) => {
  const { colors } = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: colors.onPrimary,
          borderColor: colors.primary,
          hover: {
            backgroundColor: colors.primary + 'ee',
          },
          shadow: '0 4px 12px rgba(184, 134, 11, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: colors.onSecondary,
          borderColor: colors.secondary,
          hover: {
            backgroundColor: colors.secondary + 'ee',
          },
          shadow: '0 4px 12px rgba(192, 192, 192, 0.3)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          borderColor: colors.primary + '60',
          hover: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary,
          },
          shadow: 'none',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
    }
  };

  const styles = getVariantStyles();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex items-center justify-center gap-2 rounded-xl border-2 font-medium
        transition-all duration-300 ease-out transform hover:scale-105 whitespace-nowrap
        ${getSizeClasses()}
        ${className}
      `}
      style={{
        backgroundColor: isHovered ? styles.hover.backgroundColor : styles.backgroundColor,
        color: styles.color,
        borderColor: isHovered && styles.hover.borderColor ? styles.hover.borderColor : styles.borderColor,
        boxShadow: styles.shadow,
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      <span>{label}</span>
    </button>
  );
};