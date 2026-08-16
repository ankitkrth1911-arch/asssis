import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useAiStore } from '@/store/useAiStore';
import * as THREE from 'three';

export function HoloText() {
  const streamedText = useAiStore(state => state.streamedText);
  const isAwake = useAiStore(state => state.isAwake);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (!isAwake) return null;

  return (
    <group position={[0, 2.5, 0]}>
      <Text
        ref={textRef as any}
        fontSize={0.4}
        maxWidth={6}
        lineHeight={1.5}
        textAlign="center"
        color="#8ab4f8"
        anchorX="center"
        anchorY="middle"
      >
        {streamedText || 'Listening...'}
        <meshBasicMaterial color="#8ab4f8" transparent opacity={0.9} />
      </Text>
      <pointLight position={[0, 0, 0.5]} intensity={1} color="#8ab4f8" />
    </group>
  );
}
