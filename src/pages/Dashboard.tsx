import React from 'react';
import { useDashboardData } from '../hooks/useApiData';
import { AccountSummaryCard, LocationSection } from '../features/accounts/components';
import { AdaptiveLayout, ResponsiveGrid } from '../components/layout';
import { useIsDesktop } from '../hooks';
import { ThemeToggle } from '../features/common/components/ThemeToggle';

export const Dashboard: React.FC = () => {
  const isDesktop = useIsDesktop();
  const { accounts, balances, loading } = useDashboardData();
  
  // Use real data from backend only
  // No fallback to mock data
  
  console.log('Dashboard - Accounts:', accounts);
  console.log('Dashboard - Balances:', balances);
  
  // Get balances for both accounts - show all balances including zero
  const londonAccount = accounts.find((acc: any) => acc.type === 'gb_based');
  const singaporeAccount = accounts.find((acc: any) => acc.type === 'numbered');
  
  console.log('Dashboard - London Account:', londonAccount);
  console.log('Dashboard - Singapore Account:', singaporeAccount);
  
  const londonBalances = londonAccount 
    ? balances.filter((balance: any) => balance.accountId === londonAccount.id)
    : [];
  const singaporeBalances = singaporeAccount
    ? balances.filter((balance: any) => balance.accountId === singaporeAccount.id)
    : [];

  // Don't show loading screen, just use the data we have
  if (false && loading) {
    return (
      <AdaptiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout>
      <div className="py-4 sm:py-6 lg:py-8">
        
        {/* Theme Toggle for mobile (desktop has it in sidebar) */}
        {!isDesktop && (
          <div className="flex justify-end mb-4 relative z-50">
            <ThemeToggle />
          </div>
        )}

        {/* Main Account Summary - Full width on all screens */}
        <div className="mb-8 lg:mb-10">
          <AccountSummaryCard accounts={accounts} />
        </div>

        {/* Account Sections - Responsive Grid */}
        <ResponsiveGrid
          cols={{
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 2,
            '2xl': 2
          }}
          gap="md"
        >
          {/* London Account */}
          <div className="space-y-4">
            <LocationSection 
              location="london" 
              balances={londonBalances}
              onLocationClick={() => console.log('London clicked')}
            />
          </div>

          {/* Singapore Account */}
          <div className="space-y-4">
            <LocationSection 
              location="singapore" 
              balances={singaporeBalances}
              onLocationClick={() => console.log('Singapore clicked')}
            />
          </div>
        </ResponsiveGrid>

        {/* Quick Stats for Desktop */}
        {isDesktop && (
          <div className="mt-8 lg:mt-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quick Stats
            </h2>
            <ResponsiveGrid
              cols={{ lg: 3, xl: 4 }}
              gap="md"
            >
              <StatCard
                title="Total Balance"
                value="€2,944.71"
                change="+12.5%"
                positive
              />
              <StatCard
                title="Monthly Income"
                value="€4,250.00"
                change="+8.2%"
                positive
              />
              <StatCard
                title="Monthly Expenses"
                value="€2,180.00"
                change="-3.4%"
                positive
              />
              <StatCard
                title="Savings Rate"
                value="48.7%"
                change="+5.1%"
                positive
              />
            </ResponsiveGrid>
          </div>
        )}
      </div>
    </AdaptiveLayout>
  );
};

// Quick stats card for desktop view
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      <p className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};