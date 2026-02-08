import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useStore } from '../store';
import { resolveMovement } from '../logic/physics';
import type { AABB } from '../logic/physics';

export const Pig = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<any>(null);
  const velocity = useRef([0, 0, 0]);
  const pos = useRef(position);
  const blocks = useStore((state) => state.blocks);

  useEffect(() => {
    console.log("Pig Oink");
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // AI: Random movement
    if (Math.random() < 0.02) {
      velocity.current[0] = (Math.random() - 0.5) * 2;
      velocity.current[2] = (Math.random() - 0.5) * 2;
    }
    
    // Jump if stuck
    if (Math.random() < 0.005) {
      velocity.current[1] = 3;
    }

    // Gravity
    velocity.current[1] += -9.8 * delta;

    // Physics
    const pigAABB: AABB = {
      min: [pos.current[0] - 0.4, pos.current[1] - 0.4, pos.current[2] - 0.4],
      max: [pos.current[0] + 0.4, pos.current[1] + 0.4, pos.current[2] + 0.4],
    };
    
    // Nearby blocks logic
    const nearbyBlocks: AABB[] = [];
    const px = Math.round(pos.current[0]);
    const py = Math.round(pos.current[1]);
    const pz = Math.round(pos.current[2]);

    for (let x = px - 1; x <= px + 1; x++) {
      for (let y = py - 2; y <= py + 2; y++) {
        for (let z = pz - 1; z <= pz + 1; z++) {
          const type = blocks[`${x},${y},${z}`];
          if (type && type !== 'water' && type !== 'plant') {
             nearbyBlocks.push({
              min: [x - 0.5, y - 0.5, z - 0.5],
              max: [x + 0.5, y + 0.5, z + 0.5],
            });
          }
        }
      }
    }

    const { actualVelocity } = resolveMovement(pigAABB, [
      velocity.current[0] * delta,
      velocity.current[1] * delta,
      velocity.current[2] * delta,
    ], nearbyBlocks);
    
    pos.current[0] += actualVelocity[0];
    pos.current[1] += actualVelocity[1];
    pos.current[2] += actualVelocity[2];
    
    mesh.current.position.set(pos.current[0], pos.current[1], pos.current[2]);
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
};
