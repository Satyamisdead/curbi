
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ParkingSpot } from '@/types';
import { Header } from '@/components/Header';
import { SpotListItem } from '@/components/SpotListItem';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Car, CheckCircle, ParkingCircle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MOCK_SPOTS: ParkingSpot[] = [
  { id: 'spot1', name: 'Central Parkade', address: '123 Main St, Downtown', price: 3.50, distance: 0.5, rating: 4.5, isFavorite: false, availableSince: '1m ago', position: { lat: 37.7749, lng: -122.4194 } },
  { id: 'spot2', name: 'Uptown Garage', address: '456 Oak Ave, Uptown', price: 2.75, distance: 1.2, rating: 4.2, isFavorite: true, availableSince: '1m ago', position: { lat: 37.779, lng: -122.423 } },
  { id: 'spot3', name: 'River Lot', address: '789 River Rd, Riverside', price: 1.50, distance: 2.5, rating: 3.8, isFavorite: false, availableSince: '6m ago', position: { lat: 37.770, lng: -122.410 } },
  { id: 'spot4', name: 'Mall Parking East', address: '101 Shopping Ctr, Eastwood', price: 5.00, distance: 4.1, rating: 4.8, isFavorite: false, availableSince: '12m ago', position: { lat: 37.785, lng: -122.405 } },
];

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '400px',
  borderRadius: '24px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

const DEFAULT_CENTER = {
  lat: 37.7749,
  lng: -122.4194
};

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
};


export function CurbiClient() {
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [isParking, setIsParking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [parkedLocation, setParkedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAekdj055Smrs5UAZtfn8cbhuCKpa-H-wg",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newUserLocation);
      },
      (error) => {
        console.warn("Could not get user location: ", error.message);
      }
    );
  }, []);

  const handleToggleParkingState = useCallback(() => {
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
      const locationRequestHandler = (position: GeolocationPosition) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setIsParking(true);
        setParkedLocation(newLocation);
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

      const errorRequestHandler = (error: GeolocationPositionError) => {
         console.warn("Could not get user location: ", error.message);
         // Simulate parking with default location if permission is denied
         setIsParking(true);
         setParkedLocation(DEFAULT_CENTER);
         toast({
          title: (
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">You've Parked (Demo)</span>
            </div>
          ),
          description: `Enjoy your time! We'll remember where you parked.`,
        });
      }
      
      navigator.geolocation.getCurrentPosition(locationRequestHandler, errorRequestHandler);
    }
  }, [isParking, toast]);

  const mapCenter = userLocation || DEFAULT_CENTER;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6 space-y-6">

          <div className="h-[400px] w-full">
            {loadError && <div>Map cannot be loaded right now, sorry.</div>}
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={mapCenter}
                zoom={14}
                options={MAP_OPTIONS}
              >
                {userLocation && <Marker position={userLocation} />}
                {parkedLocation && <Marker position={parkedLocation} icon={{ url: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>', scaledSize: new window.google.maps.Size(48, 48) }} />}
              </GoogleMap>
            ) : (
              <div className="h-full w-full bg-muted rounded-2xl flex items-center justify-center">
                <p>Loading Map...</p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className={`w-full h-24 rounded-2xl text-left flex items-center gap-4 shadow-lg transition-all duration-300 ${isParking ? 'bg-blue-600 hover:bg-blue-600/90 text-primary-foreground' : 'bg-yellow-400 hover:bg-yellow-400/90 text-yellow-900'}`}
            onClick={handleToggleParkingState}
          >
            {isParking ? <Car className="h-8 w-8" /> : <ParkingCircle className="h-8 w-8" />}
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
