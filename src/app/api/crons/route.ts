import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const output = execSync('openclaw cron list', { encoding: 'utf-8' });
    
    // Parse cron output
    const lines = output.trim().split('\n');
    const crons = lines.map((line: string) => {
      const parts = line.split(/\s+/);
      return {
        id: parts[0] || '',
        schedule: parts.slice(1, 5).join(' ') || '',
        command: parts.slice(5).join(' ') || '',
        status: line.includes('✓') ? 'active' : line.includes('✗') ? 'disabled' : 'unknown'
      };
    }).filter((c: any) => c.id);

    const activeCount = crons.filter((c: any) => c.status === 'active').length;

    return NextResponse.json({
      success: true,
      data: crons,
      counts: {
        total: crons.length,
        active: activeCount,
        disabled: crons.length - activeCount
      }
    });
  } catch (error: any) {
    // Return mock data if openclaw CLI fails
    return NextResponse.json({
      success: true,
      data: [
        { id: 'xyro-hourly', schedule: '* * * * *', command: 'openclaw agent xyro --mode heartbeat', status: 'active' },
        { id: 'trading-live', schedule: '*/15 9-16 * * 1-5', command: 'python3 trading-bot/src/main.py --mode live', status: 'active' },
        { id: 'daily-report', schedule: '0 16 * * 1-5', command: 'echo "Daily trading report"', status: 'active' }
      ],
      counts: { total: 3, active: 3, disabled: 0 },
      note: 'Using fallback data - openclaw CLI not available'
    });
  }
}
