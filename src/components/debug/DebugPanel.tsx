import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface DebugPanelProps {
  title: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ 
  title, 
  position = 'top-right', 
  children,
  defaultCollapsed = true 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isHidden, setIsHidden] = useState(false);
  
  if (!import.meta.env.VITE_FORCE_DEBUG || isHidden) {
    return null;
  }
  
  const positionClasses = {
    'top-left': 'top-20 left-4',
    'top-right': 'top-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4'
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`} data-debug-panel>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 cursor-pointer"
             onClick={() => setIsCollapsed(!isCollapsed)}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsHidden(true);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="p-4 max-w-2xl max-h-96 overflow-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};