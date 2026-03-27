"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, BarChart3, Heart, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: CheckSquare },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/bp-log", label: "BP Log", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FDFDF8] border-t border-gray-200 z-40 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "text-[#EB9D2A]"
                  : "text-[#667085] hover:text-[#1D2939]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
