import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  specialty: string;
  emoji: string;
}

const agentConfigs: Record<string, AgentConfig> = {
  xyro: { id: 'xyro', name: 'Xyro', role: 'Orchestrator', specialty: 'Task Routing', emoji: '🎯' },
  atlas: { id: 'atlas', name: 'Atlas', role: 'Travel', specialty: 'Trip Planning', emoji: '✈️' },
  cipher: { id: 'cipher', name: 'Cipher', role: 'Research', specialty: 'Web Search', emoji: '🔍' },
  codeslinger: { id: 'codeslinger', name: 'CodeSlinger', role: 'Developer', specialty: 'Code & Deploy', emoji: '⚡' },
  finny: { id: 'finny', name: 'Finny', role: 'Finance', specialty: 'Budget & Expenses', emoji: '💰' },
  lockjaw: { id: 'lockjaw', name: 'Lockjaw', role: 'Security', specialty: 'Threat Analysis', emoji: '🔒' },
  nova: { id: 'nova', name: 'Nova', role: 'Communications', specialty: 'Messages & Alerts', emoji: '📡' },
};

function getAgentStatus(agentDir: string): 'active' | 'idle' | 'busy' | 'offline' {
  const recentFiles = ['SOUL.md', 'memory', 'AGENTS.md', 'TOOLS.md'];
  try {
    const statsPath = path.join(agentDir, 'memory', 'heartbeat-state.json');
    if (fs.existsSync(statsPath)) {
      const state = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
      const lastActive = state.lastActivity || state.lastChecks?.email || 0;
      const now = Date.now();
      const hoursSince = (now - lastActive) / (1000 * 60 * 60);
      if (hoursSince < 1) return 'active';
      if (hoursSince < 6) return 'busy';
    }
  } catch {
    // Ignore errors
  }
  return 'idle';
}

export async function GET() {
  try {
    const agentsPath = path.join(process.cwd(), '..', '..', 'agents');
    const agentDirs = fs.readdirSync(agentsPath).filter((d: string) => 
      fs.statSync(path.join(agentsPath, d)).isDirectory()
    );

    const agents = agentDirs.map((dir: string) => {
      const config = agentConfigs[dir] || {
        id: dir,
        name: dir.charAt(0).toUpperCase() + dir.slice(1),
        role: 'Unknown',
        specialty: 'Unknown',
        emoji: '🤖'
      };
      
      const status = getAgentStatus(path.join(agentsPath, dir));
      const tasksCompleted = Math.floor(Math.random() * 100) + 20; // Placeholder
      
      return {
        ...config,
        status,
        lastActive: status === 'active' ? 'Now' : status === 'busy' ? '5m ago' : '1h ago',
        tasksCompleted
      };
    });

    return NextResponse.json({
      success: true,
      data: agents,
      counts: {
        total: agents.length,
        active: agents.filter((a: any) => a.status === 'active').length,
        busy: agents.filter((a: any) => a.status === 'busy').length,
        idle: agents.filter((a: any) => a.status === 'idle').length,
        offline: agents.filter((a: any) => a.status === 'offline').length
      }
    });
  } catch (error: any) {
    console.error('Error reading agents:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
