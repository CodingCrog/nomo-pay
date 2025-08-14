import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  TrendingUp, 
  ArrowDownLeft,
  RefreshCw,
  UserPlus,
  ArrowLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Shield,
  Bell
} from 'lucide-react';
import { AdaptiveLayout } from '../components/layout';
import { useTheme } from '../context/ThemeContext';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  action?: () => void;
  destructive?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: ArrowDownLeft, label: 'Deposit', path: '/deposit' },
  { icon: RefreshCw, label: 'Exchange', path: '/exchange' },
  { icon: UserPlus, label: 'Beneficiaries', path: '/beneficiaries' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Shield, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  { icon: LogOut, label: 'Logout', action: () => console.log('Logout'), destructive: true },
];

export const MorePage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  return (
    <AdaptiveLayout>
      <div className="py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: colors.surface, color: colors.foreground1 }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold" style={{ color: colors.foreground1 }}>
            More Options
          </h1>
        </div>
        
        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else if (item.action) {
                    item.action();
                  }
                }}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                  item.destructive 
                    ? 'hover:bg-red-50 dark:hover:bg-red-900/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: colors.surface,
                  color: item.destructive ? '#ef4444' : colors.foreground1,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.path && (
                  <ChevronRight size={18} style={{ color: colors.foreground3 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </AdaptiveLayout>
  );
};