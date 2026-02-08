import { useEffect, useState } from 'react';
import { useStore, BLOCK_TYPES } from '../store';

export const UI = () => {
  const { activeBlockType, isChatOpen, setChatOpen, messages, addMessage, setBlockType } = useStore();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChatOpen) {
        if (e.code === 'Enter') {
          if (inputValue.trim()) {
            addMessage(inputValue);
            setInputValue('');
          }
          setChatOpen(false);
        } else if (e.code === 'Escape') {
          setChatOpen(false);
        }
        return;
      }

      // Selection keys
      if (e.code === 'Digit1') setBlockType('dirt');
      if (e.code === 'Digit2') setBlockType('grass');
      if (e.code === 'Digit3') setBlockType('glass');
      if (e.code === 'Digit4') setBlockType('wood');
      if (e.code === 'Digit5') setBlockType('log');
      if (e.code === 'Digit6') setBlockType('stone');
      if (e.code === 'Digit7') setBlockType('water');
      if (e.code === 'Digit8') setBlockType('plant');

      if (e.code === 'KeyT') {
        e.preventDefault();
        setChatOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, inputValue, setChatOpen, addMessage, setBlockType]);

  return (
    <div 
      className="ui-container" 
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Crosshair */}
      <div className="crosshair">+</div>

      {/* Chat History */}
      <div className="chat-history">
        {messages.slice(-5).map((msg, i) => (
          <div key={i} className="chat-message">{msg}</div>
        ))}
      </div>

      {/* Chat Input */}
      {isChatOpen && (
        <input
          className="chat-input"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Press Enter to send..."
        />
      )}

      {/* Hotbar */}
      <div className="hotbar">
        {BLOCK_TYPES.map((type, i) => (
          <div 
            key={type} 
            className={`hotbar-slot ${activeBlockType === type ? 'active' : ''}`}
          >
            <span className="slot-number">{i + 1}</span>
             <div className="slot-icon" style={{ backgroundColor: type === 'dirt' ? '#964B00' : 'gray' }}>
                {type.charAt(0).toUpperCase()}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};