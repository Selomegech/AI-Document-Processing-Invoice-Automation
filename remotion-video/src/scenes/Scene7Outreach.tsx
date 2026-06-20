import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
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
      {/* Arms up holding the message */}
      <rect x="12" y="80" width="30" height="12" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" transform="rotate(-30 25 80)" />
      <rect x="58" y="80" width="30" height="12" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" transform="rotate(30 75 80)" />
    </svg>
  </div>
);

// ── Slack Notification ────────────────────────────────────────────────────────
const SlackNotification: React.FC<{ appear: number }> = ({ appear }) => (
  <div style={{
    width: 500, background: 'white', borderRadius: 16, border: '1.5px solid #e2e8f0',
    padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
    opacity: appear, transform: `translateY(${(1 - appear) * 50}px) scale(${0.9 + appear * 0.1})`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#4A154B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        💬
      </div>
      <div>
        <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 800 }}>#new-clients</div>
        <div style={{ color: '#64748b', fontSize: 14 }}>Automated via n8n</div>
      </div>
      <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 14 }}>Just now</div>
    </div>
    <div style={{ color: '#334155', fontSize: 16, lineHeight: 1.5 }}>
      <strong>New Client Onboarded! 🎉</strong><br/>
      <strong>Meridian Holdings LLC</strong> has been processed and added to HubSpot.<br/>
      Estimated Value: <span style={{ color: '#059669', fontWeight: 800 }}>$2,500/mo</span>
    </div>
  </div>
);

// ── Email Notification ────────────────────────────────────────────────────────
const EmailNotification: React.FC<{ appear: number }> = ({ appear }) => (
  <div style={{
    width: 500, background: 'white', borderRadius: 16, border: '1.5px solid #e2e8f0',
    padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
    opacity: appear, transform: `translateY(${(1 - appear) * 50}px) scale(${0.9 + appear * 0.1})`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ea4335', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        ✉️
      </div>
      <div>
        <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 800 }}>Welcome to Apex Accounting!</div>
        <div style={{ color: '#64748b', fontSize: 14 }}>To: jparker@meridian.com</div>
      </div>
      <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 14 }}>Just now</div>
    </div>
    <div style={{ color: '#334155', fontSize: 16, lineHeight: 1.5 }}>
      Hi James,<br/>
      We’ve successfully processed your onboarding documents. Our team will reach out shortly to kick off our services.
    </div>
  </div>
);

// ── Scene 7 ───────────────────────────────────────────────────────────────────
export const Scene7Outreach: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineAppear = springEnter(frame, 0);
  const agentAppear = springEnter(frame, 10);
  
  const slackAppear = springEnter(frame, 30);
  const emailAppear = springEnter(frame, 45);

  const badgeAppear = springEnter(frame, 65);

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
        <div style={{ color: '#64748b', fontSize: 16, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Step 5 — Automated Outreach
        </div>
        <div style={{ color: '#0f172a', fontSize: 44, fontWeight: 800 }}>
          The AI notifies your <span style={{ color: '#2563eb' }}>team & clients</span> instantly
        </div>
      </div>

      {/* ── Notifications ── */}
      <div style={{
        position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 60, zIndex: 20,
      }}>
        <SlackNotification appear={slackAppear} />
        <EmailNotification appear={emailAppear} />
      </div>

      {/* ── Agent & Badge (Bottom) ── */}
      <div style={{
        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, zIndex: 30,
      }}>
        <AIAgentLarge appear={agentAppear} />
        <div style={{
          opacity: badgeAppear, transform: `scale(${0.9 + badgeAppear * 0.1})`,
          background: '#f0fdf4', padding: '16px 40px', borderRadius: 20,
          border: '2px solid #86efac', boxShadow: '0 12px 40px rgba(22,163,74,0.15)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <span style={{ fontSize: 36 }}>🚀</span>
          <div style={{ color: '#16a34a', fontSize: 24, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
            Zero-delay communication
          </div>
        </div>
      </div>
    </div>
  );
};
