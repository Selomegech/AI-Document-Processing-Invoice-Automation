import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { fadeIn } from '../utils';

const FPS = 30;

const springEnter = (frame: number, startAt: number) =>
  spring({ frame: frame - startAt, fps: FPS, config: { damping: 14, stiffness: 100, mass: 0.8 } });

const FIELDS = [
  { label: 'Client Name',        value: 'James R. Parker',       color: '#2563eb', at: 20  },
  { label: 'Company',            value: 'Meridian Holdings LLC',  color: '#059669', at: 40  },
  { label: 'Business Type',      value: 'LLC — Multi-member',    color: '#ea580c', at: 60  },
  { label: 'Services Requested', value: 'Bookkeeping, Tax Prep', color: '#7c3aed', at: 80 },
  { label: 'Monthly Value',      value: '$2,500 / month',         color: '#0891b2', at: 100 },
  { label: 'Contact Email',      value: 'jparker@meridian.com',  color: '#059669', at: 120 },
];

// ── Extracted field card ──────────────────────────────────────────────────────
const FieldCard: React.FC<{ label: string; value: string; color: string; appear: number }> = ({ label, value, color, appear }) => (
  <div style={{
    opacity: appear,
    transform: `translateX(${(1 - appear) * 40}px) scale(${0.9 + appear * 0.1})`,
    marginBottom: 10,
  }}>
    <div style={{
      background: 'white',
      border: `1.5px solid ${color}33`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 9,
      padding: '9px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: `0 3px 16px ${color}14`,
      minWidth: 290,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 8px ${color}88` }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ color: '#0f172a', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          {value}
        </div>
      </div>
      {appear > 0.95 && <span style={{ color: '#16a34a', fontSize: 16 }}>✓</span>}
    </div>
  </div>
);

// ── PDF mockup ─────────────────────────────────────────────────────────────────
const OnboardingPDF: React.FC<{ frame: number; appear: number; activeFieldIdx: number }> = ({ frame, appear, activeFieldIdx }) => (
  <div style={{
    width: 340,
    background: 'white',
    borderRadius: 14,
    border: '1.5px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 16px 50px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)',
    opacity: appear,
    transform: `translateY(${(1 - appear) * 30}px)`,
  }}>
    {/* Header */}
    <div style={{ background: '#1e3a5f', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 7, background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📋</div>
      <div>
        <div style={{ color: 'white', fontSize: 13, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>Client Onboarding Form</div>
        <div style={{ color: '#94a3b8', fontSize: 10, fontFamily: 'Inter, sans-serif' }}>Apex Accounting · New Client</div>
      </div>
      <div style={{ marginLeft: 'auto', background: '#ea580c', color: 'white', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>PDF</div>
    </div>
    {/* Fields */}
    <div style={{ padding: '14px 18px' }}>
      {FIELDS.map((f, i) => {
        const isActive = i === activeFieldIdx;
        return (
          <div key={i} style={{
            marginBottom: 11, paddingBottom: 11,
            borderBottom: i < FIELDS.length - 1 ? '1px solid #f1f5f9' : 'none',
            background: isActive ? f.color + '10' : 'transparent',
            borderRadius: 6,
            padding: isActive ? '4px 8px' : '0',
            transition: 'background 0.2s',
          }}>
            <div style={{ color: '#94a3b8', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3, fontFamily: 'Inter, sans-serif' }}>
              {f.label}
            </div>
            <div style={{
              color: isActive ? f.color : '#0f172a',
              fontSize: 12, fontWeight: isActive ? 800 : 600,
              fontFamily: 'Inter, sans-serif',
              transition: 'color 0.2s',
            }}>
              {f.value}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ── AI agent ──────────────────────────────────────────────────────────────────
const AIAgent: React.FC<{ appear: number }> = ({ appear }) => (
  <div style={{ opacity: appear, transform: `translateY(${(1 - appear) * 30}px)` }}>
    <svg viewBox="0 0 100 140" width={96} height={135} style={{ filter: 'drop-shadow(0 4px 16px #2563eb44)' }}>
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
      {/* Arm pointing right */}
      <rect x="72" y="82" width="32" height="11" rx="5.5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
    </svg>
  </div>
);

// ── Scene 4 ───────────────────────────────────────────────────────────────────
export const Scene4Extraction: React.FC = () => {
  const frame = useCurrentFrame();

  // Staggered entrances
  const headlineAppear = springEnter(frame, 0);
  const agentAppear    = springEnter(frame, 10);
  const pdfAppear      = springEnter(frame, 18);
  const arrowAppear    = fadeIn(frame, 22, 18);

  // Which field is actively being highlighted on the PDF
  const activeFieldIdx = FIELDS.findLastIndex(f => frame >= f.at);

  // Each card's spring entrance
  const cardAppearsArr = FIELDS.map(f => springEnter(frame, f.at + 8));

  const allDone = frame >= FIELDS[FIELDS.length - 1].at + 30;
  const badgeAppear = allDone ? springEnter(frame, FIELDS[FIELDS.length - 1].at + 30) : 0;
  const routeAppear = allDone ? fadeIn(frame, FIELDS[FIELDS.length - 1].at + 45, 18) : 0;

  // Layout — centered
  // [Agent 96] [gap 28] [PDF 340] [gap 48] [Cards col ~310]
  // Total ≈ 822, center at 960 → start at 960 - 411 = 549
  const OFFSET = (1920 - (96 + 28 + 340 + 48 + 310)) / 2;
  const agentX  = OFFSET;
  const pdfX    = OFFSET + 96 + 28;
  const cardsX  = OFFSET + 96 + 28 + 340 + 48;
  const arrowX  = OFFSET + 96 + 28 + 340 + 10;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 50%, #f0f7ff 0%, #e4efff 55%, #d0e4ff 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }} width="1920" height="1080">
        {Array.from({ length: 49 }).map((_, i) => Array.from({ length: 28 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={i * 40} cy={j * 40} r={1.5} fill="#3b82f6" />
        )))}
      </svg>

      {/* ── Headline ── */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', zIndex: 30,
        opacity: headlineAppear, transform: `translateY(${(1 - headlineAppear) * -20}px)`,
      }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          Step 2 — Accounting Data Extraction
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          Line items, totals, and vendor details <span style={{ color: '#2563eb' }}>catagorized flawlessly</span>
        </div>
      </div>

      {/* ── Agent ── */}
      <div style={{ position: 'absolute', left: agentX, top: '50%', transform: 'translateY(-52%)', zIndex: 20 }}>
        <AIAgent appear={agentAppear} />
        {/* Thinking indicator */}
        {activeFieldIdx >= 0 && activeFieldIdx < FIELDS.length - 1 && (
          <div style={{
            marginTop: 14, background: '#f0f0ff', border: '1px solid #c7d2fe',
            borderRadius: 9, padding: '7px 12px',
            display: 'flex', alignItems: 'center', gap: 7,
            opacity: Math.min(frame / 15, 1),
          }}>
            <span style={{ fontSize: 13 }}>✨</span>
            <span style={{ color: '#4f46e5', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Extracting…</span>
          </div>
        )}
      </div>

      {/* ── Arrow agent → PDF ── */}
      <div style={{
        position: 'absolute', left: agentX + 96, top: '50%',
        transform: 'translateY(-50%)', opacity: arrowAppear, zIndex: 10,
      }}>
        <svg width={28 + 10} height={30}>
          <defs>
            <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="#2563eb88" />
            </marker>
          </defs>
          <line x1="4" y1="15" x2="32" y2="15" stroke="#2563eb88" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr4)" />
        </svg>
      </div>

      {/* ── PDF ── */}
      <div style={{ position: 'absolute', left: pdfX, top: '50%', transform: 'translateY(-52%)', zIndex: 15 }}>
        <OnboardingPDF frame={frame} appear={pdfAppear} activeFieldIdx={activeFieldIdx} />
      </div>

      {/* ── Arrow PDF → cards ── */}
      <div style={{
        position: 'absolute', left: arrowX + 340 - 10, top: '50%',
        transform: 'translateY(-50%)', opacity: arrowAppear, zIndex: 10,
      }}>
        <svg width={60} height={30}>
          <defs>
            <marker id="arr4b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="#2563eb88" />
            </marker>
          </defs>
          <line x1="4" y1="15" x2="54" y2="15" stroke="#2563eb88" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr4b)" />
        </svg>
      </div>

      {/* ── Extracted field cards ── */}
      <div style={{
        position: 'absolute', left: cardsX, top: '50%',
        transform: 'translateY(-50%)', zIndex: 25,
      }}>
        {FIELDS.map((f, i) => (
          <FieldCard
            key={f.label}
            label={f.label}
            value={f.value}
            color={f.color}
            appear={cardAppearsArr[i]}
          />
        ))}
      </div>

      {/* ── Bottom badge ── */}
      <div style={{
        position: 'absolute', bottom: 110, left: '50%', transform: `translateX(-50%) scale(${0.8 + badgeAppear * 0.2})`,
        opacity: badgeAppear, zIndex: 30,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12,
          padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 20px rgba(22,163,74,0.12)',
        }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <span style={{ color: '#16a34a', fontSize: 18, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
            6 fields extracted · 0 errors
          </span>
        </div>

        {/* Routing arrow */}
        <div style={{
          opacity: routeAppear,
          background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12,
          padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>→</span>
          <span style={{ color: '#2563eb', fontSize: 16, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
            Routing to HubSpot CRM…
          </span>
          <span style={{ fontSize: 20 }}>🔶</span>
        </div>
      </div>
    </div>
  );
};
