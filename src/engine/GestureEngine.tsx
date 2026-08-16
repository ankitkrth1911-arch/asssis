import { useEffect, useRef } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useGestureStore } from '@/store/useGestureStore';
import { useSystemStore } from '@/store/useSystemStore';

export function GestureEngine() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setGesture = useGestureStore(state => state.setGesture);
  const setHandPosition = useGestureStore(state => state.setHandPosition);
  const setLeftHandPosition = useGestureStore(state => state.setLeftHandPosition);
  const { setCameraReady, addLog, setFps } = useSystemStore();

  useEffect(() => {
    let recognizer: GestureRecognizer;
    let animationFrameId: number;
    let lastVideoTime = -1;
    let frameCount = 0;
    let lastFpsTime = performance.now();

    async function initialize() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        
        addLog('GestureRecognizer loaded', 'info');

        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
            addLog('Camera ready', 'info');
            predictWebcam();
          };
        }
      } catch (err) {
        addLog(`Camera error: ${err}`, 'error');
      }
    }

    function predictWebcam() {
      if (!videoRef.current) return;
      
      const nowInMs = Date.now();
      
      // Calculate FPS
      frameCount++;
      if (nowInMs - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (nowInMs - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = nowInMs;
      }

      if (videoRef.current.currentTime !== lastVideoTime) {
        lastVideoTime = videoRef.current.currentTime;
        const results = recognizer.recognizeForVideo(videoRef.current, nowInMs);

        if (results.gestures.length > 0) {
          const primaryIndex = results.handedness.findIndex(h => h[0].categoryName === 'Right') !== -1 
            ? results.handedness.findIndex(h => h[0].categoryName === 'Right') 
            : 0;
          const secondaryIndex = primaryIndex === 0 && results.gestures.length > 1 ? 1 : (results.gestures.length > 1 ? 0 : -1);

          const gestureName = results.gestures[primaryIndex][0].categoryName;
          const confidence = results.gestures[primaryIndex][0].score;
          
          let mappedGesture: any = 'none';
          if (gestureName === 'Closed_Fist') mappedGesture = 'closed-hand';
          if (gestureName === 'Open_Palm') mappedGesture = 'open-hand';
          if (gestureName === 'Victory') mappedGesture = 'swipe-right'; 
          if (gestureName === 'Pointing_Up') mappedGesture = 'swipe-left'; 
          if (gestureName === 'ILoveYou') mappedGesture = 'circle';

          // Detect Dual Hand Gestures
          if (secondaryIndex !== -1) {
             const secondaryGesture = results.gestures[secondaryIndex][0].categoryName;
             if (gestureName === 'Closed_Fist' && secondaryGesture === 'Closed_Fist') mappedGesture = 'dual-pinch';
             if (gestureName === 'Open_Palm' && secondaryGesture === 'Open_Palm') mappedGesture = 'zoom';
          }
          
          setGesture(mappedGesture, confidence);

          if (results.landmarks[primaryIndex]) {
            const indexTip = results.landmarks[primaryIndex][8];
            setHandPosition({ x: indexTip.x, y: indexTip.y, z: indexTip.z });
          }
          if (secondaryIndex !== -1 && results.landmarks[secondaryIndex]) {
            const leftTip = results.landmarks[secondaryIndex][8];
            setLeftHandPosition({ x: leftTip.x, y: leftTip.y, z: leftTip.z });
          } else {
            setLeftHandPosition(null);
          }
        } else {
          setGesture('none', 0);
          setHandPosition(null);
          setLeftHandPosition(null);
        }
      }

      animationFrameId = requestAnimationFrame(predictWebcam);
    }

    initialize();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setGesture('swipe-left', 1);
      if (e.key === 'ArrowLeft') setGesture('swipe-right', 1);
      if (e.key === 'ArrowUp') setGesture('zoom', 1);
      if (e.key === 'ArrowDown') setGesture('throw', 1);
      if (e.key === 'Enter') setGesture('dual-pinch', 1);
      if (e.key === ' ') setGesture('closed-hand', 1);
      if (e.key === 'Escape') setGesture('open-hand', 1);
    };
    const handleKeyUp = () => setGesture('none', 0);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      recognizer?.close();
    };
  }, []);

  return (
    <video 
      ref={videoRef} 
      style={{ display: 'none' }} 
      playsInline
    />
  );
}
