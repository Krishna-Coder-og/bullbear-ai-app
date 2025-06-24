'use client'; 

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AllocationData { name: string; value: number; }
interface PortfolioAllocationChartProps { data: AllocationData[]; }

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943']; // Reverted to default colors

export const PortfolioAllocationChart = ({ data }: PortfolioAllocationChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
        <CardContent><p className="text-gray-400 text-center py-8">No transaction data available to display allocation.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};