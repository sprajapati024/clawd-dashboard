'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertTriangle, Filter, Target, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'blocked' | 'done';
  priority: 'high' | 'medium' | 'low';
  agent: string;
  dueAt?: string;
  subtasks?: number;
}

const statusConfig = {
  'todo': { 
    icon: Circle, 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    gradient: 'from-slate-500/20',
    glow: 'shadow-slate-500/20'
  },
  'in-progress': { 
    icon: Clock, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    gradient: 'from-blue-500/20',
    glow: 'shadow-blue-500/20'
  },
  'blocked': { 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    gradient: 'from-red-500/20',
    glow: 'shadow-red-500/20'
  },
  'done': { 
    icon: CheckCircle2, 
    color: 'text-[#00ff88]', 
    bg: 'bg-[#00ff88]/10',
    border: 'border-[#00ff88]/30',
    gradient: 'from-[#00ff88]/20',
    glow: 'shadow-[#00ff88]/20'
  },
};

const priorityConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
};

export function TaskBoard({ className }: { className?: string }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        if (data.success) {
          setTasks(data.data);
        } else {
          setError('Failed to load tasks');
        }
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
    // Poll every 30 seconds
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'active') return task.status !== 'done';
    if (filter === 'blocked') return task.status === 'blocked';
    return true;
  });

  const taskCounts = {
    todo: tasks.filter((t: Task) => t.status === 'todo').length,
    'in-progress': tasks.filter((t: Task) => t.status === 'in-progress').length,
    blocked: tasks.filter((t: Task) => t.status === 'blocked').length,
    done: tasks.filter((t: Task) => t.status === 'done').length,
  };

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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">TASK BOARD</h2>
              <p className="text-xs text-white/40">Loading tasks...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">TASK BOARD</h2>
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-purple-500 rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">TASK BOARD</h2>
            <p className="text-xs text-white/40">{filteredTasks.length} tasks</p>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', 'active', 'blocked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg border transition-all',
                filter === f 
                  ? 'bg-[#00ff88]/10 border-[#00ff88]/50 text-[#00ff88]' 
                  : 'bg-[#252530] border-white/5 text-white/60 hover:border-white/10 hover:text-white'
              )}
            >
              {f === 'all' ? '✨ All' : f === 'active' ? '🚀 Active' : '🚫 Blocked'}
            </button>
          ))}
        </div>
      </div>

      {/* Task Stats */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 relative z-10">
        {Object.entries(taskCounts).map(([status, count]) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div 
              key={status} 
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0',
                config.bg, config.border
              )}
            >
              <StatusIcon className={cn('w-4 h-4', config.color)} />
              <span className="text-sm font-medium text-white">{count}</span>
              <span className="text-xs text-white/40 capitalize">{status.replace('-', ' ')}</span>
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => {
            const config = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 6 }}
                className={cn(
                  'group relative bg-gradient-to-r rounded-xl p-4 border border-white/5 transition-all cursor-pointer overflow-hidden',
                  task.status === 'done' 
                    ? 'opacity-60' 
                    : `hover:border-${config.gradient.split('-')[1]}-${config.gradient.split('-')[2]}/30`
                )}
              >
                {/* Status bar */}
                <div className={cn(
                  'absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl',
                  config.color.replace('text-', 'bg-')
                )} />
                
                <div className="flex items-start gap-4 pl-4">
                  <div className={cn(
                    'p-2 rounded-lg flex-shrink-0',
                    config.bg
                  )}>
                    <StatusIcon className={cn('w-5 h-5', config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-lg border',
                        priority.bg, priority.border, priority.color
                      )}>
                        ⭐ {task.priority.toUpperCase()}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#252530] border border-white/5 text-white/60">
                        {task.agent || 'Unassigned'}
                      </span>
                      {task.dueAt && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Calendar className="w-3 h-3" />
                          {task.dueAt}
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      'font-medium transition-all line-clamp-1',
                      task.status === 'done' ? 'line-through text-white/40' : 'text-white'
                    )}>
                      {task.title}
                    </p>
                    {task.subtasks && task.status !== 'done' && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-[#252530] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 60 + 20}%` }}
                            className={cn(
                              'h-full rounded-full',
                              config.color.replace('text-', 'bg-')
                            )}
                          />
                        </div>
                        <span className="text-xs text-white/40">{task.subtasks} subtasks</span>
                      </div>
                    )}
                  </div>

                  {/* Hover arrow */}
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
