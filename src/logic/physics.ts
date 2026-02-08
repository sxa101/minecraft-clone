export interface AABB {
  min: [number, number, number];
  max: [number, number, number];
}

export function isColliding(a: AABB, b: AABB): boolean {
  return (
    a.min[0] < b.max[0] &&
    a.max[0] > b.min[0] &&
    a.min[1] < b.max[1] &&
    a.max[1] > b.min[1] &&
    a.min[2] < b.max[2] &&
    a.max[2] > b.min[2]
  );
}

export function resolveMovement(
  entity: AABB,
  velocity: [number, number, number],
  blocks: AABB[]
): { actualVelocity: [number, number, number]; grounded: boolean } {
  let [vx, vy, vz] = velocity;
  let grounded = false;

  // Simulate axis-by-axis to allow for sliding
  const current: AABB = {
    min: [...entity.min] as [number, number, number],
    max: [...entity.max] as [number, number, number],
  };

  // Resolve X
  if (vx !== 0) {
    for (const block of blocks) {
      const nextX: AABB = {
        min: [current.min[0] + vx, current.min[1], current.min[2]],
        max: [current.max[0] + vx, current.max[1], current.max[2]],
      };
      if (isColliding(nextX, block)) {
        if (vx > 0) vx = block.min[0] - current.max[0] - 0.0001;
        else vx = block.max[0] - current.min[0] + 0.0001;
      }
    }
  }
  current.min[0] += vx;
  current.max[0] += vx;

  // Resolve Y
  if (vy !== 0) {
    for (const block of blocks) {
      const nextY: AABB = {
        min: [current.min[0], current.min[1] + vy, current.min[2]],
        max: [current.max[0], current.max[1] + vy, current.max[2]],
      };
      if (isColliding(nextY, block)) {
        if (vy > 0) vy = block.min[1] - current.max[1] - 0.0001;
        else {
          vy = block.max[1] - current.min[1] + 0.0001;
          grounded = true;
        }
      }
    }
  }
  current.min[1] += vy;
  current.max[1] += vy;

  // Resolve Z
  if (vz !== 0) {
    for (const block of blocks) {
      const nextZ: AABB = {
        min: [current.min[0], current.min[1], current.min[2] + vz],
        max: [current.max[0], current.max[1], current.max[2] + vz],
      };
      if (isColliding(nextZ, block)) {
        if (vz > 0) vz = block.min[2] - current.max[2] - 0.0001;
        else vz = block.max[2] - current.min[2] + 0.0001;
      }
    }
  }

  return { actualVelocity: [vx, vy, vz], grounded };
}