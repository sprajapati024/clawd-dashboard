'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sun, Moon, Zap, RefreshCw, Coffee, Briefcase, TrendingUp, Bell, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'running';
  agent: string;
  icon: React.ElementType;
  description: string;
}

const cronJobs: CronJob[] = [
  { 
    id: 'morning-brief', 
    name: 'Morning Brief', 
    schedule: '6:00 AM Daily', 
    nextRun: 'Tomorrow, 6:00 AM',
    lastRun: 'Today, 8:02 AM',
    status: 'active', 
    agent: 'Xyro',
    icon: Sun,
    description: 'Daily system status, weather, calendar'
  },
  { 
    id: 'heartbeat', 
    name: 'Heartbeat Check', 
    schedule: 'Every 1 hour', 
    nextRun: 'In 45 min',
    lastRun: '15 min ago',
    status: 'active', 
    agent: 'Xyro',
    icon: Zap,
    description: 'Health checks, task monitoring'
  },
  { 
    id: 'evening-wrap', 
    name: 'EOD Digest', 
    schedule: '8:00 PM Daily', 
    nextRun: 'Today, 8:00 PM',
    lastRun: 'Yesterday, 8:03 PM',
    status: 'active', 
    agent: 'Xyro',
    icon: Moon,
    description: 'Daily summary, tomorrow prep'
  },
  { 
    id: 'trading-bot', 
    name: 'Trading Bot', 
    schedule: '9:00 AM Mon-Fri', 
    nextRun: 'Feb 9, 9:00 AM',
    lastRun: 'Never',
    status: 'active', 
    agent: 'System',
    icon: TrendingUp,
    description: 'Paper trading with yfinance'
  },
  { 
    id: 'trading-report', 
    name: 'Trading EOD', 
    schedule: '3:55 PM Mon-Fri', 
    nextRun: 'Feb 9, 3:55 PM',
    lastRun: 'Never',
    status: 'active', 
    agent: 'System',
    icon: Clock,
    description: 'Daily P&L report'
  },
];

const statusConfig = {
  active: { 
    color: 'text-[#00ff88]', 
    bg: 'bg-[#00ff88]/10', 
    border: 'border-[#00ff88]/30',
    dot: 'bg-[#00ff88] animate-pulse'
  },
  paused: { 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400'
  },
  running: { 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30',
    dot: 'bg-blue-400 animate-ping'
  },
};

export function ActiveCrons({ className }: { className?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">SCHEDULED TASKS</h2>
            <p className="text-xs text-white/40">{cronJobs.length} cron jobs configured</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-[#252530] rounded-xl border border-white/5">
          <Clock className="w-4 h-4 text-white/40" />
          <span className="text-sm font-mono text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        {[
          { label: 'Active', value: cronJobs.filter(c => c.status === 'active').length, color: 'text-[#00ff88]' },
          { label: 'Next Run', value: '45 min', color: 'text-blue-400' },
          { label: 'This Week', value: '12 runs', color: 'text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl bg-[#252530] border border-white/5 text-center">
            <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-3 relative z-10">
        {cronJobs.map((job, index) => {
          const config = statusConfig[job.status];
          const Icon = job.icon;
          
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer bg-[#252530] border-white/5',
                'hover:border-white/10'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-2.5 rounded-xl flex-shrink-0',
                  'bg-[#1a1a24]'
                )}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{job.name}</h3>
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
                  </div>
                  <p className="text-xs text-white/40 mb-2">{job.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1a24] border border-white/5 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {job.schedule}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1a24] border border-white/5 text-xs text-white/50">
                      <Calendar className="w-3 h-3" />
                      {job.nextRun}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#1a1a24] border border-white/5 text-xs text-white/50">
                      🤖 {job.agent}
                    </span>
                  </div>
                </div>

                <button className="p-2 rounded-lg bg-[#1a1a24] border border-white/5 hover:border-white/20 transition-colors">
                  {job.status === 'active' ? (
                    <Pause className="w-4 h-4 text-white/40" />
                  ) : (
                    <Play className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
