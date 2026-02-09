export const siteConfig = {
  name: "Mission Control",
  description: "OpenClaw Agent System Dashboard",
  url: "https://mission-control.vercel.app",
  
  dashboard: {
    title: "SYSTEM STATUS",
    subtitle: "All systems operational",
    
    refreshInterval: 30000, // 30 seconds
    
    sections: {
      health: { label: "Health", enabled: true },
      tasks: { label: "Tasks", enabled: true },
      budget: { label: "Budget", enabled: true },
      agents: { label: "Agents", enabled: true },
      integrations: { label: "Integrations", enabled: true },
      quickActions: { label: "Quick Actions", enabled: true },
    },
  },
  
  theme: {
    primary: "#00ff88", // Cyber green
    secondary: "#ff3366", // Accent red/pink
    background: "#0a0a0f",
    surface: "#12121a",
    border: "#1e1e2e",
    text: "#e0e0e0",
    muted: "#6b6b7b",
  },
};

export type SiteConfig = typeof siteConfig;
