'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Define the shape of the data for a single performer
export interface PerformerData {
  symbol: string;
  totalGainLoss: number;
  percentageGainLoss: number;
  marketValue: number;
}

interface PerformersTableProps {
  best: PerformerData[];
  worst: PerformerData[];
}

const PerformerRow = ({ performer }: { performer: PerformerData }) => {
  const isPositive = performer.totalGainLoss >= 0;
  return (
    <TableRow>
      <TableCell className="font-bold text-lg">{performer.symbol}</TableCell>
      <TableCell className="text-right font-semibold">
        ${performer.marketValue.toFixed(2)}
      </TableCell>
      <TableCell className={`text-right font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : '-'}${Math.abs(performer.totalGainLoss).toFixed(2)}
      </TableCell>
      <TableCell className={`text-right font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {performer.percentageGainLoss.toFixed(2)}%
      </TableCell>
    </TableRow>
  );
};

export const PerformersTable = ({ best, worst }: PerformersTableProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowUpRight className="text-green-500"/> Best Performers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {/* ============================================= */}
              {/*          THE FIX IS HERE                      */}
              {/* ============================================= */}
              <TableRow className="text-gray-400">
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Total Gain/Loss</TableHead>
                <TableHead className="text-right">% Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {best.map(p => <PerformerRow key={p.symbol} performer={p} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowDownLeft className="text-red-500"/> Worst Performers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {/* ============================================= */}
              {/*          THE FIX IS HERE                      */}
              {/* ============================================= */}
              <TableRow className="text-gray-400">
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Total Gain/Loss</TableHead>
                <TableHead className="text-right">% Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worst.map(p => <PerformerRow key={p.symbol} performer={p} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};