import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGestureStore } from '@/store/useGestureStore';

export function CameraRig() {
  const handPosition = useGestureStore(state => state.handPosition);
  const currentGesture = useGestureStore(state => state.currentGesture);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Base camera position
    const baseX = 0;
    const baseY = 0;
    let targetZ = 10;
    
    if (currentGesture === 'zoom') {
      targetZ = 6;
    } else if (currentGesture === 'swipe-left' || currentGesture === 'swipe-right') {
      targetZ = 12;
    }
    
    // Subtle idle floating
    let targetX = baseX + Math.sin(t / 3) * 0.3;
    let targetY = baseY + Math.cos(t / 4) * 0.3;
    
    // Slight parallax based on hand position (if available)
    if (handPosition) {
      targetX += (handPosition.x - 0.5) * 2; // handPosition.x is 0-1
      targetY += -(handPosition.y - 0.5) * 2;
    } else {
      // Fallback to mouse
      targetX += (state.pointer.x * 2);
      targetY += (state.pointer.y * 2);
    }

    // Smooth damp camera position
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.02);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.02);
    
    // Look at center
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
