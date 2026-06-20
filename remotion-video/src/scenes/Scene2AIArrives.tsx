import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { fadeIn, springIn, oscillate } from '../utils';

const FPS = 30;

// Tool icons orbiting the AI agent
const ORBIT_TOOLS = [
  { label: 'Gmail',   color: '#ea4335', icon: '✉️',  angle: 0   },
  { label: 'Gemini',  color: '#8b5cf6', icon: '✨',  angle: 90  },
  { label: 'HubSpot', color: '#ea580c', icon: '🔶',  angle: 180 },
  { label: 'Sheets',  color: '#10b981', icon: '📊',  angle: 270 },
];

// AI humanoid figure drawn in SVG (Light mode colors)
const AIAgentFigure: React.FC<{ glow: number; scale: number; opacity: number }> = ({
  glow,
  scale,
  opacity,
}) => (
  <div style={{
    position: 'relative',
    width: 160,
    height: 220,
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: 'center bottom',
    filter: `drop-shadow(0 0 ${24 * glow}px #60a5fa44) drop-shadow(0 0 ${48 * glow}px #3b82f633)`,
  }}>
    <svg viewBox="0 0 160 220" width={160} height={220}>
      {/* Glow circle behind */}
      <ellipse cx="80" cy="110" rx="70" ry="90" fill="#60a5fa" opacity={0.15 * glow} />

      {/* Body */}
      <rect x="45" y="100" width="70" height="80" rx="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />

      {/* Circuit lines on body */}
      <line x1="60" y1="120" x2="100" y2="120" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="132" x2="88" y2="132" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="144" x2="95" y2="144" stroke="#2563eb" strokeWidth="1" opacity="0.4" />
      <circle cx="100" cy="132" r="3" fill="#2563eb" opacity="0.6" />
      <circle cx="88" cy="144" r="3" fill="#10b981" opacity="0.8" />

      {/* Chest chip icon */}
      <rect x="68" y="108" width="24" height="18" rx="4" fill="#2563eb" opacity="0.85" />
      <rect x="72" y="112" width="16" height="10" rx="2" fill="#1d4ed8" />
      <line x1="68" y1="113" x2="64" y2="113" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="68" y1="118" x2="64" y2="118" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="92" y1="113" x2="96" y2="113" stroke="#2563eb" strokeWidth="1.5" />
      <line x1="92" y1="118" x2="96" y2="118" stroke="#2563eb" strokeWidth="1.5" />

      {/* Arms */}
      <rect x="18" y="102" width="26" height="14" rx="7" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="116" y="102" width="26" height="14" rx="7" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />

      {/* Legs */}
      <rect x="52" y="176" width="22" height="38" rx="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="86" y="176" width="22" height="38" rx="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />

      {/* Neck */}
      <rect x="68" y="82" width="24" height="20" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />

      {/* Head */}
      <rect x="42" y="30" width="76" height="56" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />

      {/* Eyes */}
      <ellipse cx="65" cy="55" rx="9" ry="7" fill="#bfdbfe" />
      <ellipse cx="65" cy="55" rx="5" ry="5" fill="#2563eb" opacity={0.95} />
      <ellipse cx="65" cy="55" rx="2.5" ry="2.5" fill="#ffffff" />

      <ellipse cx="95" cy="55" rx="9" ry="7" fill="#bfdbfe" />
      <ellipse cx="95" cy="55" rx="5" ry="5" fill="#2563eb" opacity={0.95} />
      <ellipse cx="95" cy="55" rx="2.5" ry="2.5" fill="#ffffff" />

      {/* Antenna */}
      <line x1="80" y1="30" x2="80" y2="12" stroke="#2563eb" strokeWidth="2" />
      <circle cx="80" cy="9" r="5" fill="#6366f1" stroke="#2563eb" strokeWidth="1.5" />
    </svg>
  </div>
);

