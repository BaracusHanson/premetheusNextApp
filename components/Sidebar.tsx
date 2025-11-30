"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Award, 
  GitBranch, 
  BarChart2, 
  User 
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Quests",
    icon: Map,
    href: "/quests",
    color: "text-violet-500",
  },
  {
    label: "Badges",
    icon: Award,
    href: "/badges",
    color: "text-pink-700",
  },
  {
    label: "Skill Tree",
    icon: GitBranch,
    href: "/skilltree",
    color: "text-orange-700",
  },
  {
    label: "Stats",
    icon: BarChart2,
    href: "/stats",
    color: "text-emerald-500",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-gray-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-surface text-foreground border-r border-border shadow-sm">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             {/* Logo Placeholder */}
             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">P</div>
          </div>
          <h1 className="text-2xl font-bold font-heading">Prometheus</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
