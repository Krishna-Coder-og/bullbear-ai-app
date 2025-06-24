import { NextResponse } from 'next/server';
import Alpaca from '@alpacahq/alpaca-trade-api';

// Initialize Alpaca client
const alpaca = new Alpaca({
  keyId: process.env.AP_CA_API_KEY_ID,
  secretKey: process.env.AP_CA_API_SECRET_KEY,
  paper: true,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',');
  const startDate = "2023-01-01"; // Use a fixed start date for comparison

  try {
    const historicalData: { [symbol: string]: { date: string, value: number }[] } = {};

    // Fetch data for all symbols in parallel
    const promises = symbols.map(async (symbol) => {
      const bars = alpaca.getBarsV2(symbol, {
        start: startDate,
        timeframe: "1Day",
      });

      const priceData: { date: string, price: number }[] = [];
      for await (const bar of bars) {
        if (bar.Timestamp && bar.ClosePrice) {
          priceData.push({ date: bar.Timestamp.split('T')[0], price: bar.ClosePrice });
        }
      }
      return { symbol, priceData };
    });

    const results = await Promise.all(promises);

    // Normalize the data for comparison
    results.forEach(({ symbol, priceData }) => {
      if (priceData.length > 0) {
        const initialPrice = priceData[0].price;
        historicalData[symbol] = priceData.map(d => ({
          date: d.date,
          // Calculate percentage growth relative to the first day
          value: ((d.price / initialPrice) - 1) * 100
        }));
      }
    });

    return NextResponse.json(historicalData);

  } catch (error: any) {
    console.error("Comparison API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch comparison data' }, { status: 500 });
  }
}