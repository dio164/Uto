import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const CelestialSky: React.FC = () => {
  // Generate random twinkling stars with deterministic patterns
  const stars = useMemo(() => {
    const starList = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 95;
      const left = Math.random() * 98;
      const size = Math.random() * 3 + 1.5;
      const duration = Math.random() * 3 + 2.5;
      const delay = Math.random() * 4;
      const opacity = Math.random() * 0.6 + 0.4;
      const isGold = i % 4 === 0;
      starList.push({
        id: `star-${i}`,
        top: `${top}%`,
        left: `${left}%`,
        size,
        duration,
        delay,
        opacity,
        color: isGold ? '#F6E05E' : '#FFFFFF',
        glow: isGold ? 'rgba(246, 224, 94, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      });
    }
    return starList;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Deep Celestial Pink Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#2E1124] via-[#4D2531] to-[#2A131A] transition-colors duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, #4D2531 0%, #2E1124 45%, #1F0B18 100%)',
        }}
      />

      {/* 2. Soft Dreamy Pink Nebulas & Radiant Light */}
      <div 
        className="absolute top-[-10%] left-[10%] w-[80vw] h-[60vh] rounded-full opacity-40 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.45) 0%, rgba(222, 158, 176, 0.2) 60%, transparent 80%)',
        }}
      />
      <div 
        className="absolute top-[40%] right-[-5%] w-[60vw] h-[60vh] rounded-full opacity-35 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(233, 213, 255, 0.35) 0%, rgba(243, 204, 215, 0.2) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[50vh] rounded-full opacity-30 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(251, 207, 232, 0.35) 0%, rgba(142, 77, 96, 0.25) 50%, transparent 80%)',
        }}
      />

      {/* 3. Twinkling Stars */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.glow}`,
          }}
          animate={{
            opacity: [s.opacity * 0.25, s.opacity, s.opacity * 0.25],
            scale: [0.8, 1.25, 0.8],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 4. Whimsical Shooting Stars */}
      <motion.div
        className="absolute w-[120px] h-[1.5px] bg-gradient-to-r from-transparent via-[#FBCFE8] to-white rounded-full opacity-0"
        style={{ top: '18%', left: '15%', transform: 'rotate(-35deg)' }}
        animate={{
          opacity: [0, 0.9, 0],
          x: [0, 320],
          y: [0, 200],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 9,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute w-[90px] h-[1.5px] bg-gradient-to-r from-transparent via-[#FDE047] to-white rounded-full opacity-0"
        style={{ top: '35%', right: '20%', transform: 'rotate(-40deg)' }}
        animate={{
          opacity: [0, 0.85, 0],
          x: [0, -250],
          y: [0, 180],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          repeatDelay: 14,
          delay: 4,
          ease: 'easeOut',
        }}
      />

      {/* 5. Soft Dreamy Cloud Mist Layers */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 opacity-25 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(248, 228, 234, 0.4) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

