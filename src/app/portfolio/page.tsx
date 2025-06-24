import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Alpaca from '@alpacahq/alpaca-trade-api';
import { PerformersTable, PerformerData } from "../../components/dashboard/PerformersTable";
import { HistoricalPerformanceChart, HistoricalDataPoint } from "../../components/dashboard/HistoricalPerformanceChart";
import { SectorAllocationChart } from "../../components/dashboard/SectorAllocationChart";
import { Sidebar } from "../../components/dashboard/Sidebar";

const alpaca = new Alpaca({ keyId: process.env.AP_CA_API_KEY_ID, secretKey: process.env.AP_CA_API_SECRET_KEY, paper: true });

async function getHistoricalData(symbols: string[], startDate: string) {
  const data: { [symbol: string]: { [date: string]: number } } = {};
  for (const symbol of symbols) {
    data[symbol] = {};
    const bars = alpaca.getBarsV2(symbol, { start: startDate, timeframe: "1Day" });
    for await (const bar of bars) {
      if (bar.Timestamp && bar.ClosePrice) {
        data[symbol][bar.Timestamp.split('T')[0]] = bar.ClosePrice;
      }
    }
  }
  return data;
}

async function getSectorInfo(symbols: string[]) {
  const finnhubToken = process.env.FINNHUB_API_KEY;
  const sectorData: { [symbol: string]: string } = {};
  for (const symbol of symbols) {
    try {
      const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubToken}`);
      const data = await response.json();
      sectorData[symbol] = data.finnhubIndustry || 'Other';
    } catch (error) {
      console.error(`Failed to fetch sector for ${symbol}:`, error);
      sectorData[symbol] = 'Other';
    }
  }
  return sectorData;
}

export default async function PortfolioPage() {
  const { userId, getToken } = await auth();
  if (!userId) return <div>Please log in to view your portfolio.</div>;

  const supabaseAccessToken = await getToken({ template: 'supabase' });
  if (!supabaseAccessToken) return <div>Could not authenticate with database.</div>;

  const authenticatedSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } });

  const { data: transactions } = await authenticatedSupabase.from('portfolio_transactions').select('symbol, type, quantity, price, created_at').eq('user_id', userId).order('created_at', { ascending: true });

  let bestPerformers: PerformerData[] = [];
  let worstPerformers: PerformerData[] = [];
  let historicalPerformance: HistoricalDataPoint[] = [];
  let sectorAllocation: { name: string, value: number }[] = [];

  if (transactions && transactions.length > 0) {
    const symbols = [...new Set(transactions.map(t => t.symbol))];
    const startDate = transactions[0].created_at.split('T')[0];

    const [liveQuotes, stockHistory, benchmarkHistory, sectorInfo] = await Promise.all([
      alpaca.getLatestQuotes(symbols),
      getHistoricalData(symbols, startDate),
      getHistoricalData(['SPY'], startDate),
      getSectorInfo(symbols)
    ]);
    
    const holdings: { [key: string]: { shares: number, cost: number } } = {};
    transactions.forEach(t => {
      if (!holdings[t.symbol]) { holdings[t.symbol] = { shares: 0, cost: 0 }; }
      const transactionCost = t.quantity * t.price;
      if (t.type === 'BUY') {
        holdings[t.symbol].shares += t.quantity;
        holdings[t.symbol].cost += transactionCost;
      } else {
        const avgCost = holdings[t.symbol].shares > 0 ? holdings[t.symbol].cost / holdings[t.symbol].shares : 0;
        holdings[t.symbol].cost -= t.quantity * avgCost;
        holdings[t.symbol].shares -= t.quantity;
      }
    });

    const performanceData: PerformerData[] = [];
    const sectorValues: { [sector: string]: number } = {};
    for (const symbol of Object.keys(holdings)) {
      const quote = liveQuotes.get(symbol);
      const holding = holdings[symbol];
      if (quote && holding && holding.shares > 0) {
        const marketValue = holding.shares * quote.AskPrice;
        const totalGainLoss = marketValue - holding.cost;
        const percentageGainLoss = holding.cost > 0 ? (totalGainLoss / holding.cost) * 100 : 0;
        performanceData.push({ symbol, totalGainLoss, percentageGainLoss, marketValue });
        
        const sector = sectorInfo[symbol] || 'Other';
        if (!sectorValues[sector]) { sectorValues[sector] = 0; }
        sectorValues[sector] += marketValue;
      }
    }
    performanceData.sort((a, b) => b.totalGainLoss - a.totalGainLoss);
    bestPerformers = performanceData.filter(p => p.totalGainLoss >= 0).slice(0, 5);
    worstPerformers = performanceData.filter(p => p.totalGainLoss < 0).reverse().slice(0, 5);
    sectorAllocation = Object.keys(sectorValues).map(sector => ({ name: sector, value: sectorValues[sector] }));

    const dailyValues: { [date: string]: number } = {};
    const sortedDates = Object.keys(benchmarkHistory.SPY || {}).sort();
    
    if (sortedDates.length > 0) {
        sortedDates.forEach(date => {
            let totalValueOnDate = 0;
            for (const symbol of symbols) {
                const relevantTransactions = transactions.filter(t => t.symbol === symbol && t.created_at.split('T')[0] <= date);
                const sharesHeld = relevantTransactions.reduce((acc, t) => acc + (t.type === 'BUY' ? t.quantity : -t.quantity), 0);
                if (sharesHeld > 0 && stockHistory[symbol] && stockHistory[symbol][date]) {
                    totalValueOnDate += sharesHeld * stockHistory[symbol][date];
                }
            }
            dailyValues[date] = totalValueOnDate;
        });

        if (Object.keys(dailyValues).length > 1) {
            const initialPortfolioValue = Object.values(dailyValues).find(v => v > 0) || 1;
            const initialBenchmarkValue = benchmarkHistory.SPY[sortedDates.find(d => benchmarkHistory.SPY[d]) || sortedDates[0]] || 1;
            
            historicalPerformance = sortedDates.map(date => ({
                date,
                portfolioValue: dailyValues[date] > 0 ? ((dailyValues[date] / initialPortfolioValue) - 1) * 100 : -100,
                benchmarkValue: benchmarkHistory.SPY[date] ? ((benchmarkHistory.SPY[date] / initialBenchmarkValue) - 1) * 100 : 0
            })).filter(dp => dp.portfolioValue !== -100);
        }
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Portfolio Performance</h2>
          <p className="text-gray-400">A detailed analysis of your holdings and their performance.</p>
        </header>
        <div className="space-y-8">
          <HistoricalPerformanceChart data={historicalPerformance} />
          <SectorAllocationChart data={sectorAllocation} />
          <PerformersTable best={bestPerformers} worst={worstPerformers} />
        </div>
      </main>
    </div>
  );
}