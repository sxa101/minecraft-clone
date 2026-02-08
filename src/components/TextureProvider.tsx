import { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, NearestFilter, RepeatWrapping } from 'three';

// Procedural textures (base64)
const generatePlaceholder = (color1: string, color2: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, 16, 16);
  ctx.fillStyle = color2;
  // Add some "noise"
  for (let i = 0; i < 32; i++) {
    const x = Math.floor(Math.random() * 16);
    const y = Math.floor(Math.random() * 16);
    ctx.fillRect(x, y, 1, 1);
  }
  return canvas.toDataURL();
};

const placeholders = {
  dirt: generatePlaceholder('#5d4037', '#4e342e'),
  grass: generatePlaceholder('#4caf50', '#388e3c'),
  glass: generatePlaceholder('#81d4fa', '#b3e5fc'),
  wood: generatePlaceholder('#795548', '#5d4037'),
  log: generatePlaceholder('#4e342e', '#3e2723'),
  stone: generatePlaceholder('#9e9e9e', '#757575'),
  water: generatePlaceholder('#2196f3', '#1e88e5'),
  plant: generatePlaceholder('#e91e63', '#c2185b'), // Pink flower
};

export const useTextures = () => {
  const textures = useLoader(TextureLoader, Object.values(placeholders));

  useEffect(() => {
    textures.forEach((texture) => {
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
    });
  }, [textures]);

  return {
    dirt: textures[0],
    grass: textures[1],
    glass: textures[2],
    wood: textures[3],
    log: textures[4],
    stone: textures[5],
    water: textures[6],
    plant: textures[7],
  };
};