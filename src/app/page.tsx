"use client";

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { Environment } from '@/scene/Environment';
import { CameraRig } from '@/scene/CameraRig';
import { Carousel } from '@/scene/Carousel';
import { HUD } from '@/components/HUD';
import { GestureEngine } from '@/engine/GestureEngine';
import { VoiceEngine } from '@/engine/VoiceEngine';
import { AudioEngine } from '@/engine/AudioEngine';
import { HoloText } from '@/components/HoloText';
import { HandCursor } from '@/components/HandCursor';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';

export default function NexusOS() {
  return (
    <main className="relative w-full h-screen bg-[#010204] overflow-hidden select-none">
      <GestureEngine />
      <VoiceEngine />
      <AudioEngine />
      <HUD />
      
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <Environment />
          <CameraRig />
          
          <Physics gravity={[0, 0, 0]}>
            <Carousel />
          </Physics>
          <HoloText />
          <HandCursor />

          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={1.2} 
            />
            <DepthOfField 
              focusDistance={0} 
              focalLength={0.02} 
              bokehScale={2} 
              height={480} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: '#010204' }}
        innerStyles={{ width: '300px' }}
        barStyles={{ background: '#3b82f6', height: '4px' }}
        dataInterpolation={(p) => `Initializing Nexus OS: ${p.toFixed(0)}%`}
      />
    </main>
  );
}
