import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const CustomCursor: React.FC = () => {
  const { settings } = useApp();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check element under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .clickable')
        );
        const isCard = Boolean(target.closest('.interactive-card, .glass-card-interactive'));

        setIsHoveringClickable(isClickable);
        setIsHoveringCard(isCard && !isClickable);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Trailing lerp animation
    let animationFrameId: number;
    const updateTrailing = () => {
      setTrailingPosition((prev) => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrailing);
    };
    animationFrameId = requestAnimationFrame(updateTrailing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition.x, mousePosition.y, isTouchDevice]);

  if (isTouchDevice || settings.reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
      {/* Center sharp dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        animate={{
          scale: isMouseDown ? 0.7 : isHoveringClickable ? 1.4 : 1,
          backgroundColor: isHoveringClickable ? '#38bdf8' : isHoveringCard ? '#06b6d4' : '#22d3ee',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      />

      {/* Trailing Ring / Reticle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-cyan-400/40 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: trailingPosition.x,
          y: trailingPosition.y,
        }}
        animate={{
          width: isHoveringClickable ? 44 : isHoveringCard ? 56 : 28,
          height: isHoveringClickable ? 44 : isHoveringCard ? 56 : 28,
          borderColor: isHoveringClickable
            ? 'rgba(56, 189, 248, 0.8)'
            : isHoveringCard
            ? 'rgba(6, 182, 212, 0.6)'
            : 'rgba(34, 211, 238, 0.35)',
          backgroundColor: isHoveringClickable
            ? 'rgba(56, 189, 248, 0.08)'
            : isHoveringCard
            ? 'rgba(6, 182, 212, 0.04)'
            : 'transparent',
          scale: isMouseDown ? 0.85 : 1,
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      />
    </div>
  );
};
