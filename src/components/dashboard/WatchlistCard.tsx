'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface WatchlistData {
  symbol: string;
  price: number;
  change: number;
}

export const WatchlistCard = ({ data }: { data: WatchlistData[] }) => {
  const router = useRouter();

  // =============================================
  //          ACTIVATING DELETE LOGIC
  // =============================================
  const handleDelete = async (symbol: string) => {
    const toastId = toast.loading(`Removing ${symbol} from watchlist...`);
    
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove stock.');
      }

      toast.success(result.message, { id: toastId });
      // This is a key Next.js feature: it tells the server to re-fetch the data
      // for the current page and re-render it, all without a full page reload.
      router.refresh(); 

    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center group">
                <Link href={`/chart/${stock.symbol}`} className="flex-grow">
                  <div className="font-bold text-lg hover:text-green-500 transition-colors">{stock.symbol}</div>
                </Link>
                <div className="text-right">
                  <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(stock.symbol)}
                  className="ml-4 p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${stock.symbol} from watchlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">Your watchlist is empty. Add stocks using the search bar above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};