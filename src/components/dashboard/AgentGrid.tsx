'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Shield, Briefcase, Lock, Code2, Search, 
  Globe, Zap, Clock, CheckCircle2, AlertTriangle,
  TrendingUp, Brain, Target, Activity, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  lastActive: string;
  tasksCompleted: number;
  emoji: string;
}

const statusConfig = {
  active: { 
    color: 'text-[#00ff88]', 
    bg: 'bg-[#00ff88]/10',
    border: 'border-[#00ff88]/30',
    dot: 'bg-[#00ff88]',
    pulse: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
    label: 'Active'
  },
  busy: { 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400 animate-pulse',
    pulse: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    label: 'Busy'
  },
  idle: { 
    color: 'text-white/40', 
    bg: 'bg-white/5',
    border: 'border-white/10',
    dot: 'bg-white/40',
    pulse: '',
    label: 'Idle'
  },
  offline: { 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    pulse: '',
    label: 'Offline'
  },
};

export function AgentGrid({ className }: { className?: string }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        if (data.success) {
          setAgents(data.data);
        } else {
          setError('Failed to load agents');
        }
      } catch (err) {
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
    // Poll every 30 seconds
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter(a => a.status === 'active').length;
  const busyCount = agents.filter(a => a.status === 'busy').length;

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">AGENT FLEET</h2>
              <p className="text-xs text-white/40">Loading agents...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative bg-[#1a1a24] rounded-2xl p-6 border border-white/5 overflow-hidden',
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">AGENT FLEET</h2>
              <p className="text-xs text-red-400">{error}</p>
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
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">AGENT FLEET</h2>
            <p className="text-xs text-white/40">{agents.length} agents configured</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 rounded-xl border border-[#00ff88]/30">
            <div className="relative">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-[#00ff88] rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-xs font-medium text-[#00ff88]">{activeCount} Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-yellow-400">{busyCount} Busy</span>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {agents.map((agent, index) => {
          const config = statusConfig[agent.status];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={cn(
                'relative bg-gradient-to-br rounded-xl p-4 border transition-all cursor-pointer overflow-hidden',
                config.bg,
                config.border,
                config.pulse
              )}
            >
              {/* Card glow */}
              <div className={cn(
                'absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-20',
                config.color.replace('text-', 'bg-')
              )} />
              
              <div className="flex items-start gap-3 relative z-10">
                <div className={cn(
                  'p-2.5 rounded-xl flex-shrink-0',
                  'bg-[#252530]'
                )}>
                  <span className="text-2xl">{agent.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white truncate">{agent.name}</h3>
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-wide">{agent.role}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Target className="w-3 h-3 text-white/30" />
                  <span className="truncate">{agent.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
                    <span>{agent.tasksCompleted} tasks</span>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full border',
                    config.bg, config.border, config.color
                  )}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
