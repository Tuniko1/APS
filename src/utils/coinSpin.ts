export type SpinMode = 'CONTINUOUS' | 'FAST_SPIN' | 'STOPPED_HOVER';

export interface CoinSpinState {
  angle: number;
  mode: SpinMode;
  isHovered: boolean;
  fastSpinStartAngle: number;
  fastSpinTargetAngle: number;
  fastSpinElapsedMs: number;
  fastSpinDurationMs: number;
}

export const CONTINUOUS_SPEED_DEG_PER_SEC = 72; // 5 seconds per full 360° coin turn
export const FAST_SPIN_DURATION_MS = 680; // Crisp rapid 360°+ spin on mouse enter

export function createInitialCoinSpinState(): CoinSpinState {
  return {
    angle: 0,
    mode: 'CONTINUOUS',
    isHovered: false,
    fastSpinStartAngle: 0,
    fastSpinTargetAngle: 360,
    fastSpinElapsedMs: 0,
    fastSpinDurationMs: FAST_SPIN_DURATION_MS,
  };
}

/**
 * Cubic ease-out curve so the rapid coin spin whips quickly and settles smoothly upright.
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Computes the target front-facing multiple of 360° that guarantees at least 300°–660° of rapid spin.
 */
export function computeFastSpinTarget(currentAngle: number): number {
  const baseMultiple = Math.ceil(currentAngle / 360) * 360;
  const delta = baseMultiple - currentAngle;
  return delta < 300 ? baseMultiple + 360 : baseMultiple;
}

/**
 * Triggered when pointer enters the logo: starts a rapid spin and marks hover active.
 * Once the rapid spin completes, if pointer is still hovering, it stops upright.
 */
export function onLogoMouseEnter(state: CoinSpinState): CoinSpinState {
  if (state.mode === 'STOPPED_HOVER' && state.isHovered) {
    return state;
  }
  const targetAngle = computeFastSpinTarget(state.angle);
  return {
    ...state,
    isHovered: true,
    mode: 'FAST_SPIN',
    fastSpinStartAngle: state.angle,
    fastSpinTargetAngle: targetAngle,
    fastSpinElapsedMs: 0,
    fastSpinDurationMs: FAST_SPIN_DURATION_MS,
  };
}

/**
 * Triggered when pointer leaves the logo:
 * - If already stopped on hover, immediately resumes 360° continuous coin spin.
 * - If currently mid-fast-spin, marks isHovered = false so it smoothly transitions back to continuous spin upon finishing the rapid spin.
 */
export function onLogoMouseLeave(state: CoinSpinState): CoinSpinState {
  if (state.mode === 'STOPPED_HOVER') {
    return {
      ...state,
      isHovered: false,
      mode: 'CONTINUOUS',
    };
  }
  return {
    ...state,
    isHovered: false,
  };
}

/**
 * Advances the coin rotation state by dtMs milliseconds.
 */
export function stepCoinSpin(state: CoinSpinState, dtMs: number): CoinSpinState {
  const safeDt = Math.max(0, Math.min(dtMs, 100));

  if (state.mode === 'STOPPED_HOVER') {
    if (!state.isHovered) {
      return {
        ...state,
        mode: 'CONTINUOUS',
      };
    }
    return state;
  }

  if (state.mode === 'FAST_SPIN') {
    const nextElapsed = state.fastSpinElapsedMs + safeDt;
    if (nextElapsed >= state.fastSpinDurationMs) {
      const landedAngle = state.fastSpinTargetAngle;
      return {
        ...state,
        angle: landedAngle,
        fastSpinElapsedMs: state.fastSpinDurationMs,
        mode: state.isHovered ? 'STOPPED_HOVER' : 'CONTINUOUS',
      };
    }
    const progress = easeOutCubic(nextElapsed / state.fastSpinDurationMs);
    const nextAngle =
      state.fastSpinStartAngle +
      (state.fastSpinTargetAngle - state.fastSpinStartAngle) * progress;
    return {
      ...state,
      angle: nextAngle,
      fastSpinElapsedMs: nextElapsed,
    };
  }

  // CONTINUOUS mode
  const nextAngle = state.angle + (CONTINUOUS_SPEED_DEG_PER_SEC * safeDt) / 1000;
  return {
    ...state,
    angle: nextAngle,
  };
}
