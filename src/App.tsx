import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { Player } from './components/Player';
import { World } from './components/World';
import { Pig } from './components/Pig';
import { SoundManager } from './components/SoundManager';
import { UI } from './components/UI';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

function App() {
  const { addBlock, addBlocks, resetWorld, blocks } = useStore();
  const [started, setStarted] = useState(false);

  // Initial world generation
  useEffect(() => {
    if (Object.keys(blocks).length > 0) return;

    resetWorld();
    const size = 50; 
    const waterLevel = 3;
    const newBlocks: Record<string, any> = {};

    const add = (x: number, y: number, z: number, type: string) => {
        newBlocks[`${x},${y},${z}`] = type;
    };

    for (let x = -size; x < size; x++) {
      for (let z = -size; z < size; z++) {
        const height = Math.floor(noise2D(x / 20, z / 20) * 5) + 5; 
        const isDesert = x > 20;
        const isForest = x < -20;
        const isWater = height < waterLevel;

        for (let y = 0; y <= height; y++) {
          let type: any = 'dirt';
          if (y === height) {
             if (isDesert) type = 'stone'; 
             else if (isForest) type = 'grass';
             else type = 'grass';
             if (type === 'grass' && !isWater && Math.random() < 0.05) {
                add(x, y + 1, z, 'plant');
             }
          } else if (y < height - 2) {
             type = 'stone';
          } else {
             if (isDesert) type = 'stone';
             else type = 'dirt';
          }
          add(x, y, z, type);
        }

        for (let y = height + 1; y <= waterLevel; y++) {
          add(x, y, z, 'water');
        }

        if (isForest && height >= waterLevel && Math.random() < 0.02) {
           const treeHeight = 4;
           for(let i=1; i<=treeHeight; i++) add(x, height+i, z, 'log');
           add(x, height+treeHeight+1, z, 'wood');
           add(x+1, height+treeHeight, z, 'wood');
           add(x-1, height+treeHeight, z, 'wood');
           add(x, height+treeHeight, z+1, 'wood');
           add(x, height+treeHeight, z-1, 'wood');
        }
      }
    }
    addBlocks(newBlocks);
  }, []);

  if (!started) {
    return (
      <div className="overlay">
        <button className="start-btn" onClick={() => setStarted(true)}>
          START MINECRAFT CLONE
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SoundManager />
      <UI />
      <Canvas shadows camera={{ fov: 45, near: 0.1, far: 2000 }}>
        <Sky sunPosition={[100, 100, 20]} />
        <Stars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        
        <World />
        <Player />
        <Pig position={[0, 10, 0]} />
        <Pig position={[5, 10, 5]} />
        
        <PointerLockControls />
      </Canvas>
      <div className="dot" />
      <div className="instructions">
        WASD to move | SPACE to jump | F to fly | LEFT CLICK to remove | RIGHT CLICK to add | T for chat
      </div>
    </div>
  );
}

export default App;