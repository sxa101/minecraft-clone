import { describe, it, expect } from 'vitest';
import { isColliding, resolveMovement } from './physics';
import type { AABB } from './physics';

describe('Physics Logic', () => {
  it('should detect when two AABBs are colliding', () => {
    const boxA: AABB = {
      min: [0, 0, 0],
      max: [1, 1, 1],
    };
    const boxB: AABB = {
      min: [0.5, 0.5, 0.5],
      max: [1.5, 1.5, 1.5],
    };
    expect(isColliding(boxA, boxB)).toBe(true);
  });

  it('should detect when two AABBs are NOT colliding', () => {
    const boxA: AABB = {
      min: [0, 0, 0],
      max: [1, 1, 1],
    };
    const boxB: AABB = {
      min: [2, 2, 2],
      max: [3, 3, 3],
    };
    expect(isColliding(boxA, boxB)).toBe(false);
  });

  it('should resolve movement against a wall (X axis)', () => {
    const player: AABB = { min: [0, 0, 0], max: [1, 2, 1] };
    const wall: AABB = { min: [1.5, 0, 0], max: [2.5, 2, 1] };
    const velocity: [number, number, number] = [1, 0, 0]; // Moving 1 unit in X

    const { actualVelocity } = resolveMovement(player, velocity, [wall]);
    expect(actualVelocity[0]).toBeLessThan(1);
    expect(actualVelocity[0]).toBeCloseTo(0.5);
  });

  it('should allow sliding along a wall', () => {
    const player: AABB = { min: [0, 0, 0], max: [1, 2, 1] };
    const wall: AABB = { min: [1, 0, -5], max: [2, 2, 5] };
    const velocity: [number, number, number] = [0.5, 0, 1]; // Moving into wall (X) and along wall (Z)

    const { actualVelocity } = resolveMovement(player, velocity, [wall]);
    expect(actualVelocity[0]).toBeCloseTo(0); // X movement blocked (within epsilon)
    expect(actualVelocity[2]).toBe(1); // Z movement free
  });

  it('should resolve movement against multiple blocks (closest wins)', () => {
    const player: AABB = { min: [0, 0, 0], max: [1, 1, 1] };
    // Block 1 at x=1.2 (Closer)
    const block1: AABB = { min: [1.2, -5, -5], max: [2.2, 5, 5] };
    // Block 2 at x=1.5 (Further)
    const block2: AABB = { min: [1.5, -5, -5], max: [2.5, 5, 5] };
    
    // If we check block1 then block2, and block2 overwrites, we fail.
    const { actualVelocity } = resolveMovement(player, [2.0, 0, 0], [block1, block2]);
    
    // It must be stopped by block1 (vx = 0.2)
    expect(actualVelocity[0]).toBeCloseTo(0.2);
  });
});
