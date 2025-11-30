"use client";

import { useUserStore } from "@/store/useUserStore";
import { LevelCard } from "@/components/LevelCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, Star } from "lucide-react";

export default function ProfileStats() {
  const { xp, level, stats } = useUserStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
            <LevelCard level={level} xp={xp} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-warning" />
                        Current Focus
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Mastering React Server Components and optimizing render cycles.</p>
                </CardContent>
            </Card>
        </div>

        {/* Middle Column - Stats */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary" />
                    Attributes Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Strength</div>
                        <div className="text-2xl font-bold">{stats.strength}</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Intelligence</div>
                        <div className="text-2xl font-bold">{stats.intelligence}</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Creativity</div>
                        <div className="text-2xl font-bold">{stats.creativity}</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Social</div>
                        <div className="text-2xl font-bold">{stats.social}</div>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-destructive" />
                        Daily Goals
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                            <span className="text-sm">Complete 2 Quests</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                            <span className="text-sm line-through text-muted-foreground">Earn 100 XP</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                            <span className="text-sm">Update Profile</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
