import { NextResponse } from 'next/server';
import fs from 'fs';

function readProcFile(filename: string): string {
  try {
    return fs.readFileSync(`/proc/${filename}`, 'utf-8');
  } catch {
    return '';
  }
}

function parseMeminfo(): { used: number; total: number; percent: number } {
  const meminfo = readProcFile('meminfo');
  const lines = meminfo.split('\n');
  
  let memTotal = 0;
  let memAvailable = 0;
  
  lines.forEach((line: string) => {
    if (line.startsWith('MemTotal:')) {
      memTotal = parseInt(line.split(':')[1].trim().split(' ')[0]) || 0;
    }
    if (line.startsWith('MemAvailable:') || line.startsWith('MemFree:')) {
      memAvailable = parseInt(line.split(':')[1].trim().split(' ')[0]) || 0;
    }
  });

  const used = memTotal - memAvailable;
  const percent = memTotal > 0 ? Math.round((used / memTotal) * 100) : 0;
  const usedGB = (used / 1024 / 1024).toFixed(1);
  const totalGB = (memTotal / 1024 / 1024).toFixed(1);

  return { used: parseFloat(usedGB), total: parseFloat(totalGB), percent };
}

function parseLoadavg(): { load1: number; load5: number; load15: number } {
  const loadavg = readProcFile('loadavg');
  const parts = loadavg.split(' ');
  return {
    load1: parseFloat(parts[0]) || 0,
    load5: parseFloat(parts[1]) || 0,
    load15: parseFloat(parts[2]) || 0
  };
}

function getUptime(): { seconds: number; days: string } {
  const uptime = readProcFile('uptime');
  const seconds = parseFloat(uptime.split(' ')[0]) || 0;
  const days = (seconds / 86400).toFixed(1);
  return { seconds, days };
}

export async function GET() {
  try {
    const mem = parseMeminfo();
    const load = parseLoadavg();
    const uptime = getUptime();
    
    // CPU count for load percentage
    const cpuInfo = readProcFile('cpuinfo');
    const cpuCount = (cpuInfo.match(/^processor/gm) || []).length || 1;
    
    return NextResponse.json({
      success: true,
      data: {
        cpu: {
          load1: load.load1,
          load5: load.load5,
          load15: load.load15,
          cores: cpuCount,
          usagePercent: Math.round((load.load1 / cpuCount) * 100)
        },
        memory: {
          used: mem.used,
          total: mem.total,
          percent: mem.percent,
          unit: 'GB'
        },
        uptime: {
          seconds: uptime.seconds,
          formatted: `${uptime.days} days`
        },
        hostname: 'ubuntu-4gb-nbg1-1',
        ip: '46.225.58.208'
      }
    });
  } catch (error: any) {
    console.error('Error reading system metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
