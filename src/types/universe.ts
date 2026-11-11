export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  path: string;
  badge?: string;
  iconName: string;
  themeColor: string;
  accentColor: string;
  islandStyle: {
    bgGradient: string;
    glowColor: string;
    borderGlow: string;
    floatingDelay: number;
    floatingDuration: number;
  };
  details: {
    featureList: string[];
    tagline: string;
  };
}

export interface UniverseMessage {
  id: string;
  text: string;
  author: string;
  dateContext?: string;
  isSpecialOccasion?: boolean;
}

export interface DiscoveryItem {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationPath: string;
  type: 'letter' | 'recording' | 'memory' | 'milestone' | 'star' | 'flower';
  title: string;
  preview: string;
  date: string;
  badge?: string;
  isLocked?: boolean;
  unlockDate?: string;
}

export interface CelestialStar {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  color: string;
  twinkleDelay: number;
  twinkleDuration: number;
  secretMessage?: string;
}
