import React from 'react';

interface DroneIconProps {
  className?: string;
  size?: number;
}

export const DroneIcon: React.FC<DroneIconProps> = ({ className = 'w-6 h-6 text-white', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 4 Diagonal Carbon Arms */}
      <line x1="14" y1="14" x2="34" y2="34" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
      <line x1="34" y1="14" x2="14" y2="34" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />

      {/* Top Left Rotor */}
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8" />
      <ellipse cx="12" cy="12" rx="5" ry="1.75" fill="currentColor" transform="rotate(-30 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="#047857" stroke="currentColor" strokeWidth="1" />

      {/* Top Right Rotor */}
      <circle cx="36" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8" />
      <ellipse cx="36" cy="12" rx="5" ry="1.75" fill="currentColor" transform="rotate(30 36 12)" />
      <circle cx="36" cy="12" r="2.2" fill="#047857" stroke="currentColor" strokeWidth="1" />

      {/* Bottom Left Rotor */}
      <circle cx="12" cy="36" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8" />
      <ellipse cx="12" cy="36" rx="5" ry="1.75" fill="currentColor" transform="rotate(30 12 36)" />
      <circle cx="12" cy="36" r="2.2" fill="#047857" stroke="currentColor" strokeWidth="1" />

      {/* Bottom Right Rotor */}
      <circle cx="36" cy="36" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8" />
      <ellipse cx="36" cy="36" rx="5" ry="1.75" fill="currentColor" transform="rotate(-30 36 36)" />
      <circle cx="36" cy="36" r="2.2" fill="#047857" stroke="currentColor" strokeWidth="1" />

      {/* Central Drone Body Pod */}
      <rect x="18" y="18" width="12" height="12" rx="3.5" fill="#022c22" stroke="currentColor" strokeWidth="1.75" />

      {/* Precision Lens / Optical Sensor */}
      <circle cx="24" cy="24" r="3.2" fill="#10b981" />
      <circle cx="24.8" cy="23.2" r="0.9" fill="#ffffff" />

      {/* Spray Atomizer Nozzle Underbody Tip */}
      <circle cx="24" cy="32" r="1.2" fill="#34d399" />
    </svg>
  );
};
