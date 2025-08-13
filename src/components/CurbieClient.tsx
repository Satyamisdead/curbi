
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import type { ParkingSpot } from '@/types';
import { Header } from '@/components/Header';
import { SpotListItem } from '@/components/SpotListItem';
import { BottomNav } from '@/components/BottomNav';
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

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: []
};

export function CurbieClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isParking, setIsParking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [parkedLocation, setParkedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBAplFS33D_DNgDLhMfc95mwdWp_NUjBGA",
  });

  const requestLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newUserLocation);
      },
      () => {
        toast({
          variant: "destructive",
          title: "Location Permission Denied",
          description: "Please enable location access in your browser settings to use this feature.",
        });
      }
    );
  }, [toast]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleToggleParkingState = () => {
    if (isParking) {
      // Logic for leaving
      setIsParking(false);
      setParkedLocation(null);
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
      // Logic for parking
      const park = (location: { lat: number; lng: number }) => {
        setIsParking(true);
        setParkedLocation(location);
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">You've Parked</span>
                </div>
            ),
            description: `Enjoy your time! We'll remember where you parked.`,
        });
      }

      if (userLocation) {
        park(userLocation);
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newUserLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(newUserLocation);
            park(newUserLocation);
          },
          () => {
            toast({
              variant: "destructive",
              title: "Could not get location",
              description: "Please grant location permission and try again.",
            });
          }
        );
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6 space-y-6">
            
            <Card className="overflow-hidden rounded-3xl shadow-lg">
                <CardContent className="p-0">
                    <div className="relative h-96">
                        {loadError && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-destructive/80 p-2 rounded-lg">
                                <p className="font-semibold text-sm text-destructive-foreground">Error loading maps.</p>
                            </div>
                        )}
                        {isLoaded ? (
                           <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={userLocation || DEFAULT_CENTER}
                            zoom={userLocation ? 17 : 12}
                            options={mapOptions}
                           >
                            {isParking && parkedLocation && (
                              <Marker 
                                position={parkedLocation} 
                                icon={{
                                  url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%233B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L2 17h15m-4 0v2m-1-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"/></svg>',
                                  scaledSize: new window.google.maps.Size(48, 48)
                                }}
                              />
                            )}
                           </GoogleMap>
                        ) : (
                            <div className="w-full h-full flex justify-center items-center bg-muted">
                              <p>Loading map...</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Button 
                size="lg" 
                className={`w-full h-24 rounded-2xl text-left flex items-center gap-4 shadow-lg transition-all duration-300 ${isParking ? 'bg-blue-600 hover:bg-blue-600/90 text-primary-foreground' : 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900'}`}
                onClick={handleToggleParkingState}
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
