import React from 'react';
import { useCurrentFrame, spring } from 'remotion';
import { fadeIn } from '../utils';

const FPS = 30;
const springEnter = (frame: number, startAt: number) =>
  spring({ frame: Math.max(0, frame - startAt), fps: FPS, config: { damping: 14, stiffness: 90, mass: 0.9 } });

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

// ── Invoice Draft UI ────────────────────────────────────────────────────────
const InvoiceDraft: React.FC<{ frame: number; appear: number }> = ({ frame, appear }) => {
  const qbGreen = '#2ca01c'; // QuickBooks green theme
  
  // Staggered line items appearing
  const fillStart = 40;
  const line1Appear = springEnter(frame, fillStart);
  const line2Appear = springEnter(frame, fillStart + 15);
  const totalAppear = springEnter(frame, fillStart + 35);
  const sendAppear = springEnter(frame, fillStart + 55);

  return (
    <div style={{
      width: 700, background: 'white', borderRadius: 16, border: `2px solid ${qbGreen}33`,
      boxShadow: `0 24px 60px rgba(44,160,28,0.15), 0 4px 16px rgba(0,0,0,0.05)`,
      opacity: appear, transform: `translateY(${(1 - appear) * 40}px)`, overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ background: '#f8fafc', padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: qbGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 800 }}>
            Q
          </div>
          <div>
            <div style={{ color: '#0f172a', fontSize: 20, fontWeight: 800 }}>Invoice #1042</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Draft saved automatically</div>
          </div>
        </div>
        <div style={{ color: '#64748b', fontSize: 14, textAlign: 'right' }}>
          <div>Billed To:</div>
          <div style={{ color: '#0f172a', fontWeight: 700 }}>Meridian Holdings LLC</div>
        </div>
      </div>

      {/* Line Items */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #cbd5e1', paddingBottom: 12, marginBottom: 16, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
          <div style={{ flex: 1 }}>SERVICE</div>
          <div style={{ width: 100, textAlign: 'right' }}>QTY</div>
          <div style={{ width: 120, textAlign: 'right' }}>RATE</div>
          <div style={{ width: 120, textAlign: 'right' }}>AMOUNT</div>
        </div>

        {/* Line 1 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 16, opacity: line1Appear, transform: `translateY(${(1 - line1Appear) * 10}px)` }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 16 }}>Monthly Bookkeeping</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>Standard tier (October 2026)</div>
          </div>
          <div style={{ width: 100, textAlign: 'right', color: '#334155', fontSize: 16 }}>1</div>
          <div style={{ width: 120, textAlign: 'right', color: '#334155', fontSize: 16 }}>$1,500.00</div>
          <div style={{ width: 120, textAlign: 'right', color: '#0f172a', fontWeight: 700, fontSize: 16 }}>$1,500.00</div>
        </div>

        {/* Line 2 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 24, opacity: line2Appear, transform: `translateY(${(1 - line2Appear) * 10}px)` }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: 16 }}>Tax Preparation Fee</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>Q4 Estimated filings</div>
          </div>
          <div style={{ width: 100, textAlign: 'right', color: '#334155', fontSize: 16 }}>1</div>
          <div style={{ width: 120, textAlign: 'right', color: '#334155', fontSize: 16 }}>$1,000.00</div>
          <div style={{ width: 120, textAlign: 'right', color: '#0f172a', fontWeight: 700, fontSize: 16 }}>$1,000.00</div>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: totalAppear }}>
          <div style={{ width: 300, background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#64748b', fontSize: 14 }}>
              <span>Subtotal</span>
              <span>$2,500.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: qbGreen, fontSize: 24, fontWeight: 800, borderTop: '2px solid #cbd5e1', paddingTop: 12, marginTop: 4 }}>
              <span>Total</span>
              <span>$2,500.00</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, opacity: sendAppear }}>
          <div style={{ background: qbGreen, color: 'white', padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Send Invoice</span>
            <span style={{ fontSize: 18 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Scene 8 ───────────────────────────────────────────────────────────────────
export const Scene8Invoice: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineAppear = springEnter(frame, 0);
  const invoiceAppear = springEnter(frame, 15);
  const agentAppear = springEnter(frame, 30);
  const badgeAppear = springEnter(frame, 100);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
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
        <div style={{ color: '#166534', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Step 6 — Auto-Billing
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          Invoices drafted in <span style={{ color: '#2ca01c' }}>QuickBooks</span> ready to send
        </div>
      </div>

      {/* ── Invoice UI ── */}
      <div style={{
        position: 'absolute', top: 240, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
      }}>
        <InvoiceDraft frame={frame} appear={invoiceAppear} />
      </div>

      {/* ── Agent & Badge (Bottom) ── */}
      <div style={{
        position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 40, zIndex: 30,
      }}>
        <AIAgentLarge appear={agentAppear} />
        <div style={{
          opacity: badgeAppear, transform: `translateX(${(1 - badgeAppear) * -20}px)`,
          background: 'white', padding: '20px 48px', borderRadius: 20,
          border: '2px solid #2ca01c', boxShadow: '0 12px 40px rgba(44,160,28,0.15)',
        }}>
          <div style={{ color: '#2ca01c', fontSize: 32, fontWeight: 800, fontFamily: 'Inter, sans-serif', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>💰</span> Cash flow accelerated
          </div>
          <div style={{ color: '#475569', fontSize: 20, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
            Data seamlessly passed from PDF to CRM to Billing.
          </div>
        </div>
      </div>
    </div>
  );
};
