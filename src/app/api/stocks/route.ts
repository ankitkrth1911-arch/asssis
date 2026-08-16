import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2'; 
const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols')?.split(',') || ['AAPL', 'MSFT', 'TSLA'];

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await yahooFinance.quote(symbol);
        
        // Get last 2 days of history for sparkline
        const period1 = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const chart = await yahooFinance.chart(symbol, { period1, interval: '15m' });
        
        return {
          symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChangePercent,
          history: chart.quotes.map((q: any) => q.close).filter((c: any) => c !== null)
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
