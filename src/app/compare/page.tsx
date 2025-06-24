'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { Sidebar } from '@/components/dashboard/Sidebar';

interface ComparisonData { [symbol: string]: { date: string; value: number }[]; }
const COLORS = ['#22c55e', '#3b82f6', '#ec4899', '#f97316'];

export default function ComparePage() {
  const [symbols, setSymbols] = useState<string[]>(['SPY', 'QQQ']);
  const [inputValue, setInputValue] = useState('');
  const [chartData, setChartData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSymbol = () => {
    const newSymbol = inputValue.trim().toUpperCase();
    if (newSymbol && !symbols.includes(newSymbol) && symbols.length < 4) {
      setSymbols([...symbols, newSymbol]);
      setInputValue('');
    } else if (symbols.length >= 4) {
      toast.warning("You can compare a maximum of 4 symbols.");
    }
  };
  const removeSymbol = (symbolToRemove: string) => { setSymbols(symbols.filter(s => s !== symbolToRemove)); };
  const handleFetchData = async () => {
    if (symbols.length < 2) {
      toast.error("Please select at least two symbols to compare.");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Fetching comparison data...");
    try {
      const response = await fetch(`/api/compare?symbols=${symbols.join(',')}`);
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      setChartData(data);
      toast.success("Comparison data loaded!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const allDates = chartData ? [...new Set(Object.values(chartData).flatMap(s => s.map(d => d.date)))].sort() : [];
  const formattedData = allDates.map(date => {
    const entry: { [key: string]: any } = { date };
    if (chartData) {
      for (const symbol in chartData) {
        const dataPoint = chartData[symbol].find(d => d.date === date);
        entry[symbol] = dataPoint ? dataPoint.value : null;
      }
    }
    return entry;
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Stock Comparison Tool</h2>
          <p className="text-gray-400">Compare the normalized performance of up to 4 stocks over time.</p>
        </header>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Enter a symbol (e.g., AAPL)" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-gray-800 border-gray-700 w-48" />
                <Button onClick={addSymbol} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {symbols.map(symbol => (
                  <div key={symbol} className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                    <span>{symbol}</span>
                    <button onClick={() => removeSymbol(symbol)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                  </div>
                ))}
              </div>
              <Button onClick={handleFetchData} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>{isLoading ? "Loading..." : "Compare"}</Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 w-full h-[500px]">
          {chartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="date" stroke="#888888" />
                <YAxis stroke="#888888" tickFormatter={(value) => `${value}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]} />
                <Legend />
                {symbols.map((symbol, index) => (
                  <Line key={symbol} type="monotone" dataKey={symbol} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={false} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full bg-gray-900/50 rounded-lg"><p className="text-gray-500">Select symbols and click "Compare" to see results.</p></div>
          )}
        </div>
      </main>
    </div>
  );
}