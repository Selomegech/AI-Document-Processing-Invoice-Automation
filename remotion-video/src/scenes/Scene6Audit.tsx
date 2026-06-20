import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { fadeIn } from '../utils';

const FPS = 30;
const springEnter = (frame: number, startAt: number) =>
  spring({ frame: Math.max(0, frame - startAt), fps: FPS, config: { damping: 14, stiffness: 90, mass: 0.9 } });

// ── Google Sheets Cell ───────────────────────────────────────────────────────
const SheetCell: React.FC<{ value: string; isNew?: boolean; frame: number; popFrame?: number }> = ({ value, isNew, frame, popFrame = 0 }) => {
  const appear = isNew ? (frame >= popFrame ? 1 : 0) : 1;
  const scale = isNew ? spring({ frame: Math.max(0, frame - popFrame), fps: FPS, config: { damping: 12 } }) : 1;
  const bg = isNew ? interpolate(frame - popFrame, [0, 30], [1, 0]) : 0;

  return (
    <div style={{
      flex: 1, padding: '12px 16px',
      borderRight: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      color: '#334155', fontSize: 16, fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      background: isNew ? `rgba(16, 185, 129, ${bg * 0.15})` : 'transparent',
    }}>
      <div style={{ opacity: appear, transform: `scale(${isNew ? 0.9 + scale * 0.1 : 1})`, transformOrigin: 'left center' }}>
        {value}
      </div>
    </div>
  );
};

// ── Google Sheets Row ────────────────────────────────────────────────────────
const SheetRow: React.FC<{ data: string[]; isHeader?: boolean; isNew?: boolean; frame?: number; popFrameOffset?: number }> = ({ data, isHeader, isNew, frame = 0, popFrameOffset = 0 }) => (
  <div style={{
    display: 'flex', width: '100%',
    background: isHeader ? '#f8fafc' : 'white',
    fontWeight: isHeader ? 700 : 400,
    borderBottom: isHeader ? '2px solid #cbd5e1' : 'none',
  }}>
    <div style={{
      width: 40, background: '#f1f5f9', borderRight: '2px solid #cbd5e1', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 700,
    }}>
      {isHeader ? '' : '1'}
    </div>
    {data.map((val, i) => (
      <SheetCell key={i} value={val} isNew={isNew && !isHeader} frame={frame} popFrame={popFrameOffset + i * 5} />
    ))}
  </div>
);

// ── AI Agent ─────────────────────────────────────────────────────────────────
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

// ── Scene 6 ───────────────────────────────────────────────────────────────────
export const Scene6Audit: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineAppear = springEnter(frame, 0);
  const sheetAppear = springEnter(frame, 10);
  const agentAppear = springEnter(frame, 20);

  const fillStart = 40;
  const badgeAppear = springEnter(frame, fillStart + 35);

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
        position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', zIndex: 30,
        opacity: headlineAppear, transform: `translateY(${(1 - headlineAppear) * -30}px)`,
      }}>
        <div style={{ color: '#047857', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Step 4 — The Audit Trail
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          Everything logged to <span style={{ color: '#10b981' }}>Google Sheets</span> for compliance
        </div>
      </div>

      {/* ── Google Sheets Window ── */}
      <div style={{
        position: 'absolute', top: 260, left: '50%', transform: `translateX(-50%) translateY(${(1 - sheetAppear) * 40}px)`,
        width: 1200, background: 'white', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(16,185,129,0.15), 0 4px 16px rgba(0,0,0,0.05)',
        opacity: sheetAppear, zIndex: 20, border: '1.5px solid #a7f3d0'
      }}>
        {/* Sheets Toolbar */}
        <div style={{ background: '#f8fafc', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 32, height: 32, background: '#10b981', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 800 }}>
            ⊞
          </div>
          <div>
            <div style={{ color: '#0f172a', fontSize: 16, fontWeight: 700 }}>Master Client Log 2026</div>
            <div style={{ color: '#64748b', fontSize: 12 }}>File Edit View Insert Format Data Tools</div>
          </div>
        </div>

        {/* Grid Area */}
        <div style={{ display: 'flex' }}>
          {/* Columns Header */}
          <div style={{ width: '100%', background: 'white' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <div style={{ width: 40, borderRight: '2px solid #cbd5e1' }} />
              {['A', 'B', 'C', 'D', 'E', 'F'].map(l => (
                <div key={l} style={{ flex: 1, padding: '6px 0', textAlign: 'center', color: '#64748b', fontSize: 13, fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>{l}</div>
              ))}
            </div>
            
            {/* Rows */}
            <SheetRow data={['Date', 'Client Name', 'Company', 'Business Type', 'Monthly Value', 'Email']} isHeader />
            <div style={{ position: 'relative' }}>
              {/* Highlight Box around the new row */}
              <div style={{
                position: 'absolute', inset: 0, border: '2px solid #10b981', pointerEvents: 'none', zIndex: 10,
                opacity: frame >= fillStart ? 1 : 0, transition: 'opacity 0.2s'
              }} />
              <SheetRow 
                data={['2026-10-15', 'James R. Parker', 'Meridian Holdings LLC', 'LLC — Multi-member', '$2,500 / month', 'jparker@meridian.com']} 
                isNew frame={frame} popFrameOffset={fillStart} 
              />
            </div>
            <SheetRow data={['2026-10-14', 'Sarah Chen', 'Nexus Tech', 'S-Corp', '$3,500 / month', 'schen@nexustech.io']} />
            <SheetRow data={['2026-10-12', 'Michael Ross', 'Summit Logistics', 'LLC', '$1,200 / month', 'mross@summitlog.com']} />
            <SheetRow data={['', '', '', '', '', '']} />
          </div>
        </div>
      </div>

      {/* ── AI Agent + Badge (Bottom Center) ── */}
      <div style={{
        position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 40, zIndex: 30,
      }}>
        <AIAgentLarge appear={agentAppear} />
        <div style={{
          opacity: badgeAppear, transform: `translateX(${(1 - badgeAppear) * -20}px)`,
          background: 'white', padding: '20px 48px', borderRadius: 20,
          border: '2px solid #10b981', boxShadow: '0 12px 40px rgba(16,185,129,0.15)',
        }}>
          <div style={{ color: '#10b981', fontSize: 32, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>✅</span> Always in Sync
          </div>
          <div style={{ color: '#475569', fontSize: 20, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
            Searchable, reliable, and compliance-ready.
          </div>
        </div>
      </div>
    </div>
  );
};
