'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const WatchlistSearch = () => {
  const [symbol, setSymbol] = useState('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && symbol.trim() !== '') {
      event.preventDefault();
      
      const toastId = toast.loading(`Adding ${symbol.toUpperCase()} to watchlist...`);

      try {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: symbol.trim() }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Something went wrong');
        }
        
        toast.success(result.message, { id: toastId });
        setSymbol(''); // Clear input on success

      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <Input
        type="search"
        placeholder="Add to watchlist (e.g., GOOG)..."
        className="w-64 pl-10 bg-gray-900 border-gray-800"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};