// import { ProChart } from "@/components/dashboard/ProChart";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// export default function ChartPage({ params }: { params: { symbol: string } }) {
//   const symbol = params.symbol.toUpperCase();

//   return (
//     <div className="min-h-screen bg-black text-white p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center gap-4 mb-4">
//           <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-full">
//             <ArrowLeft />
//           </Link>
//           <h1 className="text-3xl font-bold">
//             {symbol} - Advanced Chart
//           </h1>
//         </div>
//         {/* Reverted to subtle gray border */}
//         <div className="border border-gray-800 rounded-lg p-2 bg-gray-900">
//           <ProChart symbol={symbol} />
//         </div>
//       </div>
//     </div>
//   );
// }