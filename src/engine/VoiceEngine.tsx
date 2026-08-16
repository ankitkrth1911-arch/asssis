import { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { useAiStore } from '@/store/useAiStore';
import { useGestureStore } from '@/store/useGestureStore';
import { useSystemStore } from '@/store/useSystemStore';

export function VoiceEngine() {
  const { status, setStatus, isAwake, setIsAwake, activeContext, setStreamedText } = useAiStore();
  const currentGesture = useGestureStore((state) => state.currentGesture);
  const addLog = useSystemStore((state) => state.addLog);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isSpeakingRef = useRef(false);

  // @ts-ignore
  const { messages, append, stop } = useChat({
    // @ts-ignore
    api: '/api/chat',
    body: { context: activeContext },
    onResponse: () => {
      setStatus('Streaming');
    },
    onFinish: (event: any) => {
      const msg = event.message || event;
      setStatus('Speaking');
      speak(msg.content);
      
      if (msg.toolCalls) {
        msg.toolCalls.forEach((toolCall: any) => {
          if (toolCall.toolName === 'executeCommand') {
            const command = toolCall.args?.command || (toolCall.args as any)?.command;
            addLog(`Executed UI Command: ${command}`, 'info');
            if (command === 'rotate-left') useGestureStore.getState().setGesture('swipe-right', 1);
            if (command === 'rotate-right') useGestureStore.getState().setGesture('swipe-left', 1);
          }
        });
      }
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        setStreamedText(lastMessage.content as string);
      }
    }
  }, [messages, setStreamedText]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); 
    
    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.pitch = 1;
    utterance.rate = 1.1; 

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setStatus('Speaking');
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setStatus('Listening');
    };

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('SpeechRecognition not supported in this browser.', 'warning');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      
      if (isSpeakingRef.current) {
        synthRef.current?.cancel();
        isSpeakingRef.current = false;
        stop(); 
        setStatus('Interrupted');
        addLog('AI Interrupted by user', 'warning');
      }

      if (!isAwake && transcript.includes('nexus')) {
        setIsAwake(true);
        setStatus('Listening');
        addLog('Wake word detected', 'info');
        return;
      }

      if (isAwake) {
        setStatus('Thinking');
        addLog(`User: ${transcript}`, 'info');
        append({ role: 'user', content: transcript });
      }
    };

    recognition.onend = () => {
      try {
        recognition.start();
      } catch (e) {}
    };

    recognition.start();

    return () => {
      recognition.stop();
      synthRef.current?.cancel();
    };
  }, [isAwake, stop, append, setIsAwake, setStatus, addLog]);

  useEffect(() => {
    if (currentGesture === 'circle' && !isAwake) {
      setIsAwake(true);
      setStatus('Listening');
      addLog('Wake gesture detected', 'info');
    }
  }, [currentGesture, isAwake, setIsAwake, setStatus, addLog]);

  return null;
}
