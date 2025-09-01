import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  ArrowUpDown, 
  ArrowDownLeft,
  RefreshCw,
  UserPlus,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../features/common/components/ThemeToggle';

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string | number;
}

const navSections: NavSection[] = [
  {
    items: [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: CreditCard, label: 'Accounts', path: '/accounts' },
      { icon: History, label: 'Transactions', path: '/transactions' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { icon: ArrowUpDown, label: 'Transfer', path: '/transfer' },
      { icon: ArrowDownLeft, label: 'Deposit', path: '/deposit' },
      { icon: RefreshCw, label: 'Exchange', path: '/exchange' },
      { icon: UserPlus, label: 'Beneficiaries', path: '/beneficiaries' },
    ],
  },
];

const bottomItems: NavItem[] = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64 xl:w-72';
  
  return (
    <div 
      className={`fixed left-0 top-0 h-full ${sidebarWidth} transition-all duration-300 border-r flex flex-col z-40`}
      style={{ 
        backgroundColor: colors.background1,
        borderRightColor: colors.surface
      }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderBottomColor: colors.surface }}>
        <div className="flex items-center gap-3">
          <img 
            src="/images/nomo.png"
            alt="NomoPay" 
            className={isCollapsed ? "w-10 h-10 object-contain mx-auto" : "w-10 h-10 object-contain"}
          />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg" style={{ color: colors.foreground1 }}>NomoPay</h2>
              <p className="text-xs" style={{ color: colors.foreground3 }}>Banking made simple</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: colors.foreground2 }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors absolute right-2"
            style={{ color: colors.foreground2 }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && !isCollapsed && (
              <h3 
                className="text-xs font-semibold uppercase tracking-wider mb-2 px-3"
                style={{ color: colors.foreground3 }}
              >
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
                      color: isActive ? colors.primary : colors.foreground2,
                    }}
                  >
                    <Icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span 
                            className="ml-auto text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: colors.primary,
                              color: 'white'
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Bottom Section */}
      <div className="border-t p-4 space-y-2" style={{ borderTopColor: colors.surface }}>
        {/* Theme Toggle */}
        <div className={`mb-3 ${isCollapsed ? 'flex justify-center' : 'flex justify-end'}`}>
          <ThemeToggle />
        </div>
        
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                isCollapsed ? 'justify-center' : ''
              }`}
              style={{
                backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
                color: isActive ? colors.primary : colors.foreground2,
              }}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
        
        {/* Logout */}
        {!isCollapsed && (
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};