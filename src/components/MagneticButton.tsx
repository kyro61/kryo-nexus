import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useApp } from '../context/AppContext';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  pullStrength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  pullStrength = 0.35,
  onClick,
  onMouseEnter,
  onMouseLeave,
  id,
  disabled,
  ...rest
}) => {
  const { settings, playSound } = useApp();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 220, mass: 0.15 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || settings.reducedMotion || settings.performanceMode) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * pullStrength);
    y.set(distanceY * pullStrength);
  };

  const handleMouseLeaveInner = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleMouseEnterInner = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    playSound('hover');
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (onClick) onClick(e);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-mono font-medium tracking-tight rounded-xl transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-black font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 border border-cyan-300/40 hover:brightness-110',
    secondary:
      'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/70 hover:border-zinc-500 shadow-md shadow-black/40',
    outline:
      'bg-transparent hover:bg-cyan-950/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 hover:border-cyan-400 shadow-sm shadow-cyan-950/20',
    ghost:
      'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-100 border border-transparent',
    cyber:
      'bg-zinc-950 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10 shadow-lg shadow-cyan-950/30',
  }[variant];

  return (
    <motion.button
      ref={buttonRef}
      id={id}
      disabled={disabled}
      style={{
        x: smoothX,
        y: smoothY,
      }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnterInner}
      onMouseLeave={handleMouseLeaveInner}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...(rest as any)}
    >
      {icon && iconPosition === 'left' && (
        <motion.span
          animate={{ x: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {icon}
        </motion.span>
      )}

      <span className="relative z-10">{children}</span>

      {icon && iconPosition === 'right' && (
        <motion.span
          animate={{ x: isHovered ? 3 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};
