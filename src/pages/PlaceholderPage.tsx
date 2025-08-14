import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      <div className="sticky top-0 z-20 backdrop-blur-lg" style={{ backgroundColor: `${colors.background1}E6` }}>
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: colors.surface, color: colors.foreground1 }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: colors.foreground1 }}>
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.foreground1 }}>
            Coming Soon
          </h2>
          <p className="text-lg" style={{ color: colors.foreground3 }}>
            {description || `The ${title} feature is currently under development.`}
          </p>
        </div>
      </div>
    </div>
  );
};