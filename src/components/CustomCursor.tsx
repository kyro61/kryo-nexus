import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const CustomCursor: React.FC = () => {
  const { settings } = useApp();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<'DEFAULT' | 'CLICKABLE' | 'CARD' | 'TYPOGRAPHY'>('DEFAULT');
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
        const isTypography = Boolean(
          target.closest('h1, h2, .font-display, [data-cursor="typo"]')
        );
        const isCard = Boolean(
          target.closest('.interactive-card, .glass-panel, .glass-card-interactive')
        );

        if (isClickable) {
          setCursorState('CLICKABLE');
        } else if (isTypography) {
          setCursorState('TYPOGRAPHY');
        } else if (isCard) {
          setCursorState('CARD');
        } else {
          setCursorState('DEFAULT');
        }
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Trailing lerp animation with spring-like smoothness
    let animationFrameId: number;
    const updateTrailing = () => {
      setTrailingPosition((prev) => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        return {
          x: prev.x + dx * 0.24,
          y: prev.y + dy * 0.24,
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

  if (isTouchDevice || settings.reducedMotion || settings.performanceMode || !settings.customCursor) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden select-none">
      {/* Center Sharp Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        animate={{
          scale: isMouseDown ? 0.6 : cursorState === 'CLICKABLE' ? 1.6 : cursorState === 'TYPOGRAPHY' ? 2 : 1,
          backgroundColor:
            cursorState === 'CLICKABLE'
              ? '#38bdf8'
              : cursorState === 'TYPOGRAPHY'
              ? '#a5f3fc'
              : '#22d3ee',
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 450 }}
      />

      {/* Trailing Dynamic Geometric Reticle */}
      <motion.div
        className="fixed top-0 left-0 border -translate-x-1/2 -translate-y-1/2 transition-colors duration-150"
        style={{
          x: trailingPosition.x,
          y: trailingPosition.y,
        }}
        animate={{
          width:
            cursorState === 'CLICKABLE'
              ? 48
              : cursorState === 'TYPOGRAPHY'
              ? 64
              : cursorState === 'CARD'
              ? 52
              : 26,
          height:
            cursorState === 'CLICKABLE'
              ? 48
              : cursorState === 'TYPOGRAPHY'
              ? 64
              : cursorState === 'CARD'
              ? 52
              : 26,
          borderRadius: cursorState === 'TYPOGRAPHY' ? '4px' : '9999px',
          borderColor:
            cursorState === 'CLICKABLE'
              ? 'rgba(56, 189, 248, 0.85)'
              : cursorState === 'TYPOGRAPHY'
              ? 'rgba(6, 182, 212, 0.65)'
              : cursorState === 'CARD'
              ? 'rgba(6, 182, 212, 0.45)'
              : 'rgba(34, 211, 238, 0.25)',
          backgroundColor:
            cursorState === 'CLICKABLE'
              ? 'rgba(56, 189, 248, 0.08)'
              : cursorState === 'TYPOGRAPHY'
              ? 'rgba(6, 182, 212, 0.04)'
              : 'transparent',
          scale: isMouseDown ? 0.8 : 1,
          rotate: cursorState === 'TYPOGRAPHY' ? 45 : 0,
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      />
    </div>
  );
};
