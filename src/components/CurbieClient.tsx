
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import type { ParkingSpot } from '@/types';
import { Header } from '@/components/Header';
import { SpotListItem } from '@/components/SpotListItem';
import { BottomNav } from '@/components/BottomNav';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Car, CheckCircle, ParkingCircle } from 'lucide-react';

const MOCK_SPOTS: ParkingSpot[] = [
  { id: 'spot1', name: 'Central Parkade', address: '123 Main St, Downtown', price: 3.50, distance: 0.5, rating: 4.5, isFavorite: false, availableSince: '1m ago', position: { lat: 37.7749, lng: -122.4194 } },
  { id: 'spot2', name: 'Uptown Garage', address: '456 Oak Ave, Uptown', price: 2.75, distance: 1.2, rating: 4.2, isFavorite: true, availableSince: '1m ago', position: { lat: 37.779, lng: -122.423 } },
  { id: 'spot3', name: 'River Lot', address: '789 River Rd, Riverside', price: 1.50, distance: 2.5, rating: 3.8, isFavorite: false, availableSince: '6m ago', position: { lat: 37.770, lng: -122.410 } },
  { id: 'spot4', name: 'Mall Parking East', address: '101 Shopping Ctr, Eastwood', price: 5.00, distance: 4.1, rating: 4.8, isFavorite: false, availableSince: '12m ago', position: { lat: 37.785, lng: -122.405 } },
];

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco

export function CurbieClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isParking, setIsParking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'prompt' | 'dismissed'>('prompt');
  const { toast } = useToast();
  
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const requestLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const newUserLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setUserLocation(newUserLocation);
            setPermissionStatus('granted');
            setShowPermissionModal(false);
            localStorage.setItem('curbie_location_permission', 'granted');
        },
        () => {
            setPermissionStatus('denied');
            setShowPermissionModal(true);
            localStorage.setItem('curbie_location_permission', 'denied');
        }
    );
  }, []);

  const checkPermission = useCallback(async () => {
    const storedPermission = localStorage.getItem('curbie_location_permission');
    if (storedPermission === 'granted') {
        setPermissionStatus('granted');
        requestLocation();
        return;
    }
    if(storedPermission === 'dismissed' || storedPermission === 'denied'){
        setPermissionStatus(storedPermission);
        setShowPermissionModal(true);
        return;
    }

    if (!navigator.permissions) {
        setShowPermissionModal(true);
        return;
    }

    try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(status.state);
        if (status.state === 'granted') {
            requestLocation();
        } else {
             setShowPermissionModal(true);
        }

        status.onchange = () => {
            setPermissionStatus(status.state);
            if (status.state === 'granted') {
                requestLocation();
            }
        };

    } catch (e) {
        console.error("Error checking permissions", e);
        setShowPermissionModal(true);
    }
  }, [requestLocation]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const handleAllowPermission = () => {
    requestLocation();
  };

  const handleDismissPermission = () => {
    setShowPermissionModal(false);
    setPermissionStatus('dismissed');
    localStorage.setItem('curbie_location_permission', 'dismissed');
  };

  useEffect(() => {
    if (!selectedSpot || isParking === null) return;

    if (isParking) {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">You've Parked</span>
                </div>
            ),
            description: `Enjoy your time! We'll remember where you parked at ${selectedSpot.name}.`,
        });
    } else {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Spot Reported</span>
                </div>
            ),
            description: "Thanks for sharing your parking spot with the community!",
        });
    }
  }, [isParking, toast, selectedSpot]);


  const handleToggleParkingState = () => {
    setIsParking(prevState => !prevState);
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(currentSpot => currentSpot?.id === spot.id ? null : spot);
  }
  
  const getMapSrc = () => {
    const base = "https://www.google.com/maps/embed/v1/view";
    const location = userLocation || DEFAULT_CENTER;
    const zoom = userLocation ? 17 : 12;
    let markers = `&markers=color:blue%7Clabel:U%7C${location.lat},${location.lng}`;
    
    if (isParking && userLocation) {
        markers += `&markers=icon:https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png%7C${userLocation.lat},${userLocation.lng}`;
    }

    spots.forEach(spot => {
        const color = selectedSpot?.id === spot.id ? 'green' : 'red';
        markers += `&markers=color:${color}%7C${spot.position.lat},${spot.position.lng}`;
    });

    return `${base}?key=${API_KEY}&center=${location.lat},${location.lng}&zoom=${zoom}${markers}`;
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence>
          {showPermissionModal && (
            <LocationPermissionModal 
                onAllow={handleAllowPermission} 
                onLater={handleDismissPermission}
                status={permissionStatus}
            />
          )}
        </AnimatePresence>
        <div className="container mx-auto px-4 py-6 space-y-6">
            
            <Card className="overflow-hidden rounded-3xl shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Interactive Map View</h2>
                    <p className="text-muted-foreground">Real-time parking spots with GPS navigation</p>
                    <div className="relative mt-4 h-96 rounded-xl bg-slate-200/50">
                        {API_KEY ? (
                           <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '0.75rem' }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={getMapSrc()}
                            >
                            </iframe>
                        ) : (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-destructive/80 p-2 rounded-lg">
                                <p className="font-semibold text-sm text-destructive-foreground">Error loading maps. Please check API key.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Button 
                size="lg" 
                className={`w-full h-24 rounded-2xl text-left flex items-center gap-4 shadow-lg transition-all duration-300 ${isParking ? 'bg-blue-600 hover:bg-blue-600/90 text-primary-foreground' : 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900'}`}
                onClick={handleToggleParkingState}
                disabled={!userLocation}
            >
                {isParking ? <Car className="h-8 w-8"/> : <ParkingCircle className="h-8 w-8" />}
                <div>
                    <p className="font-bold text-xl">{isParking ? "I'm Leaving" : "I am Parking"}</p>
                    <p className="font-normal opacity-90">{isParking ? "Tap to report your parking spot as available" : "Tap to remember where you parked"}</p>
                </div>
            </Button>
            
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
