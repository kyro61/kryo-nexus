import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useApp } from '../context/AppContext';

export const ScrollProgressBar: React.FC = () => {
  const { settings } = useApp();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-zinc-900/20 backdrop-blur-xs">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        style={{ scaleX }}
      />
      {/* Subtle indicator tag on bottom right of screen when scrolling */}
      {percent > 2 && percent < 98 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono text-zinc-400 backdrop-blur-md shadow-lg select-none z-40"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>POSITION: {percent}%</span>
        </motion.div>
      )}
    </div>
  );
};
