"use client";

import React from 'react';
import { BottomNav } from './BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';

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
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
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
        iconBg: 'bg-green-100 dark:bg-green-900/50',
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
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
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
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    },
];

const challenges = [
    {
        title: 'Weekly Reporter',
        description: 'Report 5 parking spots this week',
        points: 50,
        progress: 60,
        current: 3,
        total: 5,
        timeLeft: '4d left',
    },
    {
        title: 'Validation Master',
        description: 'Validate 15 spots this week',
        points: 40,
        progress: 53.33,
        current: 8,
        total: 15,
        timeLeft: '4d left',
    },
    {
        title: 'Night Owl',
        description: 'Report a spot after 10 PM',
        points: 20,
        progress: 0,
        current: 0,
        total: 1,
        timeLeft: '2d left',
    },
];

const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => {
    return (
        <Card className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-white dark:bg-card shadow-sm">
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

const ChallengeCard = ({ challenge }: { challenge: typeof challenges[0] }) => {
    return (
        <Card className="rounded-2xl bg-white dark:bg-card shadow-sm overflow-hidden">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-base">{challenge.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800 font-semibold">{challenge.timeLeft}</Badge>
                </div>

                <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                         <p className="text-green-600 font-semibold">{challenge.points} bonus points</p>
                         <p className="text-sm font-semibold text-muted-foreground">{challenge.current}/{challenge.total}</p>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}

export function LeaderboardClient() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-40 w-full bg-slate-50/95 dark:bg-slate-900/95">
        <div className="container flex h-20 items-center">
            <h1 className="text-3xl font-bold">Achievements</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 space-y-6">
            <Tabs defaultValue="challenges">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200/75 dark:bg-slate-800 rounded-full h-12 p-1">
                    <TabsTrigger value="achievements" className="rounded-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Achievements</TabsTrigger>
                    <TabsTrigger value="challenges" className="rounded-full text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Challenges</TabsTrigger>
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
                <TabsContent value="challenges" className="mt-6">
                   <Card className="rounded-2xl shadow-md bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/40">
                       <CardContent className="p-5">
                           <div className="flex items-center gap-3">
                               <Zap className="h-6 w-6 text-primary"/>
                               <div>
                                   <h3 className="text-lg font-bold text-primary">Weekly Challenges</h3>
                                   <p className="text-sm text-primary/80 dark:text-primary-foreground/80">Complete challenges to earn bonus points and exclusive badges!</p>
                               </div>
                           </div>
                       </CardContent>
                   </Card>
                   <div className="mt-6 space-y-3">
                       {challenges.map((challenge, index) => (
                           <ChallengeCard key={index} challenge={challenge} />
                       ))}
                   </div>
                </TabsContent>
            </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
