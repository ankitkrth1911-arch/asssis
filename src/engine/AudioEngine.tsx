import { useEffect, useRef } from 'react';
import { useGestureStore } from '@/store/useGestureStore';
import { useSystemStore } from '@/store/useSystemStore';
import { useAiStore } from '@/store/useAiStore';

export function AudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentGesture = useGestureStore(state => state.currentGesture);
  const environment = useSystemStore(state => state.environment);
  const isAwake = useAiStore(state => state.isAwake);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    
    window.addEventListener('pointerdown', initAudio);
    window.addEventListener('keydown', initAudio);
    return () => {
      window.removeEventListener('pointerdown', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  // Play sound function
  const playSound = (type: 'swipe' | 'wake' | 'click' | 'zoom') => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Simple panning
    const panner = ctx.createStereoPanner();
    
    osc.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'swipe') {
      // If swiping right (moves right), pan right
      panner.pan.value = currentGesture === 'swipe-right' ? 1 : -1;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'wake') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.start(now);
      osc.stop(now + 1.0);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'zoom') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.3);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  // Listeners
  useEffect(() => {
    if (currentGesture === 'swipe-left' || currentGesture === 'swipe-right') {
      playSound('swipe');
    } else if (currentGesture === 'zoom') {
      playSound('zoom');
    }
  }, [currentGesture]);

  useEffect(() => {
    if (isAwake) {
      playSound('wake');
    }
  }, [isAwake]);

  // Ambient Drone
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    filter.type = 'lowpass';
    
    let targetFreq = 50;
    let targetFilter = 200;
    
    switch(environment) {
      case 'Minimal Studio': targetFreq = 60; targetFilter = 300; break;
      case 'Dark Lab': targetFreq = 40; targetFilter = 150; break;
      case 'Glass Observatory': targetFreq = 80; targetFilter = 400; break;
      case 'Industrial Command Center': targetFreq = 55; targetFilter = 250; osc.type = 'square'; break;
      case 'Ocean Platform': targetFreq = 45; targetFilter = 180; break;
      case 'Fog Chamber': targetFreq = 35; targetFilter = 100; break;
    }
    
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
    filter.frequency.setValueAtTime(targetFilter, ctx.currentTime);
    gain.gain.setValueAtTime(0.01, ctx.currentTime); // Very quiet drone
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    
    return () => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    };
  }, [environment]);

  return null;
}
