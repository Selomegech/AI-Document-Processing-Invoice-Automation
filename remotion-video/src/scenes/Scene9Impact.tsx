import React from 'react';
import { useCurrentFrame, spring } from 'remotion';
import { fadeIn } from '../utils';

const FPS = 30;
const springEnter = (frame: number, startAt: number, config = { damping: 14, stiffness: 90, mass: 0.9 }) =>
  spring({ frame: Math.max(0, frame - startAt), fps: FPS, config });

const TOOLS = [
  { name: 'n8n',        icon: '⚙️', color: '#ff6d5a' },
  { name: 'Gemini',     icon: '✨', color: '#8b5cf6' },
  { name: 'HubSpot',    icon: '🔶', color: '#ea580c' },
  { name: 'Gmail',      icon: '✉️', color: '#ea4335' },
  { name: 'Sheets',     icon: '📊', color: '#10b981' },
  { name: 'QuickBooks', icon: 'Q', color: '#2ca01c' },
];

export const Scene9Impact: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = fadeIn(frame, 0, 15);
  const headlineScale = springEnter(frame, 10, { damping: 12, stiffness: 80, mass: 1 });
  const sublineOpacity = fadeIn(frame, 25, 20);
  
  // Stagger the tools appearing
  const toolsStart = 40;

  const ctaOpacity = fadeIn(frame, 70, 20);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: '#f0f7ff', fontFamily: 'Inter, sans-serif', color: '#0f172a',
      opacity: bgOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Background Gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #f0f7ff 0%, #e4efff 55%, #d0e4ff 100%)' }} />

      {/* Grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }} width="1920" height="1080">
        {Array.from({ length: 33 }).map((_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke="#3b82f6" strokeWidth={1} />)}
        {Array.from({ length: 19 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke="#3b82f6" strokeWidth={1} />)}
      </svg>

      {/* ── Big Impact Metric ── */}
      <div style={{
        transform: `scale(${headlineScale})`,
        textAlign: 'center', zIndex: 10,
        marginBottom: 80,
      }}>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.1, color: '#0f172a' }}>
          100+ Hours Saved
        </div>
        <div style={{ color: '#2563eb', fontSize: 40, fontWeight: 800, letterSpacing: '0.05em' }}>
          EVERY SINGLE MONTH
        </div>
      </div>

      {/* ── Tools Stack Showcase ── */}
      <div style={{
        textAlign: 'center', zIndex: 10, opacity: sublineOpacity, marginBottom: 40
      }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
          Powered by your existing tech stack
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          {TOOLS.map((tool, i) => {
            const appear = springEnter(frame, toolsStart + i * 4, { damping: 12, stiffness: 120 });
            return (
              <div key={tool.name} style={{
                transform: `scale(${appear}) translateY(${(1 - appear) * 20}px)`,
                background: 'white', border: `1.5px solid #e2e8f0`, borderRadius: 16,
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: `0 8px 30px rgba(0,0,0,0.05)`
              }}>
                <span style={{ fontSize: 28, color: tool.name === 'QuickBooks' ? tool.color : 'inherit', fontWeight: tool.name === 'QuickBooks' ? 800 : 'normal' }}>
                  {tool.icon}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{tool.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Final Call to Action ── */}
      <div style={{
        position: 'absolute', bottom: 60, opacity: ctaOpacity, zIndex: 10,
        background: 'white', border: '2px solid #10b981',
        borderRadius: 40, padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 8px 30px rgba(16,185,129,0.2)'
      }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>AUTOMATION LIVE</span>
      </div>
    </div>
  );
};
