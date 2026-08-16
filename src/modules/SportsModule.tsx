import { motion } from 'framer-motion';
import { Trophy, Flame } from 'lucide-react';

export function SportsModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  const games = [
    { team1: 'GSW', team2: 'LAL', score: '112 - 108', status: 'Q4 2:14', live: true },
    { team1: 'MIA', team2: 'BOS', score: '98 - 102', status: 'Final', live: false },
    { team1: 'DEN', team2: 'PHX', score: '0 - 0', status: '8:00 PM', live: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 uppercase">Live Sports</h2>
        <Trophy className="text-orange-500" />
      </div>

      <div className="flex flex-col gap-4">
        {games.map((g, i) => (
          <motion.div
            key={i}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-lg border ${g.live ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className={`text-xs font-bold tracking-widest uppercase ${g.live ? 'text-orange-400 animate-pulse' : 'text-gray-500'}`}>
                {g.live ? 'LIVE' : g.status}
              </div>
              {g.live && <Flame size={14} className="text-orange-500" />}
            </div>
            <div className="flex justify-between items-center text-2xl font-light">
              <span>{g.team1}</span>
              <span className="text-gray-400 text-lg tracking-widest">{g.score}</span>
              <span>{g.team2}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
