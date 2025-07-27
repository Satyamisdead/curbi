"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BottomNav } from './BottomNav';

const recentSearches = [
  'Downtown San Francisco',
  'Union Square',
  'Financial District',
  'Mission District',
];

const popularDestinations = [
  { name: 'Union Square', spots: 12, walk: 3 },
  { name: 'Pier 39', spots: 8, walk: 5 },
  { name: 'Oracle Park', spots: 15, walk: 10 },
  { name: 'Golden Gate Bridge', spots: 5, walk: 20 },
];

export function SearchClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full bg-background/95 border-b">
        <div className="container flex h-16 items-center">
            <h1 className="text-2xl font-bold">Search Parking</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Search Section */}
          <div className="space-y-4">
            <Input
              placeholder="Search for a location..."
              className="h-14 text-base rounded-2xl"
            />
            <Button size="lg" className="w-full h-14 text-lg font-bold rounded-2xl">
              Find Parking
            </Button>
          </div>

          {/* Recent Searches */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Searches</h2>
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-12 justify-start text-base font-medium rounded-xl border-gray-200"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="text-xl font-bold mb-4">Popular Destinations</h2>
            <div className="grid grid-cols-2 gap-4">
              {popularDestinations.map((dest) => (
                <Card key={dest.name} className="rounded-2xl">
                  <CardContent className="p-4">
                    <p className="font-bold text-base">{dest.name}</p>
                    <p className="text-sm text-green-600">{dest.spots} spots</p>
                    <p className="text-sm text-muted-foreground">{dest.walk} min walk</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
