import React from 'react';
import { COLORS } from '../constants';

interface PDFIconProps {
  label: string;
  color: string;
  width?: number;
  height?: number;
  opacity?: number;
  scale?: number;
}

export const PDFIcon: React.FC<PDFIconProps> = ({
  label,
  color,
  width = 80,
  height = 100,
  opacity = 1,
  scale = 1,
}) => {
  const w = width * scale;
  const h = height * scale;
  const foldSize = w * 0.22;

  return (
    <div style={{ opacity, width: w, height: h, position: 'relative', flexShrink: 0 }}>
      <svg viewBox="0 0 80 100" width={w} height={h}>
        {/* Drop shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={color} floodOpacity="0.35" />
        </filter>

        {/* Page body */}
        <path
          d={`M0,0 L${80 - foldSize * (80 / w)},0 L80,${foldSize * (100 / h)} L80,100 L0,100 Z`}
          fill={COLORS.card}
          stroke={color}
          strokeWidth="1.5"
          filter="url(#shadow)"
        />

        {/* Folded corner */}
        <path
          d={`M${80 - foldSize * (80 / w)},0 L80,${foldSize * (100 / h)} L${80 - foldSize * (80 / w)},${foldSize * (100 / h)} Z`}
          fill={color}
          opacity={0.6}
        />

        {/* PDF label */}
        <rect x="4" y="35" width="72" height="16" rx="3" fill={color} opacity={0.9} />
        <text x="40" y="47" textAnchor="middle" fontSize="9" fill="white" fontFamily="Inter, sans-serif" fontWeight="700">
          PDF
        </text>

        {/* Horizontal lines (document lines) */}
        {[58, 68, 78].map((y) => (
          <rect key={y} x="8" y={y} width="50" height="3" rx="1.5" fill={COLORS.muted} opacity={0.4} />
        ))}
      </svg>

      {/* Label tag */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: color,
        color: COLORS.white,
        fontSize: 9,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        padding: '2px 6px',
        borderRadius: 4,
        opacity: 0.9,
      }}>
        {label}
      </div>
    </div>
  );
};
