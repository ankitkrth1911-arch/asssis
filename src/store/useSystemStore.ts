import { create } from 'zustand';

interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'warning' | 'error';
}

interface SystemState {
  isCameraReady: boolean;
  fps: number;
  setCameraReady: (ready: boolean) => void;
  setFps: (fps: number) => void;
  logs: LogEntry[];
  environment: 'Minimal Studio' | 'Dark Lab' | 'Glass Observatory' | 'Industrial Command Center' | 'Ocean Platform' | 'Fog Chamber' | 'Sun' | 'Rain' | 'Fog';
  setEnvironment: (env: 'Minimal Studio' | 'Dark Lab' | 'Glass Observatory' | 'Industrial Command Center' | 'Ocean Platform' | 'Fog Chamber' | 'Sun' | 'Rain' | 'Fog') => void;
  addLog: (message: string, type: 'info' | 'warning' | 'error') => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  isCameraReady: false,
  fps: 0,
  logs: [],
  setCameraReady: (ready) => set({ isCameraReady: ready }),
  setFps: (fps) => set({ fps }),
  environment: 'Fog',
  setEnvironment: (env) => set({ environment: env }),
  addLog: (message, type) =>
    set((state) => ({
      logs: [
        { id: Math.random().toString(36).substring(7), timestamp: Date.now(), message, type },
        ...state.logs,
      ].slice(0, 5),
    })),
}));
