import { useRef, useState, useEffect, useMemo } from 'react';
import { useSpring, a } from '@react-spring/three';
import { HoloCard } from '@/components/HoloCard';
import { useGestureStore } from '@/store/useGestureStore';
import { useSystemStore } from '@/store/useSystemStore';
import * as THREE from 'three';

import { InstagramModule } from '@/modules/InstagramModule';
import { StocksModule } from '@/modules/StocksModule';
import { ProjectsModule } from '@/modules/ProjectsModule';
import { SportsModule } from '@/modules/SportsModule';
import { CalendarModule } from '@/modules/CalendarModule';
import { WeatherModule } from '@/modules/WeatherModule';
import { AIModule } from '@/modules/AIModule';
import { NewsModule } from '@/modules/NewsModule';
import { MusicModule } from '@/modules/MusicModule';
import { SystemModule } from '@/modules/SystemModule';

const MODULES = [
  { name: 'Instagram', Component: InstagramModule },
  { name: 'Stocks', Component: StocksModule },
  { name: 'Projects', Component: ProjectsModule },
  { name: 'Sports', Component: SportsModule },
  { name: 'Calendar', Component: CalendarModule },
  { name: 'Weather', Component: WeatherModule },
  { name: 'AI', Component: AIModule },
  { name: 'News', Component: NewsModule },
  { name: 'Music', Component: MusicModule },
  { name: 'System', Component: SystemModule }
];

const MODULE_ENV_MAP: Record<string, any> = {
  'Instagram': 'Minimal Studio',
  'Stocks': 'Glass Observatory',
  'Projects': 'Dark Lab',
  'Sports': 'Industrial Command Center',
  'Calendar': 'Minimal Studio',
  'Weather': 'Fog Chamber',
  'AI': 'Dark Lab',
  'News': 'Glass Observatory',
  'Music': 'Ocean Platform',
  'System': 'Industrial Command Center'
};

export function Carousel() {
  const groupRef = useRef<THREE.Group>(null);
  const currentGesture = useGestureStore(state => state.currentGesture);
  const setEnvironment = useSystemStore(state => state.setEnvironment);
  
  // Track rotation index
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (currentGesture === 'swipe-left') {
      setIndex(i => i + 1);
    } else if (currentGesture === 'swipe-right') {
      setIndex(i => i - 1);
    }
  }, [currentGesture]);

  useEffect(() => {
    const len = MODULES.length;
    const activeI = ((-index % len) + len) % len;
    const activeModule = MODULES[activeI];
    if (activeModule) {
      setEnvironment(MODULE_ENV_MAP[activeModule.name]);
    }
  }, [index, setEnvironment]);

  const radius = 7;

  return (
    <group ref={groupRef}>
      {MODULES.map((mod, i) => {
        const baseAngle = (i / MODULES.length) * Math.PI * 2;
        
        const len = MODULES.length;
        const activeI = ((-index % len) + len) % len;
        const isActive = i === activeI;

        return (
          <HoloCard 
            key={mod.name}
            title={mod.name}
            baseAngle={baseAngle}
            radius={radius}
            carouselIndex={index}
            totalModules={MODULES.length}
            isActive={isActive}
          >
            <mod.Component isActive={isActive} />
          </HoloCard>
        );
      })}
    </group>
  );
}
