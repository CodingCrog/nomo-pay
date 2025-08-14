import React from 'react';

interface LondonEyeIconProps {
  className?: string;
  opacity?: number;
}

export const LondonEyeIcon: React.FC<LondonEyeIconProps> = ({ 
  className = "w-full h-full", 
  opacity = 0.2 
}) => {
  return (
    <svg className={className} viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice">
      <g transform="translate(200, 50) scale(0.7)">
        {/* Main wheel */}
        <circle cx="0" cy="0" r="35" stroke="white" strokeWidth="2" fill="none" opacity={opacity * 2}/>
        {/* Inner circle */}
        <circle cx="0" cy="0" r="30" stroke="white" strokeWidth="1" fill="none" opacity={opacity * 1.5}/>
        {/* Hub */}
        <circle cx="0" cy="0" r="4" fill="white" opacity={opacity * 2.5}/>
        {/* Spokes */}
        <g opacity={opacity * 1.5}>
          <line x1="0" y1="0" x2="0" y2="-35" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="25" y2="-25" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="35" y2="0" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="25" y2="25" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0" y2="35" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-25" y2="25" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-35" y2="0" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-25" y2="-25" stroke="white" strokeWidth="1.5"/>
        </g>
        {/* Capsules */}
        <rect x="-3" y="-38" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="22" y="-28" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="32" y="-3" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="22" y="22" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="-3" y="32" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="-28" y="22" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="-38" y="-3" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        <rect x="-28" y="-28" width="6" height="4" rx="1" fill="white" opacity={opacity * 2}/>
        {/* Support structure */}
        <line x1="0" y1="35" x2="-15" y2="50" stroke="white" strokeWidth="2" opacity={opacity * 1.5}/>
        <line x1="0" y1="35" x2="15" y2="50" stroke="white" strokeWidth="2" opacity={opacity * 1.5}/>
      </g>
    </svg>
  );
};