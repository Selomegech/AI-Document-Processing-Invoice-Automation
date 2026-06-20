import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS, DOC_TYPES } from '../constants';
import { fadeIn, oscillate } from '../utils';

const CENTER_X = 960;
const CENTER_Y = 490;

// Slower, more spread out — only 12 docs, well spaced
// startFrame spacing is ~18 frames apart so viewer sees each one clearly
const FLYING_DOCS = [
  { docIdx: 0, startFrame: 0,   startX: -120,  startY: 200  }, // From left
  { docIdx: 2, startFrame: 18,  startX: 960,   startY: -120 }, // From top center
  { docIdx: 1, startFrame: 36,  startX: 2040,  startY: 300  }, // From right
  { docIdx: 3, startFrame: 54,  startX: 400,   startY: 1200 }, // From bottom-left
  { docIdx: 0, startFrame: 72,  startX: 1600,  startY: 1200 }, // From bottom-right
  { docIdx: 2, startFrame: 90,  startX: -120,  startY: 700  }, // From left-lower
  { docIdx: 1, startFrame: 108, startX: 2040,  startY: 650  }, // From right-lower
  { docIdx: 3, startFrame: 126, startX: 300,   startY: -120 }, // From top-left
  { docIdx: 0, startFrame: 144, startX: 1700,  startY: -120 }, // From top-right
  { docIdx: 2, startFrame: 162, startX: -120,  startY: 450  }, // From left-mid
  { docIdx: 1, startFrame: 180, startX: 960,   startY: 1200 }, // From bottom-center
  { docIdx: 3, startFrame: 198, startX: 2040,  startY: 180  }, // From right-upper
];

// Slow travel: 70 frames each (~2.3 seconds per doc)
const TRAVEL_FRAMES = 70;

// ── Clean, large PDF icon with label ─────────────────────────────────────────
const FlyingPDF: React.FC<{
  startX: number;
  startY: number;
  docIdx: number;
  localFrame: number;
}> = ({ startX, startY, docIdx, localFrame }) => {
  const dt = DOC_TYPES[docIdx];

  const progress = Math.min(localFrame / TRAVEL_FRAMES, 1);

  // Ease-in then ease-out (smooth arc)
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const x = startX + (CENTER_X - startX) * eased;
  const y = startY + (CENTER_Y - startY) * eased;

  // Subtle rotation — gentle, not spinning wildly
  const baseAngle = Math.atan2(CENTER_Y - startY, CENTER_X - startX) * (180 / Math.PI);
  const wobble = Math.sin(localFrame * 0.12) * 4;
  const rotate = progress < 0.85 ? wobble : interpolate(progress, [0.85, 1], [wobble, 0]);

  // Scale: appear full size, shrink only in last 15% as it enters inbox
  const scale = progress < 0.82
    ? 1
    : interpolate(progress, [0.82, 1], [1, 0.12]);

  // Fade in quickly at start, fade out as it enters inbox
  const opacity = progress < 0.1
    ? interpolate(progress, [0, 0.1], [0, 1])
    : progress < 0.82
      ? 1
      : interpolate(progress, [0.82, 1], [1, 0]);

  // Trail glow that fades behind the icon
  const glowOpacity = progress < 0.82 ? 0.25 * Math.sin(progress * Math.PI) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 44,
        top: y - 56,
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 20,
        filter: `drop-shadow(0px 6px 18px ${dt.color}88)`,
      }}
    >
      {/* Main PDF card */}
      <div style={{
        width: 88,
        background: '#1e293b',
        borderRadius: 10,
        border: `2px solid ${dt.color}`,
        overflow: 'hidden',
        boxShadow: `0 8px 28px ${dt.color}44`,
      }}>
        {/* Colored top strip */}
        <div style={{
          background: dt.color,
          padding: '5px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          <span style={{ fontSize: 13 }}>{dt.icon}</span>
          <span style={{
            color: 'white',
            fontSize: 9,
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.05em',
          }}>
            PDF
          </span>
        </div>

        {/* Document lines */}
        <div style={{ padding: '8px 8px 10px' }}>
          {[90, 70, 85, 55].map((w, i) => (
            <div key={i} style={{
              height: 3,
              width: `${w}%`,
              background: '#94a3b8',
              opacity: 0.35,
              borderRadius: 2,
              marginBottom: i < 3 ? 5 : 0,
            }} />
          ))}
        </div>
      </div>

      {/* Label below the icon */}
      <div style={{
        marginTop: 6,
        background: dt.color,
        color: 'white',
        fontSize: 9,
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        borderRadius: 5,
        padding: '3px 6px',
        whiteSpace: 'nowrap',
        boxShadow: `0 2px 10px ${dt.color}66`,
      }}>
        {dt.label}
      </div>
    </div>
  );
};

