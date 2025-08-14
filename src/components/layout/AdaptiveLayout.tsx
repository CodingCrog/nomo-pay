import React from 'react';
import { useIsDesktop } from '../../hooks';
import { DesktopSidebar } from '../navigation/DesktopSidebar';
import { ResponsiveContainer } from './ResponsiveContainer';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  const isDesktop = useIsDesktop();
  
  if (isDesktop && showNavigation) {
    return (
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <div className="flex-1 ml-64 xl:ml-72">
          <ResponsiveContainer>
            {children}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </div>
  );
};