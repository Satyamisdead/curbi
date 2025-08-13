
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

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

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [],
};


export function CurbieClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isParking, setIsParking] = useState(false);
  const [parkedLocation, setParkedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const { toast } = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'],
  });
  
  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newUserLocation);
        setShowPermissionModal(false);
        localStorage.setItem('curbie_location_permission', 'granted');
      },
      () => {
        // Error callback: user denied permission or another error occurred.
        setShowPermissionModal(true);
        localStorage.setItem('curbie_location_permission', 'denied');
      }
    );
  }, []);

  useEffect(() => {
    // Check permission status on component mount
    const checkPermission = async () => {
        if (!navigator.permissions) {
            // Fallback for older browsers
            const storedPermission = localStorage.getItem('curbie_location_permission');
            if (storedPermission === 'granted') {
                getLocation();
            } else if (storedPermission !== 'dismissed') {
                setShowPermissionModal(true);
            }
            return;
        }

        try {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            if (status.state === 'granted') {
                getLocation();
            } else {
                 const storedPermission = localStorage.getItem('curbie_location_permission');
                 if (storedPermission !== 'dismissed') {
                    setShowPermissionModal(true);
                 }
            }
        } catch (e) {
            console.error("Error checking permissions", e);
            setShowPermissionModal(true);
        }
    };
  
    checkPermission();
  }, [getLocation]);

  const handleAllowPermission = () => {
    // Directly request location, which triggers browser prompt if needed
    getLocation();
  };

  const handleDismissPermission = () => {
    setShowPermissionModal(false);
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
    setIsParking(prevState => {
        const isNowParking = !prevState;
        if(isNowParking && userLocation) {
            setParkedLocation(userLocation);
        } else {
            setParkedLocation(null);
            setSelectedSpot(null); // Deselect spot when leaving
        }
        return isNowParking;
    });
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(currentSpot => currentSpot?.id === spot.id ? null : spot);
  }
  
  const renderMapContent = () => {
    if (loadError) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-destructive/80 p-2 rounded-lg">
                <p className="font-semibold text-sm text-destructive-foreground">Error loading maps. Please check API key.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading map...</p>
            </div>
        );
    }
    
    if (!userLocation) {
         return (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-background/80 p-4 rounded-lg text-center">
                <p className="font-semibold text-sm">Waiting for location permission...</p>
                <p className="text-xs text-muted-foreground">Please grant location access to use the map.</p>
            </div>
         );
    }

    if (userLocation) {
        return (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={15}
                options={mapOptions}
            >
                <Marker position={userLocation} />
                {parkedLocation && (
                    <Marker 
                        position={parkedLocation}
                        icon={{
                            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%233B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M14 16H9m10 0h1.5a2.5 2.5 0 0 0 0-5H19l-1.1-3.3a2.4 2.4 0 0 0-2.3-1.7H8.4a2.4 2.4 0 0 0-2.3 1.7L5 11H3.5a2.5 2.5 0 0 0 0 5H5m0 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M8 11h8m-8-3.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v0a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/></svg>`,
                            scaledSize: new window.google.maps.Size(48, 48),
                        }}
                    />
                )}
                {spots.map(spot => (
                    <Marker 
                        key={spot.id} 
                        position={spot.position}
                        onClick={() => handleSpotClick(spot)}
                        icon={{
                            path: 'M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
                            fillColor: selectedSpot?.id === spot.id ? '#1AC9C9' : '#28D828',
                            fillOpacity: 1,
                            strokeWeight: 0,
                            scale: 1,
                        }}
                    />
                ))}
            </GoogleMap>
        );
    }

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-background/80 p-2 rounded-lg">
            <p className="font-semibold text-sm">Initializing Map...</p>
       </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence>
          {showPermissionModal && (
            <LocationPermissionModal onAllow={handleAllowPermission} onLater={handleDismissPermission} />
          )}
        </AnimatePresence>
        <div className="container mx-auto px-4 py-6 space-y-6">
            
            <Card className="overflow-hidden rounded-3xl shadow-lg">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Interactive Map View</h2>
                    <p className="text-muted-foreground">Real-time parking spots with GPS navigation</p>
                    <div className="relative mt-4 h-64 rounded-xl bg-slate-200/50">
                        {renderMapContent()}
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
