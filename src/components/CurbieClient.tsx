"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import type { ParkingSpot } from '@/types';
import { Header } from '@/components/Header';
import { SpotListItem } from '@/components/SpotListItem';
import { BottomNav } from '@/components/BottomNav';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Car, CheckCircle, ParkingCircle, MapPin } from 'lucide-react';

const MOCK_SPOTS: ParkingSpot[] = [
  { id: 'spot1', name: 'Central Parkade', address: '123 Main St, Downtown', price: 3.50, distance: 0.5, rating: 4.5, isFavorite: false, availableSince: '1m ago', position: { lat: 37.7749, lng: -122.4194 } },
  { id: 'spot2', name: 'Uptown Garage', address: '456 Oak Ave, Uptown', price: 2.75, distance: 1.2, rating: 4.2, isFavorite: true, availableSince: '1m ago', position: { lat: 37.779, lng: -122.423 } },
  { id: 'spot3', name: 'River Lot', address: '789 River Rd, Riverside', price: 1.50, distance: 2.5, rating: 3.8, isFavorite: false, availableSince: '6m ago', position: { lat: 37.770, lng: -122.410 } },
  { id: 'spot4', name: 'Mall Parking East', address: '101 Shopping Ctr, Eastwood', price: 5.00, distance: 4.1, rating: 4.8, isFavorite: false, availableSince: '12m ago', position: { lat: 37.785, lng: -122.405 } },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        {
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            { "visibility": "off" }
          ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                { "visibility": "off" }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                { "visibility": "off" }
            ]
        },
    ]
};


export function CurbieClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isParking, setIsParking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { toast } = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'],
  });

  useEffect(() => {
    if (permissionGranted) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Handle error or denial after initial grant
          console.log("Location access denied.");
        }
      );
    }
  }, [permissionGranted]);

  useEffect(() => {
    if (!showToast) return;

    if (isParking) {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Spot Reported</span>
                </div>
            ),
            description: "Thanks for sharing your parking spot with the community!",
        });
    } else {
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">You've Parked</span>
                </div>
            ),
            description: "Enjoy your time! We'll remember where you parked.",
        });
    }
    setShowToast(false);
  }, [isParking, showToast, toast]);


  const handleToggleParkingState = () => {
    setIsParking(prevState => !prevState);
    setShowToast(true);
  };

  const handleSpotClick = (spotId: string) => {
    setSelectedSpotId(currentId => currentId === spotId ? null : spotId);
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence>
          {!permissionGranted && (
            <LocationPermissionModal onPermissionGranted={() => setPermissionGranted(true)} />
          )}
        </AnimatePresence>
        <div className="container mx-auto px-4 py-6 space-y-6">
            
            <Card className="overflow-hidden rounded-3xl shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Interactive Map View</h2>
                    <p className="text-muted-foreground">Real-time parking spots with GPS navigation</p>
                    <div className="relative mt-4 h-64 rounded-xl bg-slate-200/50">
                        {isLoaded && userLocation ? (
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={userLocation}
                                zoom={15}
                                options={mapOptions}
                            >
                                <Marker position={userLocation} />
                                {spots.map(spot => (
                                    <Marker 
                                        key={spot.id} 
                                        position={spot.position}
                                        onClick={() => handleSpotClick(spot.id)}
                                        icon={{
                                            path: 'M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
                                            fillColor: selectedSpotId === spot.id ? '#1AC9C9' : '#28D828',
                                            fillOpacity: 1,
                                            strokeWeight: 0,
                                            scale: 1,
                                        }}
                                    />
                                ))}
                            </GoogleMap>
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <MapPin className="h-16 w-16 text-slate-400/50" />
                            </div>
                        )}
                         {!userLocation && isLoaded && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg">
                                 <p className="font-semibold text-sm">Waiting for location permission...</p>
                            </div>
                        )}
                        {loadError && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-destructive/80 p-2 rounded-lg">
                                 <p className="font-semibold text-sm text-destructive-foreground">Error loading maps.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

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
