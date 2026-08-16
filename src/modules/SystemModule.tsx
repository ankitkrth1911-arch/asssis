import { motion } from 'framer-motion';
import { Cpu, HardDrive, Wifi, Battery } from 'lucide-react';

export function SystemModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  const stats = [
    { label: 'CPU Usage', value: '42%', icon: Cpu, color: 'text-red-400' },
    { label: 'Memory', value: '12.4 GB', icon: HardDrive, color: 'text-orange-400' },
    { label: 'Network', value: '940 Mbps', icon: Wifi, color: 'text-blue-400' },
    { label: 'Power', value: '84%', icon: Battery, color: 'text-green-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white uppercase">Diagnostics</h2>
        <Cpu className="text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 rounded-lg border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden"
            >
              {/* Background pulse */}
              <motion.div 
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                className={`absolute inset-0 ${s.color.replace('text', 'bg')}`}
              />
              <Icon size={24} className={`mb-3 ${s.color}`} />
              <div className="text-xl font-light tracking-widest mb-1">{s.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
