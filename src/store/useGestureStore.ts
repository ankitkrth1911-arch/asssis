import { create } from 'zustand';

export type GestureType = 'none' | 'swipe-left' | 'swipe-right' | 'pinch' | 'release' | 'open-hand' | 'closed-hand' | 'palm-still' | 'push' | 'pull' | 'circle' | 'zoom' | 'throw' | 'split' | 'group' | 'dual-pinch';

interface GestureState {
  currentGesture: GestureType;
  gestureConfidence: number;
  handPosition: { x: number; y: number; z: number } | null; // Primary / Right hand
  leftHandPosition: { x: number; y: number; z: number } | null;
  isPinching: boolean;
  setGesture: (gesture: GestureType, confidence: number) => void;
  setHandPosition: (position: { x: number; y: number; z: number } | null) => void;
  setLeftHandPosition: (position: { x: number; y: number; z: number } | null) => void;
  setIsPinching: (isPinching: boolean) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
  currentGesture: 'none',
  gestureConfidence: 0,
  handPosition: null,
  leftHandPosition: null,
  isPinching: false,
  setGesture: (gesture, confidence) => set({ currentGesture: gesture, gestureConfidence: confidence }),
  setHandPosition: (position) => set({ handPosition: position }),
  setLeftHandPosition: (position) => set({ leftHandPosition: position }),
  setIsPinching: (isPinching) => set({ isPinching }),
}));
