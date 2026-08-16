import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, MeshTransmissionMaterial, Html, Sparkles } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useSpring, a } from '@react-spring/three';
import { useGestureStore } from '@/store/useGestureStore';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface HoloCardProps {
  title: string;
  baseAngle: number;
  radius: number;
  carouselIndex: number;
  totalModules: number;
  onClick?: () => void;
  children?: React.ReactNode;
  isActive?: boolean;
}

export function HoloCard({ title, baseAngle, radius, carouselIndex, totalModules, onClick, children, isActive = false }: HoloCardProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [isDetached, setIsDetached] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  
  const handPosition = useGestureStore(state => state.handPosition);
  const currentGesture = useGestureStore(state => state.currentGesture);
  const { viewport, camera } = useThree();

  // Orbit spring
  const { carouselRot } = useSpring({
    carouselRot: carouselIndex * (Math.PI * 2 / totalModules),
    config: { mass: 2, tension: 170, friction: 40 }
  });

  useFrame(() => {
    if (!bodyRef.current) return;
    
    // Grab logic
    if (hovered && (currentGesture === 'dual-pinch' || currentGesture === 'closed-hand') && !isGrabbed && !isDetached) {
      setIsGrabbed(true);
      setIsDetached(true);
    }
    
    if (isGrabbed) {
      if (currentGesture === 'open-hand' || currentGesture === 'throw' || currentGesture === 'release') {
        setIsGrabbed(false);
        if (currentGesture === 'throw') {
           setIsThrown(true);
           setTimeout(() => setIsThrown(false), 1000);
           // Apply physical throw impulse
           bodyRef.current.applyImpulse({ x: (Math.random() - 0.5) * 5, y: 2, z: -8 }, true);
           bodyRef.current.applyTorqueImpulse({ x: Math.random(), y: Math.random(), z: Math.random() }, true);
        }
      } else if (handPosition) {
        // Follow hand
        const x = (handPosition.x - 0.5) * viewport.width;
        const y = -(handPosition.y - 0.5) * viewport.height;
        const vec = new THREE.Vector3(x, y, 5);
        
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const distance = 6;
        const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        bodyRef.current.setNextKinematicTranslation(targetPos);
      }
    } else if (!isDetached) {
      // Stick to carousel position if not detached
      const currentOrbit = baseAngle + carouselRot.get();
      const x = Math.sin(currentOrbit) * radius;
      const z = Math.cos(currentOrbit) * radius;
      
      const pos = new THREE.Vector3(x, 0, z);
      bodyRef.current.setNextKinematicTranslation(pos);
      
      const rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, currentOrbit, 0));
      bodyRef.current.setNextKinematicRotation(rot);
    }
  });

  const { scale } = useSpring({
    scale: isGrabbed || active ? 0.95 : hovered ? 1.05 : 1,
    config: { mass: 1, tension: 400, friction: 20 }
  });

  return (
    <RigidBody 
      ref={bodyRef}
      type={isDetached && !isGrabbed ? "dynamic" : "kinematicPosition"} 
      position={[Math.sin(baseAngle) * radius, 0, Math.cos(baseAngle) * radius]} 
      rotation={[0, baseAngle, 0]}
      colliders="cuboid"
      angularDamping={0.5}
      linearDamping={0.5}
    >
      <a.group 
        scale={scale as any}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setActive(true)}
        onPointerUp={() => {
          setActive(false);
          onClick?.();
        }}
      >
        <RoundedBox args={[2.5, 3.5, 0.1]} radius={0.15} smoothness={4}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            resolution={256}
            thickness={isActive ? 1.2 : 0.5}
            chromaticAberration={isActive ? 0.1 : 0.05}
            anisotropy={0.5}
            distortion={active || isGrabbed ? 0.8 : 0.1}
            distortionScale={0.5}
            temporalDistortion={hovered || isGrabbed ? 0.8 : 0.1}
            color={isActive ? "#ffffff" : hovered || isGrabbed ? "#3b5284" : "#0a1425"}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {isThrown && (
          <Sparkles count={100} scale={5} size={6} speed={2} color="#00ffff" opacity={0.8} />
        )}
        
        {/* Title rendering only if no children exist */}
        {!children && (
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>
        )}

        {children && (
          <Html
            transform
            position={[0, 0, 0.06]}
            distanceFactor={3.5}
            zIndexRange={[100, 0]}
            style={{
              width: '400px',
              height: '550px',
              opacity: isActive ? 1 : 0.3,
              transition: 'opacity 0.5s ease',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {children}
          </Html>
        )}
      </a.group>
    </RigidBody>
  );
}
