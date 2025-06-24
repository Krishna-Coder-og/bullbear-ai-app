'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TotalPortfolioValueCard } from "./TotalPortfolioValueCard";
import { PortfolioAllocationChart } from "./PortfolioAllocationChart";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { AICopilotCard } from "./AICopilotCard";
import { WatchlistSearch } from "./WatchlistSearch";
import { WatchlistCard } from "./WatchlistCard";
import { Sidebar } from "./Sidebar"; // Import the new sidebar

// Prop interfaces
interface NewsArticle { headline: string; source: string; url: string; image: string; }
interface WatchlistData { symbol: string; price: number; change: number; }
interface DashboardClientLayoutProps {
  portfolioValue: number;
  portfolioPercentageChange: number;
  allocationData: { name: string; value: number }[];
  newsData: NewsArticle[];
  watchlistData: WatchlistData[];
}

export const DashboardClientLayout = ({
  portfolioValue,
  portfolioPercentageChange,
  allocationData,
  newsData,
  watchlistData,
}: DashboardClientLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <WatchlistSearch />
            <AddTransactionDialog />
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TotalPortfolioValueCard value={portfolioValue} percentageChange={portfolioPercentageChange} />
            <AICopilotCard />
          </div>
          <div className="space-y-8">
            <PortfolioAllocationChart data={allocationData} />
            <WatchlistCard data={watchlistData} />
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader><CardTitle>Top News</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsData?.map((article, index) => (
                    <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-800 p-2 rounded-md transition-colors">
                      <p className="font-semibold leading-tight">{article.headline}</p>
                      <p className="text-xs text-gray-500 mt-1">{article.source}</p>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};