// Orbiting tool badge
const OrbitTool: React.FC<{
  label: string;
  color: string;
  icon: string;
  angle: number;
  radius: number;
  frame: number;
  startFrame: number;
}> = ({ label, color, icon, angle, radius, frame, startFrame }) => {
  const appear = Math.min(Math.max((frame - startFrame) / 20, 0), 1);
  const spinAngle = ((frame * 0.6) + angle) * (Math.PI / 180);
  const x = Math.cos(spinAngle) * radius;
  const y = Math.sin(spinAngle) * radius * 0.4;

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      opacity: appear, zIndex: 30,
    }}>
      <div style={{
        background: 'white',
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        boxShadow: `0 8px 24px ${color}33`,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: '#0f172a', fontSize: 14, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export const Scene2AIArrives: React.FC = () => {
  const frame = useCurrentFrame();

  const agentScale = springIn(frame, 0, FPS, { damping: 12, stiffness: 80, mass: 1 });
  const agentOpacity = fadeIn(frame, 0, 18);

  const burstOpacity = frame < 25 ? interpolate(frame, [0, 8, 25], [0, 0.7, 0]) : 0;
  const burstScale = interpolate(frame, [0, 25], [0.2, 3.5], { extrapolateRight: 'clamp' });

  const headlineOpacity = fadeIn(frame, 20, 20);

  const glowPulse = 0.6 + oscillate(frame, 40, 0.4);

  // n8n workflow backdrop
  const backdropOpacity = fadeIn(frame, 15, 30) * 0.12; // lighter backdrop for light mode

  // Scan beam sweeping across
  const beamProgress = interpolate(frame, [50, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const beamOpacity = frame >= 50 && frame <= 120 ? 0.7 : 0;
  const beamX = -400 + beamProgress * 2720;

  // Badge
  const badgeOpacity = fadeIn(frame, 80, 20);
  const badgeScale = springIn(frame, 80, FPS, { damping: 14, stiffness: 120, mass: 0.6 });

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: '#f0f7ff', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Light gradient background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #f0f7ff 0%, #e4efff 55%, #d0e4ff 100%)' }} />

      {/* Grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }} width="1920" height="1080">
        {Array.from({ length: 33 }).map((_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke="#3b82f6" strokeWidth={1} />)}
        {Array.from({ length: 19 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke="#3b82f6" strokeWidth={1} />)}
      </svg>

      {/* n8n workflow screenshot backdrop */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: `url('/n8n workflow.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: backdropOpacity, filter: 'blur(3px)',
      }} />

      {/* Radial burst on arrival */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${burstScale})`, opacity: burstOpacity,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, #bfdbfe 0%, #60a5fa 30%, transparent 70%)',
        pointerEvents: 'none', zIndex: 5,
      }} />

      {/* Scan beam */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: beamX, width: 300,
        opacity: beamOpacity, background: 'linear-gradient(90deg, transparent, #60a5fa22, #60a5fa44, #60a5fa22, transparent)',
        pointerEvents: 'none', zIndex: 40,
      }} />

      {/* ── AI Agent + orbiting tools ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 20, width: 600, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          border: `2px solid #3b82f644`, boxShadow: `0 0 60px #3b82f622`, opacity: agentOpacity,
        }} />
        <div style={{
          position: 'absolute', width: 220, height: 220, borderRadius: '50%',
          border: `1px solid #6366f155`, opacity: agentOpacity,
        }} />

        {ORBIT_TOOLS.map((tool, i) => (
          <OrbitTool key={tool.label} {...tool} radius={240} frame={frame} startFrame={20 + i * 12} />
        ))}

        <div style={{ position: 'relative', zIndex: 25 }}>
          <AIAgentFigure glow={glowPulse} scale={agentScale} opacity={agentOpacity} />
        </div>
      </div>

      {/* ── Headline ── */}
      <div style={{
        position: 'absolute', top: 120, left: 100, right: 100, textAlign: 'center',
        opacity: headlineOpacity, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          padding: '24px 48px',
          borderRadius: 24,
          border: '1.5px solid #bfdbfe',
          boxShadow: '0 16px 40px rgba(37,99,235,0.08)',
          maxWidth: 1400,
        }}>
          <div style={{
            color: '#0f172a', fontSize: 42, fontWeight: 800, lineHeight: 1.3,
          }}>
            Meet this AI automation tool built for finance and accounting firms
          </div>
          <div style={{
            color: '#2563eb', fontSize: 32, fontWeight: 700, marginTop: 12,
          }}>
            with a huge amount of data incoming every day.
          </div>
        </div>
      </div>

      {/* ── "Zero-Touch Automation" badge ── */}
      <div style={{
        position: 'absolute', bottom: 100, left: '50%', transform: `translateX(-50%) scale(${badgeScale})`,
        opacity: badgeOpacity, zIndex: 30,
      }}>
        <div style={{
          background: 'white', border: '2px solid #3b82f6', borderRadius: 20, padding: '20px 48px',
          display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 16px 40px rgba(37,99,235,0.15)',
        }}>
          <span style={{ fontSize: 36 }}>🤖</span>
          <div>
            <div style={{ color: '#2563eb', fontSize: 32, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
              Zero-Touch AI Automation
            </div>
            <div style={{ color: '#64748b', fontSize: 20, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Every document handled — no human input required
            </div>
          </div>
          <span style={{ fontSize: 36 }}>⚡</span>
        </div>
      </div>
    </div>
  );
};
