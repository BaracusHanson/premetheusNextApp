"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  Award, 
  GitBranch, 
  BarChart2, 
  User,
  Compass,
  Settings,
  Sparkles
} from "lucide-react";
import { slideFromLeft, staggerContainer } from "@/lib/motion";

const routes = [
  {
    label: "Tableau de Bord",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Parcours de Vie",
    icon: Compass,
    href: "/journeys",
    color: "text-emerald-500",
  },
  {
    label: "Quêtes",
    icon: Map,
    href: "/quests",
    color: "text-violet-500",
  },
  {
    label: "Compétences",
    icon: GitBranch,
    href: "/skilltree",
    color: "text-orange-600",
  },
  {
    label: "Succès",
    icon: Award,
    href: "/badges",
    color: "text-pink-600",
  },
  {
    label: "Statistiques",
    icon: BarChart2,
    href: "/stats",
    color: "text-blue-600",
  },
  {
    label: "Diagnostic",
    icon: Sparkles,
    href: "/diagnostic",
    color: "text-yellow-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground border-r border-border shadow-sm">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
               P
             </div>
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">Prometheus</h1>
        </Link>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {routes.map((route) => (
            <motion.div key={route.href} variants={slideFromLeft}>
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/50 rounded-xl transition-all duration-200",
                    pathname?.startsWith(route.href) 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3 transition-colors", pathname?.startsWith(route.href) ? route.color : "text-muted-foreground/70 group-hover:text-foreground")} />
                    {route.label}
                  </div>
                  {pathname?.startsWith(route.href) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto animate-pulse" />
                  )}
                </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <Link
            href="/profile"
            className={cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-muted/50 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground"
            )}
        >
            <div className="flex items-center flex-1">
                <Settings className="h-5 w-5 mr-3 text-muted-foreground/70 group-hover:text-foreground" />
                Paramètres
            </div>
        </Link>
      </div>
    </div>
  );
}
