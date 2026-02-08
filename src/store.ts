import { create } from 'zustand';

export type BlockType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'stone' | 'water' | 'plant';
export const BLOCK_TYPES: BlockType[] = ['dirt', 'grass', 'glass', 'wood', 'log', 'stone', 'water', 'plant'];

interface State {
  blocks: Record<string, BlockType>;
  activeBlockType: BlockType;
  isChatOpen: boolean;
  messages: string[];
  addBlock: (x: number, y: number, z: number, type: BlockType) => void;
  addBlocks: (newBlocks: Record<string, BlockType>) => void;
  setBlockType: (type: BlockType) => void;
  setChatOpen: (isOpen: boolean) => void;
  addMessage: (msg: string) => void;
  removeBlock: (x: number, y: number, z: number) => void;
  saveWorld: () => void;
  resetWorld: () => void;
}

const getLocalStorage = (key: string) => JSON.parse(window.localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value));

export const useStore = create<State>((set) => ({
  blocks: getLocalStorage('world') || {},
  activeBlockType: 'dirt',
  isChatOpen: false,
  messages: [],
  addBlock: (x, y, z, type) =>
    set((state) => ({
      blocks: {
        ...state.blocks,
        [`${x},${y},${z}`]: type,
      },
    })),
  addBlocks: (newBlocks) =>
    set((state) => ({
      blocks: {
        ...state.blocks,
        ...newBlocks,
      },
    })),
  setBlockType: (type) => set(() => ({ activeBlockType: type })),
  setChatOpen: (isOpen) => set(() => ({ isChatOpen: isOpen })),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  removeBlock: (x, y, z) =>
    set((state) => {
      const { [`${x},${y},${z}`]: _, ...rest } = state.blocks;
      return { blocks: rest };
    }),
  saveWorld: () =>
    set((state) => {
      setLocalStorage('world', state.blocks);
      return state;
    }),
  resetWorld: () => set(() => ({ blocks: {} })),
}));
