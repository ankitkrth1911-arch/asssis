import { motion } from 'framer-motion';
import { Heart, Users, TrendingUp, Activity } from 'lucide-react';

export function InstagramModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 uppercase">Instagram Core</h2>
        <Activity className="text-pink-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <Users className="mb-2 text-purple-400" size={20} />
          <div className="text-sm text-gray-400 uppercase tracking-widest">Followers</div>
          <div className="text-3xl font-light">1.2M</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <TrendingUp className="mb-2 text-blue-400" size={20} />
          <div className="text-sm text-gray-400 uppercase tracking-widest">Reach</div>
          <div className="text-3xl font-light">4.5M</div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-lg border border-white/10 p-4 relative overflow-hidden">
        <div className="text-sm text-gray-400 uppercase tracking-widest mb-4">Engagement Matrix</div>
        {/* Mock Chart */}
        <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-between px-4 pb-4">
          {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 1, type: 'spring' }}
              className="w-8 bg-gradient-to-t from-purple-600/50 to-pink-500/80 rounded-t-sm"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
