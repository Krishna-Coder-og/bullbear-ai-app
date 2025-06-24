'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the shape of the data point for our chart
export interface HistoricalDataPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
}

interface HistoricalPerformanceChartProps {
  data: HistoricalDataPoint[];
}

export const HistoricalPerformanceChart = ({ data }: HistoricalPerformanceChartProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle>Historical Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="date" stroke="#888888" />
                <YAxis stroke="#888888" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Growth']}
                />
                <Legend />
                <Line type="monotone" dataKey="portfolioValue" name="Your Portfolio" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="benchmarkValue" name="S&P 500 (SPY)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Not enough transaction history to display chart.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};