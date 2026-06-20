// Video config
export const FPS = 30;
export const TOTAL_DURATION_S = 50;
export const TOTAL_FRAMES = FPS * TOTAL_DURATION_S; // 1500
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene timing (in frames)
export const SCENE_TIMINGS = {
  scene1: { start: 0,    end: 120  }, // 4s   The Flood
  scene2: { start: 120,  end: 270  }, // 5s   AI Arrives
  scene3: { start: 270,  end: 480  }, // 7s   The Sort
  scene4: { start: 480,  end: 660  }, // 6s   The Extraction
  scene5: { start: 660,  end: 840  }, // 6s   CRM Update
  scene6: { start: 840,  end: 1020 }, // 6s   Audit Trail
  scene7: { start: 1020, end: 1170 }, // 5s   Outreach
  scene8: { start: 1170, end: 1350 }, // 6s   Invoice Generator
  scene9: { start: 1350, end: 1500 }, // 5s   Impact
};

// Brand colors
export const COLORS = {
  bg:        '#0a0f1e',
  bgLight:   '#0f1729',
  grid:      '#1a2744',
  blue:      '#3b82f6',
  blueGlow:  '#60a5fa',
  green:     '#10b981',
  amber:     '#f59e0b',
  purple:    '#8b5cf6',
  orange:    '#f97316',
  red:       '#ef4444',
  white:     '#ffffff',
  muted:     '#94a3b8',
  card:      '#111827',
  cardBorder:'#1e3a5f',
};

// Document types
export const DOC_TYPES = [
  { label: 'Vendor Invoice',      color: COLORS.blue,   icon: '📄', id: 'invoice' },
  { label: 'Expense Receipt',     color: COLORS.green,  icon: '🧾', id: 'receipt' },
  { label: 'Onboarding Form',     color: COLORS.orange, icon: '📋', id: 'onboarding' },
  { label: 'Financial Statement', color: COLORS.purple, icon: '📊', id: 'statement' },
];
