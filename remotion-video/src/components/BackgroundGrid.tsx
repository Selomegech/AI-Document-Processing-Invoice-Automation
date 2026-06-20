import React from 'react';
import { COLORS, WIDTH, HEIGHT } from '../constants';

interface BackgroundGridProps {
  opacity?: number;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ opacity = 1 }) => {
  const gridSize = 60;
  const cols = Math.ceil(WIDTH / gridSize) + 1;
  const rows = Math.ceil(HEIGHT / gridSize) + 1;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {/* Base gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, #111e3a 0%, ${COLORS.bg} 70%)`,
      }} />

      {/* Grid lines */}
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
      >
        {/* Vertical lines */}
        {Array.from({ length: cols }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * gridSize}
            y1={0}
            x2={i * gridSize}
            y2={HEIGHT}
            stroke={COLORS.grid}
            strokeWidth={1}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: rows }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * gridSize}
            x2={WIDTH}
            y2={i * gridSize}
            stroke={COLORS.grid}
            strokeWidth={1}
          />
        ))}
        {/* Center cross glow */}
        <line
          x1={WIDTH / 2}
          y1={0}
          x2={WIDTH / 2}
          y2={HEIGHT}
          stroke={COLORS.blue}
          strokeWidth={1}
          opacity={0.15}
        />
        <line
          x1={0}
          y1={HEIGHT / 2}
          x2={WIDTH}
          y2={HEIGHT / 2}
          stroke={COLORS.blue}
          strokeWidth={1}
          opacity={0.15}
        />
      </svg>

      {/* Corner vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};
