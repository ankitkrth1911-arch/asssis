import { motion } from 'framer-motion';
import { LineChart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StocksModule({ isActive }: { isActive: boolean }) {
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    if (isActive && stocks.length === 0) {
      fetch('/api/stocks')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setStocks(data);
        })
        .catch(console.error);
    }
  }, [isActive, stocks.length]);

  if (!isActive) return null;

  // Calculate mock total value based on fetched prices for effect
  const totalValue = stocks.reduce((acc, s) => acc + (s.price || 0) * 100, 0);
  const dayChange = stocks.reduce((acc, s) => acc + (s.price || 0) * (s.change || 0) * 100 / 100, 0);
  const isPositive = dayChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 uppercase">Portfolio Core</h2>
        <LineChart className="text-emerald-500" />
      </div>

      <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <DollarSign size={100} />
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-widest">Total Value</div>
        <div className="text-5xl font-light tracking-tight text-white mt-2">${totalValue > 0 ? totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '---' }</div>
        <div className={`flex items-center mt-2 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          <span>{isPositive ? '+' : ''}${Math.abs(dayChange).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Today</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Live Tickers</div>
        {stocks.length === 0 && <div className="text-gray-500 text-sm">Loading live market data...</div>}
        {stocks.map((stock, i) => {
          const isUp = stock.change >= 0;
          // Sparkline generation
          const min = Math.min(...(stock.history || [0]));
          const max = Math.max(...(stock.history || [100]));
          const range = max - min || 1;
          const points = (stock.history || []).map((p: number, idx: number, arr: any[]) => 
            `${(idx / (arr.length - 1)) * 64},${16 - ((p - min) / range) * 16}`
          ).join(' ');

          return (
            <div key={stock.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <div className="font-bold tracking-wider">{stock.symbol}</div>
                <div className="text-xs text-gray-400">${stock.price?.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-4">
                 {points && (
                   <svg width="64" height="16" className="overflow-visible">
                     <polyline 
                       points={points}
                       fill="none"
                       stroke={isUp ? '#34d399' : '#f87171'}
                       strokeWidth="1.5"
                       strokeLinejoin="round"
                     />
                   </svg>
                 )}
                 <div className={isUp ? 'text-emerald-400' : 'text-red-400'}>
                    {isUp ? '+' : ''}{stock.change?.toFixed(2)}%
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
