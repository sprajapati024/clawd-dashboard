'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SystemHealth, 
  TaskBoard, 
  BudgetTracker, 
  AgentGrid, 
  IntegrationGrid, 
  QuickActions,
  ConversationFlow,
  ActiveCrons
} from '@/components/dashboard';
import { Activity, Wifi, WifiOff, RefreshCw, Menu, X, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Glow orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[150px]"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ff88]/20">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#00ff88] rounded-xl blur-xl"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  MISSION CONTROL
                </h1>
                <p className="text-xs text-white/40">OpenClaw Agent System v2.0</p>
              </div>
            </motion.div>
            
            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10"
              >
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00ff88]' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
                <span className="text-sm text-white/60">{isConnected ? 'Online' : 'Offline'}</span>
              </motion.div>

              {/* Time */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 font-mono text-sm">
                <Activity className="w-4 h-4 text-[#00ff88]" />
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black text-sm font-semibold rounded-xl hover:bg-[#00ff88]/90 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 bg-white/5 rounded-xl border border-white/10"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 sm:hidden"
          >
            <div className="bg-[#1a1a24] rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00ff88]' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
                <span className="text-sm text-white/60">{isConnected ? 'System Online' : 'Offline'}</span>
              </div>
              <div className="space-y-2">
                <button onClick={handleRefresh} className="w-full flex items-center gap-3 px-4 py-3 bg-[#00ff88]/10 rounded-xl text-[#00ff88] font-medium">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Hero Card - System Health */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <SystemHealth />
          </motion.div>

          {/* Budget Tracker */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <BudgetTracker />
          </motion.div>

          {/* Task Board */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <TaskBoard />
          </motion.div>

          {/* Agent Fleet */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <AgentGrid />
          </motion.div>

          {/* Integrations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="sm:col-span-2"
          >
            <IntegrationGrid />
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="sm:col-span-2"
          >
            <QuickActions />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0a0a0f]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <span>🚀 Powered by OpenClaw</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00ff88]' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
              <span>{isConnected ? 'All systems operational' : 'Connection issues'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
