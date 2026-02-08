import { useState, useEffect } from 'react';

function keyCodeToKey(code: string) {
  const keys: Record<string, string> = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
    Space: 'jump',
    KeyF: 'fly',
    ShiftLeft: 'descend',
    Digit1: 'dirt',
    Digit2: 'grass',
    Digit3: 'glass',
    Digit4: 'wood',
    Digit5: 'log',
    Digit6: 'stone',
  };
  return keys[code];
}

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    fly: false,
    descend: false,
    dirt: false,
    grass: false,
    glass: false,
    wood: false,
    log: false,
    stone: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyCodeToKey(e.code);
      if (action) setActions((prev) => ({ ...prev, [action]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const action = keyCodeToKey(e.code);
      if (action) setActions((prev) => ({ ...prev, [action]: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return actions;
};
