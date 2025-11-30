import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center p-4 border-b border-border bg-surface shadow-sm h-16">
      {/* Mobile Sidebar Trigger (Hidden on desktop, implemented in Layout if needed) */}
      <div className="md:hidden mr-4">
          <Menu />
      </div>
      
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
