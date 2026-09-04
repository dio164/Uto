import React from 'react';

interface BotanicalCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  color?: string;
}

export const BotanicalCorner: React.FC<BotanicalCornerProps> = ({
  position,
  className = '',
  size = 48,
  color = 'currentColor'
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return '';
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none inline-block ${className}`}
      style={{
        width: size,
        height: size,
        transform: getTransform(),
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Victorian corner scroll & botanical vine */}
        <path
          d="M 6 94 C 6 45, 45 6, 94 6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 14 94 C 14 50, 50 14, 94 14"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.6"
        />
        {/* Corner leaf cluster */}
        <path
          d="M 12 12 C 22 8, 30 18, 22 28 C 16 26, 10 20, 12 12 Z"
          fill={color}
          opacity="0.75"
        />
        <path
          d="M 12 12 C 18 22, 28 30, 28 22 C 26 16, 20 10, 12 12 Z"
          fill={color}
          opacity="0.75"
        />
        {/* Delicate bud flourish */}
        <circle cx="28" cy="8" r="2.5" fill={color} opacity="0.85" />
        <circle cx="8" cy="28" r="2.5" fill={color} opacity="0.85" />
        <circle cx="12" cy="12" r="3.5" fill={color} opacity="0.9" />
        {/* Inner spiral flourish */}
        <path
          d="M 94 6 C 88 12, 85 18, 88 22 C 92 24, 95 20, 93 16"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 6 94 C 12 88, 18 85, 22 88 C 24 92, 20 95, 16 93"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export const OrnamentalDivider: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#B77973'
}) => {
  return (
    <div className={`flex items-center justify-center space-x-3 select-none pointer-events-none ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-current to-transparent opacity-40" style={{ color }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-75" style={{ color }}>
        <path
          d="M12 2 C10 7, 5 10, 2 12 C7 14, 10 19, 12 22 C14 17, 19 14, 22 12 C17 10, 14 5, 12 2 Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="1.5" fill="#FFF9F2" />
      </svg>
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-current to-transparent opacity-40" style={{ color }} />
    </div>
  );
};

export const VintageRoseEmblem: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 80,
  color = '#C5A059'
}) => {
  return (
    <div className={`inline-block select-none pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" style={{ color }}>
        {/* Stylized vintage rose silhouette */}
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        {/* Petals */}
        <path
          d="M50 25 C58 25 65 32 63 42 C61 52 48 56 46 62 C44 56 34 50 35 40 C36 30 44 25 50 25 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <path
          d="M50 32 C54 32 58 36 57 42 C55 48 48 50 47 55 C46 51 40 47 41 41 C42 35 47 32 50 32 Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.75"
        />
        {/* Leaves */}
        <path
          d="M36 54 C26 52 22 62 26 68 C32 66 36 60 36 54 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M64 54 C74 52 78 62 74 68 C68 66 64 60 64 54 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M50 62 L50 78"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="80" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
};
