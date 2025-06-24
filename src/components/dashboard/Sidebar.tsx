'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Briefcase, Bot, LayoutDashboard, Newspaper, LineChart as LineChartIcon, Zap } from "lucide-react";

// Updated mapping to match landing page nav
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { href: '/compare', icon: LineChartIcon, label: 'Compare' },
  { href: '/ai-copilot', icon: Bot, label: 'AI Co-Pilot' },
  { href: '/news', icon: Newspaper, label: 'News' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black p-6 border-r border-gray-800 hidden md:flex flex-col justify-between">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-10 group">
          <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-neon-green transition-colors">
            <Zap className="text-white group-hover:text-deep-navy" />
          </div>
          <h1 className="text-xl font-bold">BullBear AI</h1>
        </Link>
        
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon /> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="text-xs text-gray-600">
        <p>© 2025 BullBear AI. All Rights Reserved.</p>
      </div>
    </aside>
  );
};