// 'use client';

// import {
//   createChart,
//   ColorType,
//   LineStyle,
//   type IChartApi,
//   type ISeriesApi,
//   type CandlestickData,
//   type HistogramData,
//   type LineData,
// } from 'lightweight-charts';
// import { useEffect, useRef, useState } from 'react';

// export const ProChart = ({ symbol }: { symbol: string }) => {
//   const chartContainerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const chart: IChartApi = createChart(chartContainerRef.current, {
//       layout: {
//         background: { type: ColorType.Solid, color: '#000000' },
//         textColor: '#FFFFFF',
//       },
//       grid: {
//         vertLines: { color: 'rgba(0, 255, 0, 0.1)' },
//         horzLines: { color: 'rgba(0, 255, 0, 0.1)' },
//       },
//       width: chartContainerRef.current.clientWidth,
//       height: 600,
//     });

//     const candlestickSeries = chart.addCandlestickSeries({
//       upColor: '#22c55e',
//       downColor: '#ef4444',
//       borderVisible: false,
//       wickUpColor: '#22c55e',
//       wickDownColor: '#ef4444',
//     });

//     const sma50Series = chart.addLineSeries({
//       color: '#f97316',
//       lineWidth: 2,
//       title: 'SMA 50',
//     });

//     const ema200Series = chart.addLineSeries({
//       color: '#3b82f6',
//       lineWidth: 2,
//       title: 'EMA 200',
//     });

//     const volumeSeries = chart.addHistogramSeries({
//       priceFormat: { type: 'volume' },
//       priceScaleId: '',
//     });

//     chart.priceScale('').applyOptions({
//       scaleMargins: { top: 0.7, bottom: 0 },
//     });

//     const rsiSeries = chart.addLineSeries({
//       priceScaleId: 'rsi',
//       color: '#FFFFFF',
//       lineWidth: 2,
//     });

//     chart.priceScale('rsi').applyOptions({
//       scaleMargins: { top: 0.8, bottom: 0 },
//     });

//     rsiSeries.createPriceLine({
//       price: 70,
//       color: 'rgba(239, 68, 68, 0.5)',
//       lineWidth: 1,
//       lineStyle: LineStyle.Dashed,
//       axisLabelVisible: true,
//       title: 'Overbought',
//     });

//     rsiSeries.createPriceLine({
//       price: 30,
//       color: 'rgba(34, 197, 94, 0.5)',
//       lineWidth: 1,
//       lineStyle: LineStyle.Dashed,
//       axisLabelVisible: true,
//       title: 'Oversold',
//     });

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch(`/api/chart-data?symbol=${symbol}`);
//         if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

//         const data = await response.json();
//         if (data.error) throw new Error(data.error);

//         const volumeData: HistogramData[] = data.priceData.map((d: CandlestickData) => ({
//           time: d.time,
//           value: (d as any).volume,
//           color: d.close > d.open ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
//         }));

//         candlestickSeries.setData(data.priceData);
//         volumeSeries.setData(volumeData);
//         sma50Series.setData(data.sma50.filter((d: LineData) => d.value));
//         ema200Series.setData(data.ema200.filter((d: LineData) => d.value));
//         rsiSeries.setData(data.rsi14.filter((d: LineData) => d.value));

//         chart.timeScale().fitContent();
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const handleResize = () => {
//       if (chartContainerRef.current) {
//         chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//       }
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.remove();
//     };
//   }, [symbol]);

//   if (loading) return <div className="text-center p-8">Loading Chart Data...</div>;
//   if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

//   return <div ref={chartContainerRef} className="w-full h-[600px]" />;
// };
