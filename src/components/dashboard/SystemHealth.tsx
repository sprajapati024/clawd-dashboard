'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, Server, Wifi, Clock, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemMetrics {
  cpu: {
    load1: number;
    load5: number;
    load15: number;
    cores: number;
    usagePercent: number;
  };
  memory: {
    used: number;
    total: number;
    percent: number;
    unit: string;
  };
  uptime: {
    seconds: number;
    formatted: string;
  };
  hostname: string;
  ip: string;
}

export function SystemHealth({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/system');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.data);
        } else {
          setError('Failed to load metrics');
        }
      } catch (err) {
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const metricCards = metrics ? [
    { label: 'CPU Usage', value: `${metrics.cpu.usagePercent}%`, icon: Cpu, color: 'from-blue-500/20 to-blue-600/10', accent: 'text-blue-400' },
    { label: 'Memory', value: `${metrics.memory.used} / ${metrics.memory.total} GB`, icon: HardDrive, color: 'from-purple-500/20 to-purple-600/10', accent: 'text-purple-400' },
    { label: 'Active Agents', value: `${metrics.cpu.cores}`, icon: Bot, color: 'from-[#00ff88]/20 to-[#00ff88]/5', accent: 'text-[#00ff88]' },
    { label: 'Uptime', value: metrics.uptime.formatted, icon: Clock, color: 'from-orange-500/20 to-orange-600/10', accent: 'text-orange-400' },
  ] : [];

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative bg-[#1a1a24] rounded-2xl p-6 border border-white/5 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#00ff88]/10 rounded-xl flex items-center justify-center border border-[#00ff88]/20">
                <Activity className="w-5 h-5 text-[#00ff88]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">SYSTEM HEALTH</h2>
              <p className="text-xs text-white/40">Loading metrics...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (error || !metrics) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative bg-[#1a1a24] rounded-2xl p-6 border border-white/5 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#00ff88]/10 rounded-xl flex items-center justify-center border border-[#00ff88]/20">
                <Activity className="w-5 h-5 text-[#00ff88]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">SYSTEM HEALTH</h2>
              <p className="text-xs text-red-400">{error || 'Unavailable'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative bg-[#1a1a24] rounded-2xl p-6 border border-white/5 overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-xl flex items-center justify-center border border-[#00ff88]/20">
              <Activity className="w-5 h-5 text-[#00ff88]" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#00ff88] rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">SYSTEM HEALTH</h2>
            <p className="text-xs text-white/40">Real-time monitoring</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/30">
          <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-[#00ff88]">All Good</span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
              'relative bg-gradient-to-br rounded-xl p-4 border border-white/5',
              metric.color
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={cn('w-4 h-4', metric.accent)} />
              <span className="text-xs text-white/50 uppercase tracking-wide">{metric.label}</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{metric.value}</p>
            
            {/* Subtle glow effect */}
            <div className={cn(
              'absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-30',
              metric.accent.replace('text-', 'bg-')
            )} />
          </motion.div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Server className="w-3 h-3" />
            <span>{metrics.hostname}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Wifi className="w-3 h-3" />
            <span>{metrics.ip}</span>
          </div>
        </div>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <Zap className="w-3 h-3 text-[#00ff88]" />
          <span className="text-xs text-[#00ff88]">Gateway Online</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
