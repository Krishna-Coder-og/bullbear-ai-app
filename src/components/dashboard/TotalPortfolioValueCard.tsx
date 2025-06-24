'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const TotalPortfolioValueCard = ({ value, percentageChange }: { value: number, percentageChange: number }) => {
  const isPositive = percentageChange >= 0;

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-400">Total Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center text-lg mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
          <span>{Math.abs(percentageChange).toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};