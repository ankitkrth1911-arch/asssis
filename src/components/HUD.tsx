import { useSystemStore } from '@/store/useSystemStore';
import { useGestureStore } from '@/store/useGestureStore';
import { useAiStore } from '@/store/useAiStore';
import { useEffect, useState } from 'react';

export function HUD() {
  const { fps, isCameraReady, logs } = useSystemStore();
  const { currentGesture, gestureConfidence } = useGestureStore();
  const aiStatus = useAiStore(state => state.status);
  const isAwake = useAiStore(state => state.isAwake);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 text-white font-mono text-sm p-6 flex flex-col justify-between">
      
      {/* Top Left: System Status */}
      <div className="flex flex-col gap-1">
        <div className="text-blue-400 font-bold tracking-widest uppercase mb-2">Nexus OS</div>
        <div>SYS: <span className="text-green-400">ONLINE</span></div>
        <div>FPS: {fps > 0 ? fps : '--'}</div>
        <div>CAM: {isCameraReady ? <span className="text-green-400">READY</span> : <span className="text-yellow-400">WAITING</span>}</div>
        <div>GPU: WebGL Active</div>
      </div>

      {/* Top Right: Clock */}
      <div className="absolute top-6 right-6 text-right flex flex-col gap-1">
        <div className="text-2xl font-light tracking-wider">
          {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-gray-400 text-xs tracking-widest">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase()}
        </div>
      </div>

      {/* Bottom Left: Logs */}
      <div className="flex flex-col gap-1 text-xs opacity-70 max-w-sm">
        {logs.map(log => (
          <div key={log.id} className={log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-orange-400' : 'text-gray-300'}>
            [{new Date(log.timestamp).toISOString().split('T')[1].slice(0, -1)}] {log.message}
          </div>
        ))}
      </div>

      {/* Bottom Right: Status */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4">
        {/* AI Status */}
        {isAwake && (
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">AI Core</div>
            <div className="flex items-center gap-3">
              <span className="text-lg uppercase tracking-wider text-purple-300">{aiStatus}</span>
              <div className={`w-2 h-2 rounded-full ${aiStatus === 'Listening' ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`} />
            </div>
          </div>
        )}

        {/* Gesture Status */}
        <div className="flex flex-col items-end">
          <div className="text-[10px] text-gray-500 tracking-widest uppercase">Input Stream</div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-lg uppercase tracking-wider text-blue-200">{currentGesture !== 'none' ? currentGesture : 'SCANNING'}</span>
              <span className="text-[10px] text-gray-400">CONF: {(gestureConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${currentGesture !== 'none' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
          </div>
        </div>
      </div>

    </div>
  );
}
