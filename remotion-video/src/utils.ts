import { interpolate, spring } from 'remotion';

/** Clamp a value between min and max */
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Map frame to local 0-1 progress within a window */
export const localProgress = (
  frame: number,
  startFrame: number,
  endFrame: number
): number => clamp((frame - startFrame) / (endFrame - startFrame), 0, 1);

/** Spring-based entrance (from 0→1) starting at `startFrame` */
export const springIn = (
  frame: number,
  startFrame: number,
  fps: number,
  config = { damping: 14, stiffness: 100, mass: 0.8 }
) =>
  spring({ frame: frame - startFrame, fps, config });

/** Fade in from 0→1 over `durationFrames` starting at `startFrame` */
export const fadeIn = (frame: number, startFrame: number, durationFrames: number) =>
  clamp((frame - startFrame) / durationFrames, 0, 1);

/** Fade out from 1→0 over `durationFrames` starting at `startFrame` */
export const fadeOut = (frame: number, startFrame: number, durationFrames: number) =>
  1 - clamp((frame - startFrame) / durationFrames, 0, 1);

/** Oscillate — simple sine wave */
export const oscillate = (frame: number, period: number, amplitude = 1) =>
  Math.sin((frame / period) * Math.PI * 2) * amplitude;

/** Easing: ease in out cubic */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
