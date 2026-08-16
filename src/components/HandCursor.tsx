import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Trail, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useGestureStore } from '@/store/useGestureStore';

export function HandCursor() {
  const handPosition = useGestureStore(state => state.handPosition);
  const leftHandPosition = useGestureStore(state => state.leftHandPosition);
  const { viewport } = useThree();
  
  const rightRef = useRef<THREE.Mesh>(null);
  const leftRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (rightRef.current && handPosition) {
      // Map 0-1 to viewport
      const x = (handPosition.x - 0.5) * viewport.width;
      const y = -(handPosition.y - 0.5) * viewport.height;
      rightRef.current.position.lerp(new THREE.Vector3(x, y, 5), 0.2);
    }
    
    if (leftRef.current && leftHandPosition) {
      const x = (leftHandPosition.x - 0.5) * viewport.width;
      const y = -(leftHandPosition.y - 0.5) * viewport.height;
      leftRef.current.position.lerp(new THREE.Vector3(x, y, 5), 0.2);
    }
  });

  return (
    <group>
      <Trail
        width={2}
        length={10}
        color={new THREE.Color('#4a6bff')}
        attenuation={(t) => t * t}
      >
        <Sphere ref={rightRef} args={[0.05, 16, 16]} visible={!!handPosition}>
          <meshBasicMaterial color="#4a6bff" toneMapped={false} />
        </Sphere>
      </Trail>

      <Trail
        width={2}
        length={10}
        color={new THREE.Color('#ff6b00')}
        attenuation={(t) => t * t}
      >
        <Sphere ref={leftRef} args={[0.05, 16, 16]} visible={!!leftHandPosition}>
          <meshBasicMaterial color="#ff6b00" toneMapped={false} />
        </Sphere>
      </Trail>
    </group>
  );
}
