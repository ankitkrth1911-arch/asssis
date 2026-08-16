import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useSystemStore } from '@/store/useSystemStore';
import { useSpring, a } from '@react-spring/three';

const ENV_PROPS = {
  'Minimal Studio': { bg: '#050505', fog: '#0a0a0a', density: 0.01, amb: 1, dir: 1.5, spot: 0 },
  'Dark Lab': { bg: '#010204', fog: '#030610', density: 0.05, amb: 0.1, dir: 0.5, spot: 1 },
  'Glass Observatory': { bg: '#080c16', fog: '#0a1020', density: 0.01, amb: 0.3, dir: 2, spot: 0.5 },
  'Industrial Command Center': { bg: '#100a05', fog: '#1a1005', density: 0.04, amb: 0.2, dir: 1, spot: 2 },
  'Ocean Platform': { bg: '#020b14', fog: '#041526', density: 0.03, amb: 0.4, dir: 1.2, spot: 1.5 },
  'Fog Chamber': { bg: '#0a0a0a', fog: '#111111', density: 0.1, amb: 0.2, dir: 0.5, spot: 0 },
  'Sun': { bg: '#0a101a', fog: '#0a101a', density: 0.02, amb: 0.5, dir: 2, spot: 0 },
  'Rain': { bg: '#010204', fog: '#050a10', density: 0.05, amb: 0.1, dir: 0.5, spot: 0 },
  'Fog': { bg: '#010204', fog: '#010204', density: 0.08, amb: 0.2, dir: 0.2, spot: 0 }
};

export function Environment() {
  const env = useSystemStore(state => state.environment);
  const props = ENV_PROPS[env] || ENV_PROPS['Dark Lab'];

  const { bg, fog, density, amb, dir, spot } = useSpring({
    bg: props.bg,
    fog: props.fog,
    density: props.density,
    amb: props.amb,
    dir: props.dir,
    spot: props.spot,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return (
    <group>
      <a.color attach="background" args={[bg]} />
      {/* @ts-ignore */}
      <a.fogExp2 attach="fog" args={[fog, density]} />

      <a.ambientLight intensity={amb} color="#4a6bff" />
      <a.directionalLight position={[5, 5, 5]} intensity={dir} color="#e0e8ff" />
      <a.spotLight position={[0, -10, 0]} intensity={spot} color="#ff6b00" angle={1.5} penumbra={1} />
      
      {env === 'Glass Observatory' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      {env === 'Glass Observatory' && <MarketGrid />}
      <Particles />
    </group>
  );
}

function MarketGrid() {
  const ref = useRef<any>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z = (ref.current.position.z + delta * 2) % 1;
    }
  });
  return (
    <group position={[0, -5, 0]}>
      <Grid 
        ref={ref}
        args={[40, 40]} 
        cellColor="#00ff88" 
        sectionColor="#00ff88" 
        sectionThickness={1.5} 
        fadeDistance={20}
        cellThickness={0.5}
      />
    </group>
  );
}

import { useGestureStore } from '@/store/useGestureStore';

function Particles() {
  const env = useSystemStore(state => state.environment);
  const handPosition = useGestureStore(state => state.handPosition);
  const ref = useRef<THREE.Points>(null);

  const isRain = env === 'Rain';
  const isFog = env === 'Fog' || env === 'Fog Chamber';
  const isOcean = env === 'Ocean Platform';
  const isIndustrial = env === 'Industrial Command Center';
  
  const color = isRain ? '#8ab4f8' : isOcean ? '#00ffff' : isIndustrial ? '#ff6b00' : '#4a6bff';
  const count = isRain || isFog ? 1500 : 400;
  const speed = isRain ? 2 : isFog ? 0.1 : 0.4;

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group>
      <Sparkles 
        count={count}
        scale={20}
        size={isRain ? 4 : 2}
        speed={speed}
        opacity={isFog ? 0.1 : 0.3}
        color={color}
        position={[0, isRain ? 5 : 0, 0]}
      />
    </group>
  );
}
