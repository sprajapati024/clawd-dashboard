import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const tradingPath = path.join(process.cwd(), '..', '..', 'trading-bot', 'trade_history.json');
    const tradingData = JSON.parse(fs.readFileSync(tradingPath, 'utf-8'));

    const positions = Object.entries(tradingData.positions || {}).map(([ticker, pos]: [string, any]) => ({
      ticker,
      shares: pos.shares,
      avg_price: pos.avg_price,
      value: pos.shares * pos.avg_price
    }));

    const totalPositionValue = positions.reduce((sum: number, p: any) => sum + p.value, 0);
    const totalPortfolioValue = tradingData.cash + totalPositionValue;

    // Calculate P&L (simplified - comparing to initial balance)
    const initialBalance = 10000;
    const pnl = totalPortfolioValue - initialBalance;
    const pnlPercent = (pnl / initialBalance) * 100;

    return NextResponse.json({
      success: true,
      data: {
        cash: tradingData.cash,
        positions,
        totalPositionValue,
        totalPortfolioValue,
        initialBalance,
        pnl: {
          value: pnl,
          percent: pnlPercent,
          isPositive: pnl >= 0
        },
        tradeCount: tradingData.trade_history?.length || 0,
        updatedAt: tradingData.updated_at
      }
    });
  } catch (error: any) {
    console.error('Error reading trading data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
