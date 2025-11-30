"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth") || pathname === "/" || pathname?.startsWith("/form");

  if (isAuthPage) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            {children}
        </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10">
        <Navbar />
        <div className="p-8 max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
