import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { AdaptiveLayout } from '../../components/layout';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description,
  icon: Icon = Construction 
}) => {
  const navigate = useNavigate();

  return (
    <AdaptiveLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Icon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {description}
            </p>
          )}

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-8">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Coming Soon
            </span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </AdaptiveLayout>
  );
};