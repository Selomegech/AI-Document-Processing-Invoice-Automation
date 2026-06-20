import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { fadeIn } from '../utils';

const FPS = 30;

const springEnter = (frame: number, startAt: number) =>
  spring({ frame: frame - startAt, fps: FPS, config: { damping: 14, stiffness: 90, mass: 0.9 } });

// ── Kanban Column ────────────────────────────────────────────────────────────
const KanbanColumn: React.FC<{ title: string; color: string; appear: number; children: React.ReactNode }> = ({ title, color, appear, children }) => (
  <div style={{
    width: 360, // Much larger width
    background: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderTop: `6px solid ${color}`,
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
    opacity: appear,
    transform: `translateY(${(1 - appear) * 40}px)`,
  }}>
    <div style={{
      color: '#334155', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif',
      marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #e2e8f0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      {title}
      <span style={{ fontSize: 16, color: '#94a3b8' }}>•••</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </div>
  </div>
);

// ── Deal Card ───────────────────────────────────────────────────────────────
const DealCard: React.FC<{ company: string; value: string; date: string; tag: string; tagColor: string; isNew?: boolean; popFrame?: number }> = ({ company, value, date, tag, tagColor, isNew, popFrame = 0 }) => {
  const frame = useCurrentFrame();
  const scale = isNew ? spring({ frame: Math.max(0, frame - popFrame), fps: FPS, config: { damping: 12 } }) : 1;
  const opacity = isNew ? (frame >= popFrame ? 1 : 0) : 1;

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 18,
      border: isNew ? `2.5px solid #ea580c` : `1.5px solid #e2e8f0`,
      boxShadow: isNew ? '0 12px 40px rgba(234,88,12,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
      transform: `scale(${isNew ? 0.8 + scale * 0.2 : 1})`,
      opacity,
      position: 'relative',
    }}>
      {isNew && (
        <div style={{ position: 'absolute', top: -14, right: -14, background: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 800, fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(234,88,12,0.4)' }}>
          ✨ AI ADDED
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ background: tagColor + '22', color: tagColor, padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
          {tag}
        </span>
        <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{date}</span>
      </div>
      <div style={{ color: '#0f172a', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
        {company}
      </div>
      <div style={{ color: '#059669', fontSize: 18, fontWeight: 700, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
        💵 {value}
      </div>
    </div>
  );
};

// ── AI Agent ──────────────────────────────────────────────────────────────────
const AIAgentLarge: React.FC<{ appear: number }> = ({ appear }) => (
  <div style={{ opacity: appear, transform: `translateY(${(1 - appear) * 40}px) scale(1.2)` }}>
    <svg viewBox="0 0 100 140" width={120} height={168} style={{ filter: 'drop-shadow(0 8px 24px #2563eb44)' }}>
      <rect x="25" y="65" width="50" height="55" rx="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="37" y="72" width="26" height="18" rx="4" fill="#2563eb" opacity="0.85" />
      <rect x="41" y="76" width="18" height="10" rx="2" fill="#1d4ed8" />
      <rect x="40" y="52" width="20" height="15" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="22" y="18" width="56" height="38" rx="14" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <ellipse cx="38" cy="36" rx="7" ry="6" fill="#bfdbfe" />
      <ellipse cx="38" cy="36" rx="4" ry="4" fill="#2563eb" opacity="0.95" />
      <ellipse cx="38" cy="36" rx="1.8" ry="1.8" fill="white" />
      <ellipse cx="62" cy="36" rx="7" ry="6" fill="#bfdbfe" />
      <ellipse cx="62" cy="36" rx="4" ry="4" fill="#2563eb" opacity="0.95" />
      <ellipse cx="62" cy="36" rx="1.8" ry="1.8" fill="white" />
      <line x1="50" y1="18" x2="50" y2="6" stroke="#2563eb" strokeWidth="2" />
      <circle cx="50" cy="4" r="4" fill="#6366f1" />
      <rect x="28" y="116" width="16" height="22" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="56" y="116" width="16" height="22" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
    </svg>
  </div>
);

// ── Extracted Data Flying In ──────────────────────────────────────────────────
const FlyingData: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  if (frame < startAt) return null;
  const p = Math.min((frame - startAt) / 25, 1);
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const x = -300 + (650 - -300) * e;
  const y = 300 + Math.sin(p * Math.PI) * -150;
  const op = p > 0.9 ? interpolate(p, [0.9, 1], [1, 0]) : 1;

  return (
    <div style={{
      position: 'absolute', left: x, top: y, opacity: op, zIndex: 40,
      background: 'white', padding: '12px 24px', borderRadius: 12,
      border: '2px solid #2563eb', boxShadow: '0 8px 30px rgba(37,99,235,0.3)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 24 }}>⚡</span>
      <div>
        <div style={{ color: '#2563eb', fontSize: 14, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>Parsed Data</div>
        <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Meridian Holdings LLC</div>
      </div>
    </div>
  );
};

export const Scene5CRM: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineAppear = springEnter(frame, 0);
  const col1Appear = springEnter(frame, 10);
  const col2Appear = springEnter(frame, 15);
  const col3Appear = springEnter(frame, 20);
  const agentAppear = springEnter(frame, 30);
  
  const flightStart = 45;
  const dealPopFrame = flightStart + 24;
  const badgeAppear = springEnter(frame, dealPopFrame + 15);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* Light blue background to match previous scenes */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #f0f7ff 0%, #e4efff 55%, #d0e4ff 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }} width="1920" height="1080">
        {Array.from({ length: 49 }).map((_, i) => Array.from({ length: 28 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={i * 40} cy={j * 40} r={1.5} fill="#3b82f6" />
        )))}
      </svg>

      {/* ── Headline ── */}
      <div style={{
        position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', zIndex: 30,
        opacity: headlineAppear, transform: `translateY(${(1 - headlineAppear) * -30}px)`,
      }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Step 3 — HubSpot CRM Integration
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          New clients <span style={{ color: '#ea580c' }}>automatically added</span> to a CRM pipeline
        </div>
      </div>

      {/* ── Kanban Board (Centered layout with 3 large columns) ── */}
      <div style={{
        position: 'absolute', top: 220, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 32, zIndex: 20,
      }}>
        {/* Column 1: Lead In */}
        <KanbanColumn title="Lead In" color="#94a3b8" appear={col1Appear}>
          <DealCard company="Summit Logistics" value="$1,200 / mo" date="Oct 12" tag="Consulting" tagColor="#8b5cf6" />
          <DealCard company="Nexus Tech" value="$3,500 / mo" date="Oct 14" tag="Tax Prep" tagColor="#3b82f6" />
        </KanbanColumn>

        {/* Column 2: New Client / Onboarding */}
        <KanbanColumn title="New Client / Onboarding" color="#ea580c" appear={col2Appear}>
          <DealCard company="Pioneer Design" value="$800 / mo" date="Oct 15" tag="Bookkeeping" tagColor="#10b981" />
          
          {/* The new card added by AI */}
          {frame >= flightStart && (
             <DealCard company="Meridian Holdings LLC" value="$2,500 / mo" date="Just Now" tag="Multi-service" tagColor="#ea580c" isNew={true} popFrame={dealPopFrame} />
          )}
        </KanbanColumn>

        {/* Column 3: Active Client */}
        <KanbanColumn title="Active Client" color="#10b981" appear={col3Appear}>
          <DealCard company="Apex Capital" value="$5,000 / mo" date="Sep 28" tag="Full Service" tagColor="#3b82f6" />
        </KanbanColumn>
      </div>

      {/* ── AI Agent (Bottom Left) ── */}
      <div style={{
        position: 'absolute', left: 160, bottom: 80, zIndex: 30,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <AIAgentLarge appear={agentAppear} />
        <div style={{
          opacity: badgeAppear, transform: `translateX(${(1 - badgeAppear) * -30}px)`,
          background: 'white', padding: '16px 24px', borderRadius: 16,
          border: '2px solid #ea580c', boxShadow: '0 12px 40px rgba(234,88,12,0.15)',
        }}>
          <div style={{ color: '#ea580c', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
            100% Zero-Touch
          </div>
          <div style={{ color: '#475569', fontSize: 16, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
            HubSpot updated instantly via n8n API.
          </div>
        </div>
      </div>

      {/* ── Flying Data Animation ── */}
      <FlyingData startAt={flightStart} />

    </div>
  );
};
