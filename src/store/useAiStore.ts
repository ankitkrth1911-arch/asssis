import { create } from 'zustand';

export type AiStatus = 'Offline' | 'Listening' | 'Thinking' | 'Speaking' | 'Interrupted' | 'Streaming';

interface AiState {
  status: AiStatus;
  activeContext: string;
  isAwake: boolean;
  streamedText: string;
  setStatus: (status: AiStatus) => void;
  setActiveContext: (context: string) => void;
  setIsAwake: (awake: boolean) => void;
  setStreamedText: (text: string) => void;
}

export const useAiStore = create<AiState>((set) => ({
  status: 'Offline',
  activeContext: 'Home',
  isAwake: false,
  streamedText: '',
  setStatus: (status) => set({ status }),
  setActiveContext: (context) => set({ activeContext: context }),
  setIsAwake: (awake) => set({ isAwake: awake }),
  setStreamedText: (text) => set({ streamedText: text }),
}));
