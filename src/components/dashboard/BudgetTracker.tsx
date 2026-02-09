'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { Wallet, Zap, CreditCard, TrendingUp, TrendingDown, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingData {
  cash: number;
  totalPositionValue: number;
  totalPortfolioValue: number;
  pnl: {
    value: number;
    percent: number;
    isPositive: boolean;
  };
  tradeCount: number;
}

const apiBudgetData = [
  { name: 'Anthropic (Haiku)', value: 19, color: '#10b981', icon: '🧠' },
  { name: 'OpenRouter (Kimi)', value: 10, color: '#f59e0b', icon: '⚡' },
];

const spendingData = [
  { category: 'Groceries', budget: 500, spent: 423, icon: '🛒' },
  { category: 'Eating Out', budget: 350, spent: 287, icon: '🍽️' },
  { category: 'Personal', budget: 800, spent: 612, icon: '💅' },
  { category: 'Entertainment', budget: 200, spent: 89, icon: '🎬' },
];

const trendData = [
  { day: 'Mon', spent: 145 },
  { day: 'Tue', spent: 189 },
  { day: 'Wed', spent: 167 },
  { day: 'Thu', spent: 198 },
  { day: 'Fri', spent: 156 },
  { day: 'Sat', spent: 234 },
  { day: 'Sun', spent: 122 },
];

export function BudgetTracker({ className }: { className?: string }) {
  const [trading, setTrading] = useState<TradingData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const totalApiBudget = 29;
  const totalApiSpent = 23;
  const totalPersonalBudget = 1850;
  const totalPersonalSpent = 1411;
  const [animatedSpent, setAnimatedSpent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedSpent(totalApiSpent), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchTrading() {
      try {
        const res = await fetch('/api/trading');
        const data = await res.json();
        if (data.success) {
          setTrading(data.data);
        }
      } catch (err) {
        console.error('Failed to load trading data');
      } finally {
        setLoading(false);
      }
    }
    fetchTrading();
    const interval = setInterval(fetchTrading, 30000);
    return () => clearInterval(interval);
  }, []);

  const apiPercentage = (totalApiSpent / totalApiBudget) * 100;
  const personalPercentage = (totalPersonalSpent / totalPersonalBudget) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative bg-[#1a1a24] rounded-2xl p-6 border border-white/5 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#00ff88] rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">BUDGET TRACKER</h2>
            <p className="text-xs text-white/40">Monthly spending overview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/30">
          <Activity className="w-3 h-3 text-[#00ff88] animate-pulse" />
          <span className="text-xs font-medium text-[#00ff88]">Live Updates</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        {/* API Costs */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            API Costs
          </h3>
          
          {/* Donut Chart */}
          <div className="relative flex items-center justify-center mb-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={apiBudgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {apiBudgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">${animatedSpent}</span>
              <span className="text-xs text-white/40">of ${totalApiBudget}</span>
            </div>
          </div>

          {/* API Breakdown */}
          <div className="space-y-2">
            {apiBudgetData.map((item) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-[#252530] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value / totalApiBudget * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-sm font-mono text-white">${item.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trading Portfolio */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            Trading Portfolio
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#00ff88] animate-spin" />
            </div>
          ) : trading ? (
            <>
              <div className="bg-[#252530] rounded-xl p-4 border border-white/5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/60">Portfolio Value</span>
                  <span className="text-xl font-bold text-white">${trading.totalPortfolioValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg',
                    trading.pnl.isPositive ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-red-500/10 text-red-400'
                  )}>
                    {trading.pnl.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      ${trading.pnl.value.toFixed(2)} ({trading.pnl.percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#252530] border border-white/5">
                  <span className="text-sm text-white">Cash</span>
                  <span className="text-sm font-mono text-[#00ff88]">${trading.cash.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#252530] border border-white/5">
                  <span className="text-sm text-white">Positions</span>
                  <span className="text-sm font-mono text-white">${trading.totalPositionValue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#252530] border border-white/5">
                  <span className="text-sm text-white">Trades</span>
                  <span className="text-sm font-mono text-white/60">{trading.tradeCount}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-white/40">
              <span>Trading data unavailable</span>
            </div>
          )}
        </div>

        {/* Personal Spending */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#00ff88]" />
            This Cycle
          </h3>
          
          {/* Mini Trend Chart */}
          <div className="h-14 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#00ff88"
                  fill="url(#gradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spending Categories */}
          <div className="space-y-2.5">
            {spendingData.map((item, index) => {
              const percentage = (item.spent / item.budget) * 100;
              const isOver = percentage > 100;
              const isWarning = percentage > 80;
              
              return (
                <motion.div 
                  key={item.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-[#252530] border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium text-white">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOver ? (
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      ) : isWarning ? (
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#00ff88]" />
                      )}
                      <span className={cn(
                        'text-sm font-mono',
                        isOver ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white/60'
                      )}>
                        ${item.spent}/${item.budget}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={cn(
                        'h-full rounded-full',
                        isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-[#00ff88]'
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">Total Spent</span>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-[#00ff88]" />
                <span className="text-lg font-bold text-white">${totalPersonalSpent.toLocaleString()}/1850</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-white/40">Usage</span>
              <span className={cn(
                'text-sm font-medium',
                personalPercentage > 80 ? 'text-yellow-400' : 'text-[#00ff88]'
              )}>
                {personalPercentage.toFixed(1)}% used
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
