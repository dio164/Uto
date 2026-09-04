import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Petal {
  id: number;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  rotateZ: number;
  sway: number;
  opacity: number;
  color: string;
}

export const FloatingPetals: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const petals: Petal[] = useMemo(() => {
    const colors = [
      '#F3CCD7', // light pink
      '#DE9EB0', // blush
      '#C98598', // dusty rose
      '#EAD49E', // pale gold
      '#FFF9F2', // ivory petal
    ];

    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100, // percentage across screen
      size: 10 + Math.random() * 14,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * 12,
      rotateZ: Math.random() * 360,
      sway: 30 + Math.random() * 50,
      opacity: 0.35 + Math.random() * 0.45,
      color: colors[i % colors.length],
    }));
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none"
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.startX}%`,
            top: '-5%',
            width: petal.size,
            height: petal.size * 1.35,
          }}
          initial={{
            y: '-10vh',
            x: 0,
            opacity: 0,
            rotate: petal.rotateZ,
          }}
          animate={{
            y: '115vh',
            x: [0, petal.sway, -petal.sway, petal.sway * 0.5, 0],
            opacity: [0, petal.opacity, petal.opacity * 0.8, 0],
            rotate: [petal.rotateZ, petal.rotateZ + 180, petal.rotateZ + 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Stylized organic petal shape SVG */}
          <svg
            viewBox="0 0 30 40"
            fill="none"
            className="w-full h-full drop-shadow-sm"
          >
            <path
              d="M15 0 C25 10, 30 25, 20 38 C12 42, 2 34, 1 22 C0 10, 8 2, 15 0 Z"
              fill={petal.color}
              opacity={0.85}
            />
            {/* Delicate inner petal vein */}
            <path
              d="M15 5 C16 18, 14 28, 13 36"
              stroke="#FFF9F2"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
