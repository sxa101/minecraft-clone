import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboard } from '../hooks/useKeyboard';
import { useStore } from '../store';
import { resolveMovement } from '../logic/physics';
import type { AABB } from '../logic/physics';
import { Vector3 } from 'three';

const PLAYER_SPEED = 4;
const JUMP_FORCE = 5;
const GRAVITY = -9.8;

export const Player = () => {
  const { camera } = useThree();
  const keyboard = useKeyboard();
  const { moveForward, moveBackward, moveLeft, moveRight, jump, fly, descend } = keyboard;
  const blocks = useStore((state) => state.blocks);
  
  const velocity = useRef([0, 0, 0]);
  const pos = useRef([0, 5, 0]);
  const spawnHeight = useRef(10);
  const hasSpawned = useRef(false);
  const isGrounded = useRef(false);
  const isFlyingMode = useRef(false);
  const flyPressed = useRef(false);

  // Intelligent Spawn: Find surface height at (0,0)
  useEffect(() => {
    if (Object.keys(blocks).length > 0 && !hasSpawned.current) {
      // Find all Y heights for blocks at x=0, z=0
      const heightsAtSpawn = Object.keys(blocks)
        .filter(key => key.startsWith('0,'))
        .map(key => Number(key.split(',')[1]));
      
      const maxHeight = heightsAtSpawn.length > 0 ? Math.max(...heightsAtSpawn) : 10;
      spawnHeight.current = maxHeight;
      pos.current = [0, maxHeight + 2, 0];
      hasSpawned.current = true;
      console.log(`Intelligent Spawn at height: ${maxHeight + 2}`);
    }
  }, [blocks]);

  // Toggle fly mode on key press (rising edge)
  useEffect(() => {
    if (fly && !flyPressed.current) {
      isFlyingMode.current = !isFlyingMode.current;
      flyPressed.current = true;
      velocity.current[1] = 0; // Reset vertical velocity
    } else if (!fly) {
      flyPressed.current = false;
    }
  }, [fly]);

  useFrame((state, delta) => {
    if (Object.keys(blocks).length === 0) return;

    // 1. Calculate intended velocity from input
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, Number(moveBackward) - Number(moveForward));
    const sideVector = new Vector3(Number(moveLeft) - Number(moveRight), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(PLAYER_SPEED)
      .applyEuler(camera.rotation);

    // 2. Apply gravity or fly logic
    if (isFlyingMode.current) {
      velocity.current[1] = 0;
      if (jump) velocity.current[1] = PLAYER_SPEED;
      if (descend) velocity.current[1] = -PLAYER_SPEED;
    } else {
      velocity.current[1] += GRAVITY * delta;
      
      // 3. Jump logic
      if (jump && isGrounded.current) {
        velocity.current[1] = JUMP_FORCE;
      }
    }

    const nextVelocity: [number, number, number] = [
      direction.x * delta,
      velocity.current[1] * delta,
      direction.z * delta,
    ];

    // 4. Physics resolution
    const playerAABB: AABB = {
      min: [pos.current[0] - 0.3, pos.current[1] - 1.5, pos.current[2] - 0.3],
      max: [pos.current[0] + 0.3, pos.current[1] + 0.5, pos.current[2] + 0.3],
    };

    // Optimized: Check blocks only in the immediate vicinity
    const nearbyBlocks: AABB[] = [];
    const px = Math.round(pos.current[0]);
    const py = Math.round(pos.current[1]);
    const pz = Math.round(pos.current[2]);

    // Increased radius for stability
    for (let x = px - 3; x <= px + 3; x++) {
      for (let y = py - 4; y <= py + 3; y++) {
        for (let z = pz - 3; z <= pz + 3; z++) {
          const type = blocks[`${x},${y},${z}`];
          // IGNORE water and plants for collision
          if (type && type !== 'water' && type !== 'plant') {
            nearbyBlocks.push({
              min: [x - 0.5, y - 0.5, z - 0.5],
              max: [x + 0.5, y + 0.5, z + 0.5],
            });
          }
        }
      }
    }

    const { actualVelocity, grounded } = resolveMovement(playerAABB, nextVelocity, nearbyBlocks);

    // 5. Update state
    pos.current[0] += actualVelocity[0];
    pos.current[1] += actualVelocity[1];
    pos.current[2] += actualVelocity[2];
    
    // Safety Safeguard: Falling off the world (Lowered threshold)
    if (pos.current[1] < -30) {
      pos.current = [0, spawnHeight.current + 2, 0];
      velocity.current = [0, 0, 0];
    }

    // Safety Safeguard: Boundary clamping (size is 50, so -50 to 50)
    const WORLD_LIMIT = 55;
    if (Math.abs(pos.current[0]) > WORLD_LIMIT) pos.current[0] = Math.sign(pos.current[0]) * WORLD_LIMIT;
    if (Math.abs(pos.current[2]) > WORLD_LIMIT) pos.current[2] = Math.sign(pos.current[2]) * WORLD_LIMIT;

    // Update camera
    camera.position.set(pos.current[0], pos.current[1], pos.current[2]);
    
    isGrounded.current = grounded;
    if (grounded) velocity.current[1] = 0;
  });

  return null;
};