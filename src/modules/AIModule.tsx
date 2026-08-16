import { motion } from 'framer-motion';
import { BrainCircuit, Search, Code, Sparkles } from 'lucide-react';

export function AIModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 uppercase">Nexus AI</h2>
        <BrainCircuit className="text-indigo-500" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Pulsing Core */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border border-dashed border-indigo-400/50 absolute"
          />
          <BrainCircuit size={48} className="text-white relative z-10" />
        </div>

        <div className="w-full space-y-3">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
            <Search size={16} className="text-indigo-400" />
            <span className="text-sm tracking-wider">"Summarize recent tech news"</span>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
            <Code size={16} className="text-purple-400" />
            <span className="text-sm tracking-wider">"Help me debug this WebGL shader"</span>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm tracking-wider">"Generate an image of a cyber city"</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
