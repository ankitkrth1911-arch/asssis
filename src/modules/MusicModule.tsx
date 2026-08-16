import { motion } from 'framer-motion';
import { Play, SkipForward, SkipBack, Music } from 'lucide-react';

export function MusicModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 uppercase">Audio Stream</h2>
        <Music className="text-rose-500" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Album Art Placeholder */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-48 h-48 rounded-full border-4 border-white/10 mb-8 flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-pink-900/50 to-rose-500/20"
        >
          <div className="w-12 h-12 bg-black rounded-full absolute z-10 border border-white/20" />
          <div className="w-full h-px bg-white/20 absolute transform rotate-45" />
          <div className="w-full h-px bg-white/20 absolute transform -rotate-45" />
        </motion.div>

        <div className="text-center mb-8">
          <div className="text-2xl font-light mb-2">Neon Nights</div>
          <div className="text-sm text-gray-400 tracking-widest uppercase">Cyberpunk Synthwave</div>
        </div>

        <div className="flex items-center gap-8">
          <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <SkipBack size={20} className="text-gray-300" />
          </button>
          <button className="p-5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-lg shadow-rose-500/30">
            <Play size={24} className="text-white ml-1" />
          </button>
          <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <SkipForward size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
