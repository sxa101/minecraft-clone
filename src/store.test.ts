import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('World Store', () => {
  beforeEach(() => {
    // Reset store before each test if needed
    // Zustand doesn't have a built-in reset but we can call a custom one if we implement it
  });

  it('should add a block', () => {
    const { addBlock, blocks } = useStore.getState();
    addBlock(1, 2, 3, 'dirt');
    expect(useStore.getState().blocks['1,2,3']).toBe('dirt');
  });

  it('should remove a block', () => {
    const { addBlock, removeBlock } = useStore.getState();
    addBlock(10, 10, 10, 'grass');
    removeBlock(10, 10, 10);
    expect(useStore.getState().blocks['10,10,10']).toBeUndefined();
  });

  it('should persist the world to localStorage', () => {
    const { addBlock, saveWorld, resetWorld } = useStore.getState();
    addBlock(0, 0, 0, 'wood');
    saveWorld();
    
    // Check localStorage directly
    const saved = JSON.parse(window.localStorage.getItem('world') || '{}');
    expect(saved['0,0,0']).toBe('wood');
  });
});
