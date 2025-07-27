"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import type { ParkingSpot } from '@/types';
import { Header } from '@/components/Header';
import { SpotListItem } from '@/components/SpotListItem';
import { BottomNav } from '@/components/BottomNav';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Car, MapPin, CheckCircle, ParkingCircle } from 'lucide-react';

const MOCK_SPOTS: ParkingSpot[] = [
  { id: 'spot1', name: 'Central Parkade', address: '123 Main St, Downtown', price: 3.50, distance: 0.5, rating: 4.5, isFavorite: false, availableSince: '1m ago', position: { top: '55%', left: '30%' } },
  { id: 'spot2', name: 'Uptown Garage', address: '456 Oak Ave, Uptown', price: 2.75, distance: 1.2, rating: 4.2, isFavorite: true, availableSince: '1m ago', position: { top: '45%', left: '50%' } },
  { id: 'spot3', name: 'River Lot', address: '789 River Rd, Riverside', price: 1.50, distance: 2.5, rating: 3.8, isFavorite: false, availableSince: '6m ago', position: { top: '65%', left: '68%' } },
  { id: 'spot4', name: 'Mall Parking East', address: '101 Shopping Ctr, Eastwood', price: 5.00, distance: 4.1, rating: 4.8, isFavorite: false, availableSince: '12m ago', position: { top: '75%', left: '85%' } },
];

const MapLocation = ({ spot, isSelected, onClick, isAvailable }: { spot: ParkingSpot, isSelected: boolean, onClick: () => void, isAvailable: boolean }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute flex flex-col items-center gap-1 cursor-pointer"
      style={{ top: spot.position.top, left: spot.position.left, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
        <div className={`rounded-full p-2 shadow-lg transition-all ${isAvailable ? 'bg-accent' : 'bg-orange-400'} ${isSelected ? 'ring-4 ring-primary/50' : ''}`}>
            <Car className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
        {isSelected && (
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="bg-card text-xs px-2 py-1 rounded-md shadow whitespace-nowrap"
          >
              {spot.name}
          </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
);


export function CurbieClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(spots[2].id);
  const [isParking, setIsParking] = useState(false);
  const { toast } = useToast();

  const handleToggleParkingState = () => {
    setIsParking(prevState => {
        if (!prevState) {
             toast({
                title: (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">Spot Reported</span>
                    </div>
                ),
                description: "Thanks for sharing your parking spot with the community!",
            })
        } else {
             toast({
                title: (
                    <div className="flex items-center gap-2">
                        <ParkingCircle className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">You've Parked</span>
                    </div>
                ),
                description: "Enjoy your time! We'll remember where you parked.",
            })
        }
        return !prevState;
    });
  };

  const handleSpotClick = (spotId: string) => {
    setSelectedSpotId(currentId => currentId === spotId ? null : spotId);
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6 space-y-6">
            
            {/* Interactive Map */}
            <Card className="overflow-hidden rounded-3xl shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Interactive Map View</h2>
                    <p className="text-muted-foreground">Real-time parking spots with GPS navigation</p>
                    <div className="relative mt-4 h-64 rounded-xl bg-slate-200/50 flex items-center justify-center">
                        <MapPin className="h-16 w-16 text-slate-400/50" />
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                             <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                             <p className="font-semibold text-sm">You are here</p>
                        </div>

                        {spots.map((spot, index) => (
                           <MapLocation 
                            key={spot.id} 
                            spot={spot}
                            isSelected={selectedSpotId === spot.id}
                            onClick={() => handleSpotClick(spot.id)}
                            isAvailable={index !== 2}
                           />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* I'm Leaving / I am Parking Button */}
            <Button 
                size="lg" 
                className={`w-full h-24 rounded-2xl text-left flex items-center gap-4 shadow-lg transition-all duration-300 ${isParking ? 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                onClick={handleToggleParkingState}
            >
                {isParking ? <ParkingCircle className="h-8 w-8" /> : <Car className="h-8 w-8"/>}
                <div>
                    <p className="font-bold text-xl">{isParking ? "I am Parking" : "I'm Leaving"}</p>
                    <p className="font-normal opacity-90">{isParking ? "Tap to let us know when you've left your spot" : "Tap to report your parking spot as available"}</p>
                </div>
            </Button>
            
            {/* Available Spots List */}
            <div>
                <h2 className="text-xl font-bold mb-4">Available Spots ({spots.length})</h2>
                <div className="space-y-3">
                    {spots.map(spot => (
                        <SpotListItem key={spot.id} spot={spot} />
                    ))}
                </div>
            </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
