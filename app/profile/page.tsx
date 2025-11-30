import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LevelCard } from "@/components/LevelCard";
import { Button } from "@/components/ui/button";
import { Download, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Since this is a Server Component, we don't use hooks that need client context for everything.
// But we need the UserStore values which are client-side state (zustand).
// In a real app, we would fetch this data from DB in the server component.
// For this demo, I will create a Client Component wrapper for the stats part.
// But the prompt asked for "Recover user in server components via currentUser()".

import ProfileStats from "./_components/ProfileStats";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
      redirect("/auth/sign-in");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-surface p-8 rounded-xl shadow-sm border">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold font-heading">{user.fullName}</h1>
            <p className="text-muted-foreground">@{user.username || user.firstName?.toLowerCase()}</p>
            <div className="flex justify-center md:justify-start gap-2 mt-4">
                <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
                <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Profile
                </Button>
            </div>
        </div>
      </div>

      {/* Client-side Stats content */}
      <ProfileStats />
    </div>
  );
}
