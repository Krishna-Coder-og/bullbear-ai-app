import { NextResponse } from 'next/server';
import Alpaca from '@alpacahq/alpaca-trade-api';
import { SMA, EMA, RSI } from 'technicalindicators';

// Initialize the Alpaca client
const alpaca = new Alpaca({
  keyId: process.env.AP_CA_API_KEY_ID,
  secretKey: process.env.AP_CA_API_SECRET_KEY,
  paper: true,
});

// =======================================
//          THE FIX IS HERE
// =======================================
// 1. Define the structure of our chart data
interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
  }

  try {
    const bars = alpaca.getBarsV2(symbol, {
      start: "2022-01-01",
      timeframe: "1Day",
      limit: 500,
    });

    // 2. Apply our new interface to the historicalData array
    const historicalData: CandlestickData[] = [];
    for await (const bar of bars) {
      if (bar.Timestamp && bar.OpenPrice && bar.HighPrice && bar.LowPrice && bar.ClosePrice && bar.Volume) {
        historicalData.push({
          time: bar.Timestamp.split('T')[0],
          open: bar.OpenPrice,
          high: bar.HighPrice,
          low: bar.LowPrice,
          close: bar.ClosePrice,
          volume: bar.Volume,
        });
      }
    }

    if (historicalData.length === 0) {
      return NextResponse.json({ error: 'No data found for this symbol' }, { status: 404 });
    }

    const closePrices = historicalData.map(bar => bar.close);

    const sma50 = SMA.calculate({ period: 50, values: closePrices });
    const ema200 = EMA.calculate({ period: 200, values: closePrices });
    const rsi14 = RSI.calculate({ period: 14, values: closePrices });
    
    const sma50Padded = Array(historicalData.length - sma50.length).fill(undefined).concat(sma50);
    const ema200Padded = Array(historicalData.length - ema200.length).fill(undefined).concat(ema200);
    const rsi14Padded = Array(historicalData.length - rsi14.length).fill(undefined).concat(rsi14);
    
    // The rest of the code is unchanged, but now TypeScript understands the data structure
    const smaData = sma50Padded.map((value, index) => ({ time: historicalData[index].time, value }));
    const emaData = ema200Padded.map((value, index) => ({ time: historicalData[index].time, value }));
    const rsiData = rsi14Padded.map((value, index) => ({ time: historicalData[index].time, value }));
    
    return NextResponse.json({
      priceData: historicalData,
      sma50: smaData,
      ema200: emaData,
      rsi14: rsiData,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to fetch chart data' }, { status: 500 });
  }
}