import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { InstancedMesh, Object3D } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useTextures } from './TextureProvider';

const tempObject = new Object3D();

const colorMap = {
  dirt: '#964B00',
  grass: '#567d46',
  glass: '#a1c4fd',
  wood: '#634433',
  log: '#4b3621',
  stone: '#808080',
  water: '#2196f3',
  plant: '#e91e63',
};

export const World = () => {
  const { blocks, addBlock, removeBlock, activeBlockType } = useStore();
  const meshRefs = useRef<Record<string, InstancedMesh>>({});
  const instanceKeys = useRef<Record<string, string[]>>({});
  const textures = useTextures();
  
  // Override raycaster to always point to center (for PointerLock)
  useFrame(({ raycaster, camera }) => {
    if (document.pointerLockElement) {
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    }
  });

  useEffect(() => {
    const groupedBlocks: Record<string, string[]> = {};
    (['dirt', 'grass', 'glass', 'wood', 'log', 'stone', 'water', 'plant'] as const).forEach(type => {
      groupedBlocks[type] = [];
    });

    Object.entries(blocks).forEach(([posStr, type]) => {
      if (groupedBlocks[type]) groupedBlocks[type].push(posStr);
    });

    Object.entries(groupedBlocks).forEach(([type, keys]) => {
      const mesh = meshRefs.current[type];
      if (mesh) {
        mesh.count = keys.length;
        instanceKeys.current[type] = keys;
        keys.forEach((posStr, i) => {
          const [x, y, z] = posStr.split(',').map(Number);
          tempObject.position.set(x, y, z);
          tempObject.updateMatrix();
          mesh.setMatrixAt(i, tempObject.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }, [blocks]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const { instanceId, object, face, button } = e;
    console.log(`R3F Event: button=${button}, id=${instanceId}, type=${object.type}`);
    
    const mesh = object as InstancedMesh;
    const blockType = Object.keys(meshRefs.current).find(key => meshRefs.current[key] === mesh);

    if (blockType && instanceId !== undefined && instanceKeys.current[blockType]) {
        const key = instanceKeys.current[blockType][instanceId];
        if (key) {
            const [x, y, z] = key.split(',').map(Number);
            
            console.log(`Hit Block: ${blockType} at ${x},${y},${z} | Button: ${button}`);

            if (button === 0) { // Left click
                removeBlock(x, y, z);
            } else if (button === 2) { // Right click
                if (face) {
                    const n = face.normal;
                    const newPos = [
                        Math.round(x + n.x),
                        Math.round(y + n.y),
                        Math.round(z + n.z)
                    ];
                    console.log(`Building at ${newPos.join(',')}`);
                    addBlock(newPos[0], newPos[1], newPos[2], activeBlockType);
                }
            }
        }
    }
  };

  return (
    <group>
      {(['dirt', 'grass', 'glass', 'wood', 'log', 'stone', 'water', 'plant'] as const).map((type) => (
        <instancedMesh
          key={type}
          ref={(el) => {
            if (el) meshRefs.current[type] = el;
          }}
          args={[undefined, undefined, 100000]}
          frustumCulled={false}
          onPointerDown={handlePointerDown}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            map={(textures as any)[type]} 
            color={!textures[type as keyof typeof textures] ? (colorMap as any)[type] || 'white' : 'white'} 
            transparent={type === 'water' || type === 'glass' || type === 'plant'}
            opacity={type === 'water' ? 0.6 : 1}
          />
        </instancedMesh>
      ))}
    </group>
  );
};
