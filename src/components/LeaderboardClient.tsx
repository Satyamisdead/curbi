"use client";

import React from 'react';
import { BottomNav } from './BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Check, Star } from 'lucide-react';

const achievements = [
    {
        icon: Star,
        title: 'First Spot',
        description: 'Report your first parking spot',
        points: 10,
        progress: 100,
        current: 1,
        total: 1,
        color: 'text-yellow-500',
        progressColor: 'bg-yellow-500',
        iconBg: 'bg-yellow-100',
    },
    {
        icon: Check,
        title: 'Helpful Validator',
        description: 'Validate 25 parking spots',
        points: 50,
        progress: 62,
        current: 31,
        total: 50,
        color: 'text-green-500',
        progressColor: 'bg-green-500',
        iconBg: 'bg-green-100',
    },
    {
        icon: Star,
        title: 'Community Leader',
        description: 'Get 100 upvotes on your reports',
        points: 100,
        progress: 45,
        current: 45,
        total: 100,
        color: 'text-blue-500',
        progressColor: 'bg-blue-500',
        iconBg: 'bg-blue-100',
    },
    {
        icon: Check,
        title: 'Early Bird',
        description: 'Report a spot before 8 AM',
        points: 20,
        progress: 0,
        current: 0,
        total: 1,
        color: 'text-purple-500',
        progressColor: 'bg-purple-500',
        iconBg: 'bg-purple-100',
    },
];


const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => {
    return (
        <Card className="rounded-2xl border-2 border-green-200 bg-white shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${achievement.iconBg}`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-base">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                        <p className={`${achievement.color} font-semibold`}>{achievement.points} points</p>
                        <span>{achievement.current}/{achievement.total}</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2 [&>div]:bg-green-500" />
                </div>
            </CardContent>
        </Card>
    );
};


export function LeaderboardClient() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 w-full bg-slate-50/95">
        <div className="container flex h-20 items-center">
            <h1 className="text-3xl font-bold">Achievements</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 space-y-6">
            <Tabs defaultValue="achievements">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200/75 rounded-full h-12 p-1">
                    <TabsTrigger value="achievements" className="rounded-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Achievements</TabsTrigger>
                    <TabsTrigger value="challenges" className="rounded-full text-base font-semibold">Challenges</TabsTrigger>
                </TabsList>
                <TabsContent value="achievements" className="mt-6">
                    <Card className="rounded-2xl shadow-md">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-center">Your Progress</h3>
                            <div className="flex justify-around mt-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-500">3</p>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-400">3</p>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">85</p>
                                    <p className="text-sm text-muted-foreground">Points Earned</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">All Achievements</h3>
                        <div className="space-y-3">
                            {achievements.map((achievement, index) => (
                                <AchievementCard key={index} achievement={achievement} />
                            ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="challenges">
                   {/* Challenges content can be added here */}
                </TabsContent>
            </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
