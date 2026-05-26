'use client';

import { useRef, useCallback } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  borderRadius?: number;
  colors?: string[];
  glowColor?: string;
  glowIntensity?: number;
  glowRadius?: number;
  coneSpread?: number;
  edgeSensitivity?: number;
}

export default function BorderGlow({
  children,
  className = '',
  style,
  backgroundColor = '#120F17',
  borderRadius = 16,
  colors = ['#FF6B00', '#FF8533', '#FFB380'],
  glowIntensity = 1,
  glowRadius = 120,
  coneSpread = 60,
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;

      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      // Angle from card center to cursor (0° = top, clockwise)
      const angle = (Math.atan2(y - height / 2, x - width / 2) * 180 / Math.PI + 90 + 360) % 360;
      const half = coneSpread / 2;
      const start = ((angle - half) + 360) % 360;
      const end = (angle + half) % 360;

      // Conic gradient — bright spotlight at cursor angle, dim everywhere else
      const conicBg = start < end
        ? `conic-gradient(from 0deg at 50% 50%, rgba(255,130,0,0.15) 0deg, rgba(255,130,0,0.15) ${start}deg, ${colors[0]} ${angle}deg, rgba(255,130,0,0.15) ${end}deg, rgba(255,130,0,0.15) 360deg)`
        : `conic-gradient(from 0deg at 50% 50%, ${colors[0]} 0deg, rgba(255,130,0,0.15) ${end}deg, rgba(255,130,0,0.15) ${start}deg, ${colors[0]} 360deg)`;

      if (borderGlowRef.current) {
        borderGlowRef.current.style.background = conicBg;
      }

      // Inner spotlight across card surface
      if (innerGlowRef.current) {
        innerGlowRef.current.style.background = `radial-gradient(${glowRadius * 2}px circle at ${x}px ${y}px, rgba(255,120,0,0.18), rgba(255,80,0,0.06) 50%, transparent 70%)`;
      }
    },
    [colors, coneSpread, glowRadius]
  );

  const onMouseEnter = useCallback(() => {
    const op = String(Math.min(1, glowIntensity));
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = op;
    if (innerGlowRef.current) innerGlowRef.current.style.opacity = op;
    if (containerRef.current) {
      containerRef.current.style.boxShadow = `0 0 25px rgba(255,130,0,0.4), 0 0 60px rgba(255,130,0,0.15)`;
    }
  }, [glowIntensity]);

  const onMouseLeave = useCallback(() => {
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = '0';
    if (innerGlowRef.current) innerGlowRef.current.style.opacity = '0';
    if (containerRef.current) containerRef.current.style.boxShadow = 'none';
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        borderRadius,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease',
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Static dim border — always visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: 'rgba(255,130,0,0.2)',
          pointerEvents: 'none',
        }}
      />
      {/* Conic border glow — bright spot traces cursor angle around the border */}
      <div
        ref={borderGlowRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Card interior */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          borderRadius: borderRadius - 2,
          backgroundColor,
          overflow: 'hidden',
        }}
      >
        {children}
        {/* Inner spotlight */}
        <div
          ref={innerGlowRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            filter: 'blur(6px)',
          }}
        />
      </div>
    </div>
  );
}
