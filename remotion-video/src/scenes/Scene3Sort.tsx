import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { DOC_TYPES } from '../constants';
import { oscillate } from '../utils';

const FPS = 30;
const sp = (frame: number, delay: number = 0, cfg = { damping: 14, stiffness: 90, mass: 0.9 }) =>
  spring({ frame: Math.max(0, frame - delay), fps: FPS, config: cfg });

const LANE_COLORS = ['#2563eb', '#059669', '#ea580c', '#7c3aed'];
const LANE_LABELS = ['Vendor Invoice', 'Expense Receipt', 'Onboarding Form', 'Financial Statement'];
const LANE_ICONS  = ['📄', '🧾', '📋', '📊'];

const DOCS = [
  { docIdx: 0, classifyAt: 40,  confidence: 95, lane: 0 },
  { docIdx: 2, classifyAt: 65,  confidence: 92, lane: 2 },
  { docIdx: 1, classifyAt: 90,  confidence: 88, lane: 1 },
  { docIdx: 3, classifyAt: 115, confidence: 91, lane: 3 },
  { docIdx: 1, classifyAt: 140, confidence: 62, lane: -1 },
];
const TRAVEL = 40;

// ── Lane ────────────────────────────────────────────────────────────────────
const Lane: React.FC<{ label: string; color: string; icon: string; docCount: number; slideUp: number }> = ({ label, color, icon, docCount, slideUp }) => (
  <div style={{
    width: 170,
    opacity: slideUp,
    transform: `translateY(${(1 - slideUp) * 60}px)`,  // slides UP from below
  }}>
    <div style={{ background: color, borderRadius: '10px 10px 0 0', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ color: 'white', fontSize: 11, fontWeight: 800, fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>{label}</span>
      {docCount > 0 && <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>{docCount}</div>}
    </div>
    <div style={{ background: color + '10', border: `1.5px solid ${color}33`, borderTop: 'none', borderRadius: '0 0 10px 10px', minHeight: 185, padding: 8 }}>
      {Array.from({ length: docCount }).map((_, i) => (
        <div key={i} style={{ background: 'white', border: `1px solid ${color}28`, borderRadius: 7, padding: '7px 9px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: 13 }}>{icon}</span>
          <div>
            <div style={{ width: 65, height: 4, background: color + '44', borderRadius: 3, marginBottom: 4 }} />
            <div style={{ width: 45, height: 3, background: '#e2e8f0', borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Flying doc arc ──────────────────────────────────────────────────────────
const FlyingDoc: React.FC<{ docIdx: number; toX: number; fromX: number; localF: number }> = ({ docIdx, toX, fromX, localF }) => {
  const dt = DOC_TYPES[docIdx];
  const p = Math.min(localF / TRAVEL, 1);
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const x = fromX + (toX - fromX) * e;
  const y = 480 + Math.sin(p * Math.PI) * -110;
  const op = p > 0.88 ? interpolate(p, [0.88, 1], [1, 0]) : 1;
  return (
    <div style={{ position: 'absolute', left: x - 28, top: y - 34, opacity: op, pointerEvents: 'none', zIndex: 40, filter: `drop-shadow(0 4px 14px ${dt.color}66)` }}>
      <div style={{ width: 56, background: 'white', border: `2px solid ${dt.color}`, borderRadius: 7, overflow: 'hidden', boxShadow: `0 4px 14px ${dt.color}33` }}>
        <div style={{ background: dt.color, padding: '3px 6px', fontSize: 9, color: 'white', fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>{dt.icon} PDF</div>
        <div style={{ padding: '5px 6px' }}>
          {[85, 65, 75].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, background: '#cbd5e1', borderRadius: 2, marginBottom: i < 2 ? 4 : 0 }} />)}
        </div>
      </div>
    </div>
  );
};

export const Scene3Sort: React.FC = () => {
  const frame = useCurrentFrame(); // local frame 0..270 thanks to Sequence

  // ── Entrance springs (directional) ──────────────────────────────────────
  const headlineY  = sp(frame, 0);   // slides DOWN from top
  const agentX     = sp(frame, 8);   // slides in from LEFT
  const docScale   = sp(frame, 18);  // scales + fades in
  const lane0Y     = sp(frame, 6);   // each lane slides UP with stagger
  const lane1Y     = sp(frame, 12);
  const lane2Y     = sp(frame, 18);
  const lane3Y     = sp(frame, 24);
  const statsY     = sp(frame, 30);  // stats slide UP from bottom

  // Currently classifying
  const cur = DOCS.find(d => frame >= d.classifyAt && frame < d.classifyAt + 45);
  const scanning = !!cur;
  const scanProg = cur ? Math.min((frame - cur.classifyAt) / 12, 1) : 0;
  const showBadge = cur && frame >= cur.classifyAt + 14 && frame < cur.classifyAt + 45;
  const badgeA = showBadge ? Math.min((frame - (cur!.classifyAt + 14)) / 8, 1) : 0;
  const eyeGlow = scanning ? 1 : 0.6 + oscillate(frame, 30, 0.2);

  const laneCounts = [0,1,2,3].map(li => DOCS.filter(d => d.lane === li && frame >= d.classifyAt + 45).length);

  const lowDoc = DOCS.find(d => d.lane === -1);
  const showLow = lowDoc && frame >= lowDoc.classifyAt + 14;
  const lowOpacity = showLow ? Math.min((frame - (lowDoc!.classifyAt + 14)) / 15, 1) : 0;

  // ── Layout math (centered) ───────────────────────────────────────────────
  const AGENT_W = 110; const GAP1 = 40; const DOC_W = 182;
  const GAP2 = 55; const LANE_W = 170; const LANE_GAP = 14;
  const totalW = AGENT_W + GAP1 + DOC_W + GAP2 + 4 * LANE_W + 3 * LANE_GAP;
  const OX = (1920 - totalW) / 2;  // ~404px left offset
  const agentLeft   = OX;
  const docLeft     = OX + AGENT_W + GAP1;
  const lanesLeft   = OX + AGENT_W + GAP1 + DOC_W + GAP2;
  const laneCenterX = (i: number) => lanesLeft + i * (LANE_W + LANE_GAP) + LANE_W / 2;
  const docCenterX  = docLeft + DOC_W / 2;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #eff6ff 0%, #e0ecff 50%, #ccdcff 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }} width="1920" height="1080">
        {Array.from({ length: 49 }).map((_, i) => Array.from({ length: 28 }).map((_, j) => (
          <circle key={`${i}-${j}`} cx={i * 40} cy={j * 40} r={1.5} fill="#3b82f6" />
        )))}
      </svg>

      {/* ── Headline — slides DOWN from top ── */}
      <div style={{
        position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', zIndex: 30,
        opacity: headlineY,
        transform: `translateY(${(1 - headlineY) * -36}px)`,  // comes from above
      }}>
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          Step 1 — Financial Document Triage
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          Invoices, receipts, & statements <span style={{ color: '#2563eb' }}>sorted instantly</span>
        </div>
      </div>

      {/* ── Agent — slides in from LEFT ── */}
      <div style={{
        position: 'absolute', left: agentLeft, top: '50%', transform: `translateY(-50%)`,
        opacity: agentX,
        marginLeft: `${(1 - agentX) * -60}px`,  // shifts from left
        zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <svg viewBox="0 0 100 140" width={AGENT_W} height={154} style={{ filter: `drop-shadow(0 4px 20px #2563eb44)` }}>
          <rect x="25" y="65" width="50" height="55" rx="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <rect x="37" y="72" width="26" height="18" rx="4" fill="#2563eb" opacity="0.85" />
          <rect x="41" y="76" width="18" height="10" rx="2" fill="#1d4ed8" />
          <rect x="40" y="52" width="20" height="15" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <rect x="22" y="18" width="56" height="38" rx="14" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <ellipse cx="38" cy="36" rx="7" ry="6" fill="#bfdbfe" />
          <ellipse cx="38" cy="36" rx="4" ry="4" fill="#2563eb" opacity={eyeGlow} />
          <ellipse cx="38" cy="36" rx="1.8" ry="1.8" fill="white" />
          <ellipse cx="62" cy="36" rx="7" ry="6" fill="#bfdbfe" />
          <ellipse cx="62" cy="36" rx="4" ry="4" fill="#2563eb" opacity={eyeGlow} />
          <ellipse cx="62" cy="36" rx="1.8" ry="1.8" fill="white" />
          <line x1="50" y1="18" x2="50" y2="6" stroke="#2563eb" strokeWidth="2" />
          <circle cx="50" cy="4" r="4" fill="#6366f1" />
          <rect x="28" y="116" width="16" height="22" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <rect x="56" y="116" width="16" height="22" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <rect x="72" y="82" width="30" height="12" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
        </svg>
        {scanning && (
          <div style={{ background: '#f0f0ff', border: '1px solid #c7d2fe', borderRadius: 9, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 7, opacity: Math.min((frame - cur!.classifyAt) / 10, 1) }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ color: '#4f46e5', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Gemini analyzing…</span>
          </div>
        )}
      </div>

      {/* ── Scanned doc — scales + fades in from center ── */}
      <div style={{
        position: 'absolute', left: docLeft, top: '50%',
        transform: `translateY(-52%) scale(${0.7 + docScale * 0.3})`,
        opacity: docScale, zIndex: 15,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: DOC_W, background: 'white',
            border: `2px solid ${cur ? DOC_TYPES[cur.docIdx].color : '#cbd5e1'}`,
            borderRadius: 12, overflow: 'hidden',
            boxShadow: cur ? `0 0 30px ${DOC_TYPES[cur.docIdx].color}44` : '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}>
            <div style={{ background: cur ? DOC_TYPES[cur.docIdx].color : '#f1f5f9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{cur ? DOC_TYPES[cur.docIdx].icon : '📄'}</span>
              <span style={{ color: cur ? 'white' : '#64748b', fontSize: 12, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>PDF DOCUMENT</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {[90, 70, 85, 55, 75, 60, 80].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#e2e8f0', borderRadius: 2, marginBottom: i < 6 ? 8 : 0 }} />)}
            </div>
            {scanning && (
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent ${scanProg * 100 - 22}%, #2563eb2a ${scanProg * 100}%, transparent ${scanProg * 100 + 22}%)`, pointerEvents: 'none' }} />
            )}
          </div>
          {showBadge && cur && (
            <div style={{
              position: 'absolute', top: -16, right: -16, opacity: badgeA,
              background: cur.lane === -1 ? '#dc2626' : '#16a34a',
              color: 'white', borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 800, fontFamily: 'Inter, sans-serif',
              boxShadow: cur.lane === -1 ? '0 0 14px #dc262655' : '0 0 14px #16a34a55',
              whiteSpace: 'nowrap',
              transform: `scale(${0.6 + badgeA * 0.4})`,
            }}>
              {cur.lane === -1 ? '⚠️' : '✓'} {cur.confidence}% confidence
            </div>
          )}
        </div>
      </div>

      {/* ── Lanes — each slides UP from below with stagger ── */}
      <div style={{ position: 'absolute', left: lanesLeft, top: '50%', transform: 'translateY(-48%)', display: 'flex', gap: LANE_GAP, zIndex: 20 }}>
        {LANE_LABELS.map((label, i) => (
          <Lane key={label} label={label} color={LANE_COLORS[i]} icon={LANE_ICONS[i]} docCount={laneCounts[i]}
            slideUp={[lane0Y, lane1Y, lane2Y, lane3Y][i]} />
        ))}
      </div>

      {/* ── Flying docs arc ── */}
      {DOCS.filter(d => d.lane >= 0).map((doc, i) => {
        const lf = frame - doc.classifyAt - 10;
        if (lf < 0 || lf > TRAVEL + 5) return null;
        return <FlyingDoc key={i} docIdx={doc.docIdx} toX={laneCenterX(doc.lane)} fromX={docCenterX} localF={lf} />;
      })}

      {/* ── Manual review — slides UP from bottom ── */}
      {showLow && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 180,
          transform: `translateX(-50%) translateY(${(1 - lowOpacity) * 40}px)`,
          opacity: lowOpacity, zIndex: 30,
        }}>
          <div style={{ background: '#fff7ed', border: '1.5px solid #f97316', borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 16px #f9731622' }}>
            <span style={{ fontSize: 26 }}>⚠️</span>
            <div>
              <div style={{ color: '#c2410c', fontSize: 16, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>Manual Review Required</div>
              <div style={{ color: '#9a3412', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Confidence 62% — flagged for human review</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats — slides UP from bottom ── */}
      <div style={{
        position: 'absolute', bottom: 110, left: '50%',
        transform: `translateX(-50%) translateY(${(1 - statsY) * 50}px)`,
        opacity: statsY, display: 'flex', gap: 18, zIndex: 30,
      }}>
        {[
          { val: '< 30 sec', label: 'per document' },
          { val: '4 types',  label: 'auto-categorized' },
          { val: '70%+',     label: 'confidence required' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.92)', border: '1.5px solid #dbeafe', borderRadius: 12, padding: '10px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(37,99,235,0.07)' }}>
            <div style={{ color: '#2563eb', fontSize: 24, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>{s.val}</div>
            <div style={{ color: '#64748b', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
