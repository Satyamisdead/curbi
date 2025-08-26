"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { BottomNav } from './BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Star, Check, Trophy, User, Moon, Sun } from 'lucide-react';

const user = {
    name: 'Curbi User',
    rank: 8,
    points: 245,
    spotsReported: 12,
    validations: 31,
    avatar: 'https://placehold.co/100x100.png'
};

const badges = [
    {
        icon: Star,
        title: 'First Spot',
        description: 'Reported your first parking spot',
        color: 'text-yellow-500',
        iconBg: 'bg-yellow-100',
    },
    {
        icon: Check,
        title: 'Helpful Validator',
        description: 'Validated 25+ parking spots',
        color: 'text-green-500',
        iconBg: 'bg-green-100',
    },
    {
        icon: Trophy,
        title: 'Community Hero',
        description: 'Top contributor this month',
        color: 'text-blue-500',
        iconBg: 'bg-blue-100',
    }
];

const SettingsItem = ({ icon: Icon, title, control }: { icon: React.ElementType, title: string, control: React.ReactNode }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{title}</span>
        </div>
        {control}
    </div>
);


export function ProfileClient() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-40 w-full bg-slate-50/95 dark:bg-slate-900/95">
                <div className="container flex h-20 items-center">
                    <h1 className="text-3xl font-bold">Profile</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                <div className="container mx-auto px-4 space-y-6">
                    {/* User Info Card */}
                    <Card className="rounded-3xl shadow-lg">
                        <CardContent className="p-6 text-center">
                            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/50">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile picture" />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-lg text-muted-foreground">Rank #{user.rank}</p>

                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary">{user.points}</p>
                                    <p className="text-sm text-muted-foreground">Points</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-500">{user.spotsReported}</p>
                                    <p className="text-sm text-muted-foreground">Spots Reported</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-400">{user.validations}</p>
                                    <p className="text-sm text-muted-foreground">Validations</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Badges Earned */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Badges Earned</h3>
                        <Card className="rounded-2xl shadow-md">
                            <CardContent className="p-4 space-y-3">
                                {badges.map((badge, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${badge.iconBg}`}>
                                            <badge.icon className={`h-6 w-6 ${badge.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{badge.title}</p>
                                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Settings */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Settings</h3>
                        <Card className="rounded-2xl shadow-md">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Sun className="h-5 w-5" />
                                    <Switch
                                        id="dark-mode"
                                        checked={theme === 'dark'}
                                        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    />
                                    <Moon className="h-5 w-5" />
                                     <Label htmlFor="dark-mode" className="flex-1 ml-2">Dark Mode</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
