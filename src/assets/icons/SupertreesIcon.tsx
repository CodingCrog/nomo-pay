import React from 'react';

interface SupertreesIconProps {
  className?: string;
  opacity?: number;
}

export const SupertreesIcon: React.FC<SupertreesIconProps> = ({ 
  className = "w-full h-full", 
  opacity = 0.2 
}) => {
  return (
    <svg className={className} viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice">
      <g transform="translate(200, 20) scale(1)">
        {/* Supertree 1 - Large */}
        <g transform="translate(0, 0)">
          {/* Trunk */}
          <path d="M-3,60 L-2,30 L2,30 L3,60" fill="white" opacity={opacity * 2}/>
          {/* Canopy structure */}
          <ellipse cx="0" cy="25" rx="15" ry="8" fill="white" opacity={opacity * 2}/>
          <ellipse cx="0" cy="20" rx="12" ry="6" fill="white" opacity={opacity * 1.5}/>
          <ellipse cx="0" cy="15" rx="8" ry="4" fill="white" opacity={opacity * 1.5}/>
          {/* Branch details */}
          <path d="M0,30 L-10,25 M0,30 L10,25 M0,28 L-8,23 M0,28 L8,23" stroke="white" strokeWidth="0.5" opacity={opacity * 1.5}/>
          {/* Garden elements */}
          <circle cx="-8" cy="22" r="2" fill="white" opacity={opacity}/>
          <circle cx="8" cy="22" r="2" fill="white" opacity={opacity}/>
          <circle cx="0" cy="18" r="2" fill="white" opacity={opacity}/>
        </g>
      </g>
    </svg>
  );
};