'use client';

import { motion } from 'framer-motion';
import { Play, RefreshCw, Plus, Mail, Zap, Users, Send, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  action: string;
  variant: 'primary' | 'secondary';
}

const quickActions: QuickAction[] = [
  { id: 'run-heartbeat', label: 'Run Heartbeat', icon: Zap, action: 'Trigger hourly check', variant: 'primary' },
  { id: 'check-email', label: 'Check Gmail', icon: Mail, action: 'Scan for important emails', variant: 'secondary' },
  { id: 'refresh-budget', label: 'Refresh Budget', icon: RefreshCw, action: 'Update spending data', variant: 'secondary' },
  { id: 'new-task', label: 'New Task', icon: Plus, action: 'Assign to agent', variant: 'secondary' },
  { id: 'ping-agents', label: 'Ping Agents', icon: Users, action: 'Wake all idle agents', variant: 'secondary' },
  { id: 'deploy-vercel', label: 'Deploy to Vercel', icon: Send, action: 'Push latest changes', variant: 'primary' },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
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
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-orange-500 rounded-xl blur-xl"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">QUICK ACTIONS</h2>
          <p className="text-xs text-white/40">Common operations</p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative flex items-center gap-3 p-4 rounded-xl border transition-all overflow-hidden group',
              action.variant === 'primary'
                ? 'bg-gradient-to-r from-[#00ff88]/10 to-[#00ff88]/5 border-[#00ff88]/30 hover:border-[#00ff88]/50'
                : 'bg-[#252530] border-white/5 hover:border-white/10'
            )}
          >
            {/* Hover glow for primary actions */}
            {action.variant === 'primary' && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            
            <div className={cn(
              'p-2 rounded-lg flex-shrink-0',
              action.variant === 'primary' ? 'bg-[#00ff88]/20' : 'bg-white/5'
            )}>
              <action.icon className={cn(
                'w-5 h-5',
                action.variant === 'primary' ? 'text-[#00ff88]' : 'text-white/60'
              )} />
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <p className={cn(
                'text-sm font-medium truncate',
                action.variant === 'primary' ? 'text-[#00ff88]' : 'text-white'
              )}>
                {action.label}
              </p>
              <p className="text-xs text-white/40 truncate">{action.action}</p>
            </div>

            <Play className={cn(
              'w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity',
              action.variant === 'primary' ? 'text-[#00ff88]' : 'text-white/40'
            )} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
