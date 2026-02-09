'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Brain, GitBranch, Users, Code, Search, 
  Shield, Globe, Zap, CheckCircle2, Clock, ArrowRight,
  Sparkles, Target, Send, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  agents?: string[];
  duration?: string;
}

const flowSteps: FlowStep[] = [
  { 
    id: 'receive', 
    label: 'Message Received', 
    description: 'User sends request via Telegram', 
    icon: MessageSquare, 
    color: 'from-blue-500 to-cyan-500',
    duration: '~10ms'
  },
  { 
    id: 'xyro', 
    label: 'Xyro Analysis', 
    description: 'Orchestrator classifies intent', 
    icon: Brain, 
    color: 'from-purple-500 to-pink-500',
    duration: '~50ms'
  },
  { 
    id: 'route', 
    label: 'Agent Routing', 
    description: 'Decision tree: Research → Dev → Finance → etc.', 
    icon: GitBranch, 
    color: 'from-orange-500 to-red-500',
    agents: ['Cipher', 'CodeSlinger', 'Finny', 'Atlas'],
    duration: '~20ms'
  },
  { 
    id: 'spawn', 
    label: 'Agent Spawn', 
    description: 'Specialized agent activated', 
    icon: Users, 
    color: 'from-emerald-500 to-teal-500',
    duration: '~100ms'
  },
  { 
    id: 'tools', 
    label: 'Tool Execution', 
    description: 'Web search, code gen, APIs, file ops', 
    icon: Code, 
    color: 'from-indigo-500 to-blue-500',
    duration: '~500ms-2s'
  },
  { 
    id: 'response', 
    label: 'Response Generated', 
    description: 'Final response synthesized', 
    icon: Sparkles, 
    color: 'from-yellow-500 to-orange-500',
    duration: '~100ms'
  },
  { 
    id: 'deliver', 
    label: 'Delivery', 
    description: 'Response sent back to user', 
    icon: Send, 
    color: 'from-green-500 to-emerald-500',
    duration: '~50ms'
  },
];

const decisionTree = [
  { keyword: 'research', agent: 'Cipher', icon: Search, color: 'text-cyan-400', emoji: '🔍' },
  { keyword: 'code', agent: 'CodeSlinger', icon: Code, color: 'text-purple-400', emoji: '⚡' },
  { keyword: 'budget', agent: 'Finny', icon: Target, color: 'text-emerald-400', emoji: '💰' },
  { keyword: 'travel', agent: 'Atlas', icon: Globe, color: 'text-blue-400', emoji: '✈️' },
  { keyword: 'security', agent: 'Lockjaw', icon: Shield, color: 'text-red-400', emoji: '🔒' },
  { keyword: 'test', agent: 'Guard', icon: CheckCircle2, color: 'text-yellow-400', emoji: '🛡️' },
  { keyword: 'default', agent: 'Xyro', icon: Brain, color: 'text-pink-400', emoji: '🎯' },
];

export function ConversationFlow({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % flowSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentStep = flowSteps[activeStep];

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
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-500 rounded-xl blur-xl"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">PIPELINE</h2>
            <p className="text-xs text-white/40">How requests flow</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAnimating(!isAnimating)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg border transition-all',
            isAnimating 
              ? 'bg-[#00ff88]/10 border-[#00ff88]/50 text-[#00ff88]' 
              : 'bg-[#252530] border-white/5 text-white/60 hover:border-white/10'
          )}
        >
          {isAnimating ? '⏸️ Pause' : '▶️ Demo'}
        </button>
      </div>

      {/* Flow Steps */}
      <div className="relative mb-6 overflow-x-auto pb-4">
        <div className="absolute top-8 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 via-emerald-500 via-indigo-500 via-yellow-500 via-green-500 opacity-20" />
        
        <div className="relative flex items-center justify-between min-w-[700px]">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    'relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer',
                    isActive 
                      ? `bg-gradient-to-br ${step.color} border-white shadow-lg` 
                      : index < activeStep
                        ? 'bg-[#252530] border-[#00ff88]/50' 
                        : 'bg-[#1a1a24] border-white/10 opacity-50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`absolute inset-0 rounded-xl bg-white/20`}
                    />
                  )}
                  <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-white/40')} />
                </motion.div>
                
                <div className="mt-2 text-center">
                  <p className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-white' : 'text-white/40')}>
                    {step.label.split(' ')[0]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Step Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'p-4 rounded-xl mb-4 border',
            'bg-gradient-to-r from-[#1a1a24] to-[#1a1a24]/50 border-white/5'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-lg flex-shrink-0 bg-gradient-to-br', currentStep.color)}>
              <currentStep.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">{currentStep.label}</h3>
              <p className="text-sm text-white/50 mt-1">{currentStep.description}</p>
              {currentStep.agents && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentStep.agents.map(agent => (
                    <span 
                      key={agent}
                      className="px-2 py-1 text-xs rounded-lg bg-[#252530] border border-white/5 text-white/60"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <Clock className="w-4 h-4 text-white/30 ml-auto" />
              <p className="text-xs text-white/40 mt-1">{currentStep.duration}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Decision Tree & Metrics */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Decision Tree */}
        <div className="p-4 rounded-xl bg-[#252530] border border-white/5">
          <h4 className="text-xs text-white/40 uppercase tracking-wide mb-3 flex items-center gap-2">
            <GitBranch className="w-3 h-3" />
            Routing Rules
          </h4>
          <div className="space-y-1.5">
            {decisionTree.slice(0, 5).map((rule, index) => (
              <motion.div
                key={rule.keyword}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1a1a24] transition-colors"
              >
                <span className="text-sm">{rule.emoji}</span>
                <span className="text-xs text-white/50 flex-1">If "{rule.keyword}"...</span>
                <ArrowRight className="w-3 h-3 text-white/20" />
                <span className={cn('text-xs font-medium', rule.color)}>{rule.agent}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="p-4 rounded-xl bg-[#252530] border border-white/5">
          <h4 className="text-xs text-white/40 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Download className="w-3 h-3" />
            Pipeline Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Avg Response', value: '~1.2s', icon: Clock, color: 'text-blue-400' },
              { label: 'Success Rate', value: '99.8%', icon: CheckCircle2, color: 'text-[#00ff88]' },
              { label: 'Tools/Req', value: '~3.2', icon: Code, color: 'text-purple-400' },
              { label: 'Agents', value: '8', icon: Users, color: 'text-orange-400' },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-2 rounded-lg bg-[#1a1a24] border border-white/5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <metric.icon className={cn('w-3 h-3', metric.color)} />
                  <span className="text-[10px] text-white/40">{metric.label}</span>
                </div>
                <p className="text-lg font-bold text-white">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
