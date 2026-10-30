import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTINUOUS_SPEED_DEG_PER_SEC,
  FAST_SPIN_DURATION_MS,
  computeFastSpinTarget,
  createInitialCoinSpinState,
  onLogoMouseEnter,
  onLogoMouseLeave,
  stepCoinSpin,
} from './coinSpin';

test('continuous mode rotates steadily around Y axis like a coin', () => {
  let state = createInitialCoinSpinState();
  assert.equal(state.mode, 'CONTINUOUS');
  assert.equal(state.angle, 0);

  // Step 10 frames of 100ms = 1000ms total
  for (let i = 0; i < 10; i++) {
    state = stepCoinSpin(state, 100);
  }
  assert.equal(state.mode, 'CONTINUOUS');
  assert.equal(Math.round(state.angle), CONTINUOUS_SPEED_DEG_PER_SEC);
});

test('hovering triggers a rapid spin and stops upright if mouse remains on logo', () => {
  let state = createInitialCoinSpinState();
  state = stepCoinSpin(state, 100); // ~7.2 deg
  const angleBeforeHover = state.angle;

  state = onLogoMouseEnter(state);
  assert.equal(state.mode, 'FAST_SPIN');
  assert.equal(state.isHovered, true);
  assert.ok(state.fastSpinTargetAngle >= angleBeforeHover + 300);
  assert.equal(state.fastSpinTargetAngle % 360, 0);

  // Advance past FAST_SPIN_DURATION_MS in 50ms increments while hovered
  const steps = Math.ceil(FAST_SPIN_DURATION_MS / 50) + 2;
  for (let i = 0; i < steps; i++) {
    state = stepCoinSpin(state, 50);
  }

  assert.equal(state.mode, 'STOPPED_HOVER');
  assert.equal(state.angle % 360, 0);

  // Remains frozen while mouse stays over logo
  const stoppedAngle = state.angle;
  state = stepCoinSpin(state, 100);
  state = stepCoinSpin(state, 100);
  assert.equal(state.mode, 'STOPPED_HOVER');
  assert.equal(state.angle, stoppedAngle);
});

test('leaving logo after stop immediately resumes 360 continuous rotation', () => {
  let state = onLogoMouseEnter(createInitialCoinSpinState());
  for (let i = 0; i < 20; i++) {
    state = stepCoinSpin(state, 50);
  }
  assert.equal(state.mode, 'STOPPED_HOVER');
  const stoppedAngle = state.angle;

  state = onLogoMouseLeave(state);
  assert.equal(state.mode, 'CONTINUOUS');
  assert.equal(state.isHovered, false);

  state = stepCoinSpin(state, 100);
  assert.ok(state.angle > stoppedAngle);
});

test('leaving logo mid-fast-spin finishes fast spin then resumes continuous instead of stopping', () => {
  let state = onLogoMouseEnter(createInitialCoinSpinState());
  state = stepCoinSpin(state, 100);
  assert.equal(state.mode, 'FAST_SPIN');

  // Mouse leaves before fast spin completes
  state = onLogoMouseLeave(state);
  assert.equal(state.isHovered, false);
  assert.equal(state.mode, 'FAST_SPIN');

  for (let i = 0; i < 20; i++) {
    state = stepCoinSpin(state, 50);
  }

  assert.equal(state.mode, 'CONTINUOUS');
  assert.ok(state.angle > 360);
});

test('computeFastSpinTarget always lands on an upright 360 multiple with at least 300 deg sweep', () => {
  for (const angle of [0, 15, 90, 180, 275, 355, 725]) {
    const target = computeFastSpinTarget(angle);
    assert.equal(target % 360, 0);
    assert.ok(target - angle >= 300, `Expected >= 300 sweep from ${angle}, got ${target - angle}`);
  }
});
