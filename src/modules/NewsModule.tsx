import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NewsModule({ isActive }: { isActive: boolean }) {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    if (isActive && news.length === 0) {
      fetch('/api/news')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
             setNews(data);
          }
        })
        .catch(console.error);
    }
  }, [isActive, news.length]);

  if (!isActive) return null;

  const displayNews = news.length > 0 ? news : [
    { title: 'Loading live feeds...', source: 'System', time: 'now' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-600 uppercase">Global Feed</h2>
        <Globe className="text-indigo-500" />
      </div>

      <div className="relative flex-1">
        {displayNews.map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: i * 80, opacity: 1 - (i * 0.2), scale: 1 - (i * 0.05) }}
            className="absolute w-full p-5 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl"
            style={{ zIndex: 10 - i }}
          >
            <div className="text-xs text-indigo-400 uppercase tracking-widest mb-2 flex justify-between">
              <span>{item.creator || item.source || 'News'}</span>
              <span className="text-gray-500 text-[10px]">{item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : item.time}</span>
            </div>
            <div className="text-lg font-light leading-snug mb-4">
              {item.title}
            </div>
            {i === 0 && (
              <div className="flex items-center text-xs text-indigo-300 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                <span>Read Full</span>
                <ArrowRight size={12} className="ml-1" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