// ── Light-mode Gmail Inbox ─────────────────────────────────────────────────────
const GmailInbox: React.FC<{ docCount: number; shake: number }> = ({ docCount, shake }) => {
  const rows = [
    { from: 'TechSupply Co.',        subj: 'Invoice #TSC-2026-0472 — IT Equipment',   tagColor: '#2563eb', time: '8:02 AM' },
    { from: 'Capital Grille',        subj: 'Receipt — Client lunch meeting Mar 2026',  tagColor: '#059669', time: '8:14 AM' },
    { from: 'Meridian Holdings LLC', subj: 'New Client Onboarding — James R. Parker',  tagColor: '#ea580c', time: '8:31 AM' },
    { from: 'CloudStack Software',   subj: 'Invoice #CS-2026-0099 — Annual Licenses',  tagColor: '#2563eb', time: '8:47 AM' },
    { from: 'Lone Star Dental',      subj: 'Q2 Financial Statement + Balance Sheet',   tagColor: '#7c3aed', time: '9:03 AM' },
    { from: 'Office Depot',          subj: 'Receipt — Office Supplies Restock',        tagColor: '#059669', time: '9:22 AM' },
    { from: 'Atlas Ventures LLC',    subj: 'Client Onboarding Packet 2026',            tagColor: '#ea580c', time: '9:45 AM' },
  ];

  return (
    <div style={{
      width: 740,
      background: '#ffffff',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 4px 24px rgba(0,0,0,0.10)',
      transform: `translateX(${shake}px)`,
      border: '1px solid #e2e8f0',
    }}>
      {/* Gmail top bar */}
      <div style={{
        background: '#f8fafc',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid #e8eaed',
      }}>
        <svg width="28" height="22" viewBox="0 0 52 40" fill="none">
          <path d="M0 4C0 1.79086 1.79086 0 4 0H48C50.2091 0 52 1.79086 52 4V36C52 38.2091 50.2091 40 48 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="white"/>
          <path d="M4 4L26 22L48 4" stroke="#EA4335" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M4 4V36" stroke="#34A853" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M48 4V36" stroke="#FBBC04" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M4 36H48" stroke="#4285F4" strokeWidth="4.5" strokeLinecap="round"/>
        </svg>
        <span style={{ color: '#374151', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', flex: 1 }}>
          inbox @ apexaccounting.com
        </span>
        {/* Unread badge */}
        <div style={{
          background: '#dc2626',
          color: 'white',
          borderRadius: 20,
          padding: '3px 14px',
          fontSize: 15,
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 0 14px rgba(220,38,38,0.4)',
          minWidth: 38,
          textAlign: 'center',
        }}>
          {docCount}
        </div>
      </div>

      {/* Email rows */}
      {rows.map((row, i) => {
        const isUnread = i < Math.min(docCount, rows.length);
        return (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 20px',
            borderBottom: '1px solid #f1f5f9',
            background: isUnread ? '#eff6ff' : '#ffffff',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isUnread ? '#2563eb' : 'transparent',
              flexShrink: 0,
              boxShadow: isUnread ? '0 0 6px #2563eb' : 'none',
            }} />
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: row.tagColor + '20',
              border: `1.5px solid ${row.tagColor}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: row.tagColor,
              fontFamily: 'Inter, sans-serif', flexShrink: 0,
            }}>
              {row.from.charAt(0)}
            </div>
            <span style={{
              color: isUnread ? '#111827' : '#6b7280',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              fontWeight: isUnread ? 700 : 400,
              width: 165, flexShrink: 0,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>
              {row.from}
            </span>
            <span style={{
              color: '#6b7280',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              fontWeight: isUnread ? 600 : 400,
              color: isUnread ? '#374151' : '#9ca3af',
            } as React.CSSProperties}>
              {row.subj}
            </span>
            <span style={{
              background: row.tagColor + '18',
              color: row.tagColor,
              border: `1px solid ${row.tagColor}40`,
              borderRadius: 5,
              padding: '2px 8px',
              fontSize: 10, fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              📎 PDF
            </span>
            <span style={{
              color: '#9ca3af', fontSize: 11,
              fontFamily: 'Inter, sans-serif',
              width: 58, textAlign: 'right', flexShrink: 0,
            }}>
              {row.time}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Scene 1 ───────────────────────────────────────────────────────────────────
export const Scene1Flood: React.FC = () => {
  const frame = useCurrentFrame();

  // Count arrived docs
  const arrivedCount = FLYING_DOCS.filter(
    (d) => frame >= d.startFrame + TRAVEL_FRAMES
  ).length;

  const baseCount = 43;
  const docCount = baseCount + arrivedCount;

  // Very gentle shake — only after many arrive
  const shake = arrivedCount > 6
    ? oscillate(frame, 5, Math.min((arrivedCount - 6) * 0.3, 3))
    : 0;

  const sceneOpacity = Math.min(frame / 18, 1);
  const headlineOpacity = fadeIn(frame, 0, 25);
  const subtitleOpacity = fadeIn(frame, 30, 30);
  const statsOpacity = fadeIn(frame, 60, 30);

  // Transition pulse at end (AI is coming)
  const pulseOpacity = fadeIn(frame, 208, 32);
  const pulseScale = interpolate(frame, [210, 240], [0.6, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Light blue-white gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, #e8f0ff 0%, #dce8ff 50%, #c5d8ff 100%)',
      }} />

      {/* Subtle dot grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.15 }} width="1920" height="1080">
        {Array.from({ length: 50 }).map((_, i) =>
          Array.from({ length: 30 }).map((_, j) => (
            <circle key={`${i}-${j}`} cx={i * 40} cy={j * 40} r={1.5} fill="#3b82f6" />
          ))
        )}
      </svg>

      {/* ── Flying PDFs ── */}
      {FLYING_DOCS.map((doc, i) => {
        const localFrame = frame - doc.startFrame;
        if (localFrame < 0 || localFrame > TRAVEL_FRAMES + 6) return null;
        return (
          <FlyingPDF
            key={i}
            startX={doc.startX}
            startY={doc.startY}
            docIdx={doc.docIdx}
            localFrame={localFrame}
          />
        );
      })}

      {/* ── Gmail Inbox — Dead Center ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        opacity: sceneOpacity,
        zIndex: 10,
      }}>
        <GmailInbox docCount={docCount} shake={shake} />

        {/* Unread badge below inbox */}
        <div style={{
          marginTop: 14,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 9,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#dc2626',
            boxShadow: '0 0 12px #dc2626',
          }} />
          <span style={{
            color: '#dc2626',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
          }}>
            {docCount} unread PDF documents
          </span>
        </div>
      </div>

      {/* ── Headline — Top Center ── */}
      <div style={{
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: headlineOpacity,
        zIndex: 30,
      }}>
        <div style={{
          color: '#64748b',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Apex Accounting · CPA Firm
        </div>
        <div style={{
          color: '#0f172a',
          fontSize: 36,
          fontWeight: 800,
          lineHeight: 1.25,
          maxWidth: 840,
          margin: '0 auto',
        }}>
          Hundreds of files arriving every day —{' '}
          <span style={{ color: '#2563eb' }}>waiting to be processed</span>
          <br />
          <span style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#475569',
            opacity: subtitleOpacity,
          }}>
            before they ever reach an accounting professional.
          </span>
        </div>
      </div>

      {/* ── Pain stats — Bottom ── */}
      <div style={{
        position: 'absolute',
        bottom: 44,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        opacity: statsOpacity,
        zIndex: 30,
      }}>
        {[
          { icon: '⏱️', val: '15+ hrs/week', label: 'manual entry' },
          { icon: '📂', val: '100s of docs', label: 'sorted by hand' },
          { icon: '⌨️', val: 'Zero automation', label: 'every step is manual' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1.5px solid #dbeafe',
            borderRadius: 12,
            padding: '12px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 2px 16px rgba(37,99,235,0.07)',
          }}>
            <span style={{ fontSize: 26 }}>{stat.icon}</span>
            <div>
              <div style={{ color: '#dc2626', fontWeight: 800, fontSize: 17, fontFamily: 'Inter, sans-serif' }}>
                {stat.val}
              </div>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Transition pulse (AI is coming) ── */}
      <div style={{
        position: 'absolute',
        bottom: -250,
        left: '50%',
        transform: `translateX(-50%) scale(${pulseScale})`,
        opacity: pulseOpacity * 0.45,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, #6366f1 0%, #3b82f6 30%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 50,
      }} />
    </div>
  );
};
