import { motion } from 'framer-motion';
import { Calendar, Clock, Video } from 'lucide-react';

export function CalendarModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  const events = [
    { time: '09:00 AM', title: 'Product Sync', type: 'Video', duration: '45m' },
    { time: '11:30 AM', title: 'Design Review', type: 'In-person', duration: '1h' },
    { time: '02:00 PM', title: 'Investor Update', type: 'Video', duration: '30m' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 uppercase">Schedule</h2>
        <Calendar className="text-purple-500" />
      </div>

      <div className="text-sm text-gray-400 uppercase tracking-widest mb-6">Today, Aug 10</div>

      <div className="relative flex-1">
        {/* Timeline Line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-white/10" />

        <div className="flex flex-col gap-6 relative z-10">
          {events.map((e, i) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-14 text-right pt-1">
                <div className="text-xs font-bold text-gray-300">{e.time.split(' ')[0]}</div>
                <div className="text-[9px] text-gray-500">{e.time.split(' ')[1]}</div>
              </div>
              
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] mt-1.5 flex-shrink-0" />
              
              <div className="flex-1 bg-white/5 rounded-lg border border-white/10 p-3">
                <div className="font-bold tracking-wider mb-1">{e.title}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {e.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={12} /> {e.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
