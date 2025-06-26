"use client";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CreditCard,
  // PiggyBank,
  // Target,
  Receipt,
  Settings,
  // BarChart3,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Transazioni", path: "/transactions" },
    // { icon: PiggyBank, label: "Budget", path: "/budget" },
    // { icon: Target, label: "Obiettivi", path: "/goals" },
    // { icon: BarChart3, label: "Report", path: "/reports" },
    { icon: CreditCard, label: "Abbonamenti", path: "/subscriptions" },
    { icon: Settings, label: "Impostazioni", path: "/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-10">
      {/* Logo */}
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-8">
        <span className="text-white font-bold text-lg">F</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                group relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
