"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Activity, Target, Zap } from "lucide-react";
import Link from "next/link";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar
} from 'recharts';

// Types for our props
interface StatsPageProps {
  xpHistory: { date: string; xp: number }[];
  themeData: { subject: string; A: number; fullMark: number }[];
  activityData: { day: string; count: number }[];
  globalStats: {
    totalQuests: number;
    completedQuests: number;
    completionRate: number;
    averageDailyXp: number;
  };
}

export default function StatsPageClient({ 
  xpHistory, 
  themeData, 
  activityData,
  globalStats 
}: StatsPageProps) {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
       {/* Header */}
       <div className="space-y-2">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-heading font-bold text-primary">Centre d'Analyse</h1>
        <p className="text-muted-foreground">Visualisez votre progression et vos compétences.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Complétion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{globalStats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                    {globalStats.completedQuests} / {globalStats.totalQuests} quêtes
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moyenne XP / Jour</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{globalStats.averageDailyXp}</div>
                <p className="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Focus Principal</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{themeData.length > 0 ? themeData[0].subject : "N/A"}</div>
                <p className="text-xs text-muted-foreground">Compétence dominante</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activité Récente</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{activityData.reduce((acc, curr) => acc + curr.count, 0)}</div>
                <p className="text-xs text-muted-foreground">Actions cette semaine</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* XP Growth Chart */}
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Croissance XP (30 Jours)</CardTitle>
                <CardDescription>Votre accumulation d'expérience dans le temps.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={xpHistory}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" hide />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="xp" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2} 
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* Radar Chart - Skills */}
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Radar de Compétences</CardTitle>
                <CardDescription>Distribution de votre XP par thématique.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={themeData}>
                        <PolarGrid opacity={0.2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="XP"
                            dataKey="A"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap Mockup (Bar Chart for Last 7 Days) */}
      <Card>
        <CardHeader>
            <CardTitle>Intensité d'Activité (7 derniers jours)</CardTitle>
            <CardDescription>Nombre d'actions ou quêtes complétées par jour.</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--muted)/0.2)'}}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
