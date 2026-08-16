import { motion } from 'framer-motion';
import { CloudRain, CloudFog, Sun, Wind } from 'lucide-react';
import { useSystemStore } from '@/store/useSystemStore';
import { useEffect, useState } from 'react';

export function WeatherModule({ isActive }: { isActive: boolean }) {
  const setEnvironment = useSystemStore(state => state.setEnvironment);
  const currentEnv = useSystemStore(state => state.environment);
  const [temp, setTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState<string>('Loading...');

  useEffect(() => {
    if (isActive && temp === null) {
      // Fetch SF Weather from Open-Meteo
      fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true&temperature_unit=fahrenheit')
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setTemp(Math.round(data.current_weather.temperature));
            const code = data.current_weather.weathercode;
            // Map WMO weather codes to conditions
            if (code <= 3) setCondition('Clear / Cloudy');
            else if (code <= 49) setCondition('Fog');
            else if (code <= 69) setCondition('Rain');
            else if (code <= 79) setCondition('Snow');
            else setCondition('Storm');
          }
        })
        .catch(console.error);
    }
  }, [isActive, temp]);

  if (!isActive) return null;

  const conditions = [
    { name: 'Sun', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
    { name: 'Rain', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
    { name: 'Fog', icon: CloudFog, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600 uppercase">Atmosphere</h2>
        <Wind className="text-yellow-500" />
      </div>

      <div className="text-center mb-8 p-8 bg-white/5 rounded-full border-2 border-white/10 relative overflow-hidden aspect-square flex flex-col items-center justify-center mx-12">
        <div className="text-6xl font-light mb-2">{temp !== null ? `${temp}°` : '--°'}</div>
        <div className="text-sm text-gray-400 uppercase tracking-widest">San Francisco</div>
        <div className="text-xs text-blue-300 mt-1 uppercase">{condition}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {conditions.map((c) => {
          const Icon = c.icon;
          const isSelected = currentEnv === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setEnvironment(c.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${isSelected ? c.bg : 'border-white/5 bg-white/5 hover:border-white/20'}`}
            >
              <Icon className={`mb-2 ${isSelected ? c.color : 'text-gray-500'}`} size={24} />
              <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-white' : 'text-gray-500'}`}>{c.name}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
