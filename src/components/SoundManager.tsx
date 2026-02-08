import { useEffect, useRef } from 'react';

export const SoundManager = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("Audio Context Initialized:", audioContextRef.current.state);
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const playFallbackSound = (freq: number) => {
      if (!audioContextRef.current) initAudio();
      const ctx = audioContextRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      console.log("Fallback Sound Played");
    };

    const playBGM = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          console.log("BGM Playing");
        }).catch(e => {
          console.log("BGM Play Failed:", e.message);
        });
      }
    };

    const handleInteraction = (e: MouseEvent) => {
      console.log(`SoundManager caught interaction: button=${e.button}`);
      initAudio();
      playBGM();
      playFallbackSound(440); // Test sound
    };

    window.addEventListener('mousedown', handleInteraction);
    return () => window.removeEventListener('mousedown', handleInteraction);
  }, []);

  return (
    <audio 
      id="bgm" 
      ref={audioRef} 
      loop 
      src="https://www.chosic.com/wp-content/uploads/2021/07/The-Blue-Danube.mp3"
      style={{ display: 'none' }}
    />
  );
};
