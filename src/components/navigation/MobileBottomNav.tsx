import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, ArrowUpDown, User, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: CreditCard, label: 'Accounts', path: '/accounts' },
  { icon: ArrowUpDown, label: 'Transfer', path: '/transfer' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: MoreHorizontal, label: 'More', path: '/more' },
];

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg z-50"
      style={{ 
        backgroundColor: `${colors.background1}F0`,
        borderTopColor: colors.surface
      }}
    >
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px]"
              style={{
                color: isActive ? colors.primary : colors.foreground3,
                backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
              }}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs mt-1 font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};