'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, Cloud, CreditCard, Home, Shield, Globe, CheckCircle2, XCircle, AlertCircle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  category: 'communication' | 'finance' | 'home' | 'security' | 'other';
  status: 'connected' | 'error' | 'pending' | 'disconnected';
  icon: React.ElementType;
  lastSync?: string;
  details?: string;
}

const integrations: Integration[] = [
  { id: 'gmail', name: 'Gmail', category: 'communication', status: 'error', icon: Mail, lastSync: 'Failed', details: 'Token expired' },
  { id: 'telegram', name: 'Telegram', category: 'communication', status: 'connected', icon: MessageSquare, lastSync: 'Just now' },
  { id: 'vercel', name: 'Vercel', category: 'other', status: 'connected', icon: Globe, lastSync: 'Just now', details: 'test-site deployed' },
  { id: 'trading', name: 'Trading Bot', category: 'finance', status: 'pending', icon: CreditCard, details: 'API keys needed' },
  { id: 'hue', name: 'Philips Hue', category: 'home', status: 'pending', icon: Home, details: 'OAuth setup required' },
  { id: 'nest', name: 'Google Nest', category: 'home', status: 'pending', icon: Cloud, details: 'OAuth setup required' },
  { id: 'security', name: 'Security Audit', category: 'security', status: 'connected', icon: Shield, lastSync: '2 hours ago' },
];

const categoryLabels = {
  communication: 'Communication',
  finance: 'Finance',
  home: 'Home',
  security: 'Security',
  other: 'Other',
};

const statusConfig = {
  connected: { icon: CheckCircle2, color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10', border: 'border-[#00ff88]/30' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  disconnected: { icon: XCircle, color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' },
};

export function IntegrationGrid({ className }: { className?: string }) {
  const byCategory = Object.groupBy(integrations, (i) => i.category);

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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-xl"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">INTEGRATIONS</h2>
          <p className="text-xs text-white/40">{integrations.length} services connected</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {Object.entries(byCategory).map(([category, items]) => (
          items && (
            <div key={category}>
              <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((integration) => {
                  const config = statusConfig[integration.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={integration.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        'bg-[#252530] rounded-xl p-4 border transition-all cursor-pointer hover:border-white/10',
                        config.bg,
                        config.border
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', 'bg-[#1a1a24]')}>
                          <integration.icon className={cn('w-5 h-5', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-white truncate block">{integration.name}</span>
                          {integration.details && (
                            <p className="text-xs text-white/40 truncate">{integration.details}</p>
                          )}
                        </div>
                        <StatusIcon className={cn('w-5 h-5 flex-shrink-0', config.color)} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </motion.div>
  );
}
