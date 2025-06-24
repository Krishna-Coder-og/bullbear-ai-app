import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { DashboardClientLayout } from "@/components/dashboard/DashboardClientLayout";
import Alpaca from '@alpacahq/alpaca-trade-api';

// Define the shape of our data
interface NewsArticle { headline: string; source: string; url: string; image: string; }
interface AllocationData { name: string; value: number; }
interface WatchlistData { symbol: string; price: number; change: number; }

// Initialize the Alpaca client
const alpaca = new Alpaca({
  keyId: process.env.AP_CA_API_KEY_ID,
  secretKey: process.env.AP_CA_API_SECRET_KEY,
  paper: true,
});

export default async function DashboardPage() {
  const { userId, getToken } = await auth();

  let portfolioValue = 0;
  let allocationData: AllocationData[] = [];
  let newsData: NewsArticle[] = [];
  let watchlistData: WatchlistData[] = [];

  if (userId) {
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    if (supabaseAccessToken) {
      // =============================================
      //          THE FIX IS HERE
      // =============================================
      // Restore the full, correct client initialization
      const authenticatedSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
      );

      const { data: watchlistSymbols } = await authenticatedSupabase.from('watchlist').select('symbol').eq('user_id', userId);
      
      if (watchlistSymbols && watchlistSymbols.length > 0) {
        const symbols = watchlistSymbols.map(item => item.symbol);
        try {
          const latestQuotes = await alpaca.getLatestQuotes(symbols);
          
          for (const symbol of symbols) {
            const quote = latestQuotes.get(symbol);
            if (quote) {
              // This is our temporary debugging log
              console.log(`--- ALPACA QUOTE DATA FOR ${symbol} ---`);
              console.log(quote);
              console.log(`-----------------------------------------`);
              
              // We use dummy data to prevent further errors while we debug
              watchlistData.push({
                symbol: quote.Symbol,
                price: quote.AskPrice,
                change: 0, 
              });
            }
          }
        } catch (error) {
          console.error("Alpaca API error fetching watchlist:", error);
        }
      }

      // Fetch and process transaction data (no changes needed here)
      const { data: transactions } = await authenticatedSupabase.from('portfolio_transactions').select('symbol, type, quantity, price').eq('user_id', userId);
      if (transactions) {
        const portfolio: { [key: string]: number } = {};
        transactions.forEach(t => {
          const val = t.quantity * t.price;
          if (!portfolio[t.symbol]) portfolio[t.symbol] = 0;
          if (t.type === 'BUY') portfolio[t.symbol] += val; else portfolio[t.symbol] -= val;
        });
        for (const symbol in portfolio) {
          if (portfolio[symbol] > 0) allocationData.push({ name: symbol, value: portfolio[symbol] });
        }
        portfolioValue = allocationData.reduce((acc, stock) => acc + stock.value, 0);
      }
    }
  }

  // Fetch news data (no changes needed here)
  try {
    const finnhubToken = process.env.FINNHUB_API_KEY;
    const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubToken}`);
    if (response.ok) {
      const rawNews = await response.json();
      newsData = rawNews.slice(0, 5).map((article: any) => ({
        headline: article.headline, source: article.source, url: article.url, image: article.image
      }));
    }
  } catch (error) { console.error("Failed to fetch Finnhub news:", error); }
  
  // Render the layout
  return (
    <DashboardClientLayout 
      portfolioValue={portfolioValue}
      portfolioPercentageChange={0}
      allocationData={allocationData}
      newsData={newsData}
      watchlistData={watchlistData}
    />
  );
}