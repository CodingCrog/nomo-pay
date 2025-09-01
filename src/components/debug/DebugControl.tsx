import React, { useState } from 'react';
import { Bug, Eye, EyeOff } from 'lucide-react';

export const DebugControl: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Show in development mode or when VITE_FORCE_DEBUG is set
  if (!import.meta.env.DEV && !import.meta.env.VITE_FORCE_DEBUG) {
    return null;
  }
  
  const toggleDebugPanels = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    // Toggle visibility of all debug panels
    const panels = document.querySelectorAll('[data-debug-panel]');
    panels.forEach(panel => {
      if (newVisibility) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  };
  
  return (
    <div className="fixed top-4 right-4 z-[60]">
      <button
        onClick={toggleDebugPanels}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors"
        title={isVisible ? "Hide all debug panels" : "Show all debug panels"}
      >
        <Bug className="w-4 h-4" />
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="text-xs font-medium">Debug</span>
      </button>
    </div>
  );
};