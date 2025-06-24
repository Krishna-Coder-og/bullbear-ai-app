'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AllocationData {
  name: string; // Sector name
  value: number; // Total value of that sector
}

interface SectorAllocationChartProps {
  data: AllocationData[];
}

// A different color palette for variety
const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#8b5cf6', '#ec4899', '#facc15'];

export const SectorAllocationChart = ({ data }: SectorAllocationChartProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle>Sector Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No data to display sector allocation.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};