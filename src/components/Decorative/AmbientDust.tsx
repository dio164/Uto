import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AmbientDust: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const motes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
    }));
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {motes.map((mote) => (
        <motion.div
          key={mote.id}
          className="absolute rounded-full bg-gold-foil blur-[0.5px]"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            opacity: [0.15, 0.7, 0.2],
            scale: [0.9, 1.3, 0.9],
          }}
          transition={{
            duration: mote.duration,
            delay: mote.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
