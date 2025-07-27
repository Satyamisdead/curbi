
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import type { ParkingSpot } from '@/types';
import { suggestAlternativeParking, SuggestAlternativeParkingOutput } from '@/ai/flows/suggest-alternative-parking';

import { Header } from '@/components/Header';
import { SpotCard } from '@/components/SpotCard';
import { DirectionsDialog } from '@/components/DirectionsDialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Car, DollarSign, Filter, Heart, Lightbulb, Loader2, MapPin, Navigation, Star } from 'lucide-react';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

const MOCK_SPOTS: ParkingSpot[] = [
  { id: 'spot1', name: 'Central Parkade', address: '123 Main St, Downtown', price: 3.50, distance: 0.5, rating: 4.5, isFavorite: false, position: { top: '25%', left: '40%' } },
  { id: 'spot2', name: 'Uptown Garage', address: '456 Oak Ave, Uptown', price: 2.75, distance: 1.2, rating: 4.2, isFavorite: true, position: { top: '50%', left: '20%' } },
  { id: 'spot3', name: 'River Lot', address: '789 River Rd, Riverside', price: 1.50, distance: 2.5, rating: 3.8, isFavorite: false, position: { top: '70%', left: '65%' } },
  { id: 'spot4', name: 'Mall Parking East', address: '101 Shopping Ctr, Eastwood', price: 5.00, distance: 4.1, rating: 4.8, isFavorite: false, position: { top: '15%', left: '80%' } },
];

const suggestionFormSchema = z.object({
  currentLocation: z.string().min(1, 'Current location is required.'),
  preferences: z.string().min(1, 'Preferences are required.'),
  realTimeAvailability: z.string().min(1, 'Availability info is required.'),
});

export function ParkViewClient() {
  const [spots, setSpots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [distanceFilter, setDistanceFilter] = useState([5]);
  const [priceFilter, setPriceFilter] = useState('all');

  const [isDirectionsOpen, setDirectionsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestAlternativeParkingOutput | null>(null);
  const [isSuggesting, setSuggesting] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof suggestionFormSchema>>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      currentLocation: 'Downtown Core',
      preferences: 'Cheapest available spot within a 10-minute walk',
      realTimeAvailability: 'Central Parkade is full, Uptown Garage has 5 spots left',
    },
  });

  const handleToggleFavorite = (spotId: string) => {
    setSpots(prevSpots =>
      prevSpots.map(spot =>
        spot.id === spotId ? { ...spot, isFavorite: !spot.isFavorite } : spot
      )
    );
  };

  const filteredSpots = useMemo(() => {
    return spots
      .filter(spot => spot.distance <= distanceFilter[0])
      .filter(spot => {
        if (priceFilter === 'all') return true;
        const maxPrice = parseFloat(priceFilter);
        return spot.price <= maxPrice;
      });
  }, [spots, distanceFilter, priceFilter]);

  const favoriteSpots = useMemo(() => spots.filter(spot => spot.isFavorite), [spots]);

  async function onSuggest(values: z.infer<typeof suggestionFormSchema>) {
    setSuggesting(true);
    setSuggestions(null);
    try {
      const result = await suggestAlternativeParking(values);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get suggestions. Please try again.',
      });
    } finally {
      setSuggesting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container flex-1 mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel */}
          <Card className="lg:col-span-1 h-full flex flex-col">
            <Tabs defaultValue="filter" className="flex-1 flex flex-col">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="filter"><Filter className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Filter</span></TabsTrigger>
                  <TabsTrigger value="suggestions"><Lightbulb className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Suggest</span></TabsTrigger>
                  <TabsTrigger value="favorites"><Heart className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Favorites</span></TabsTrigger>
                </TabsList>
              </CardHeader>
              <ScrollArea className="flex-1">
                <TabsContent value="filter" className="p-4 pt-0">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="distance" className="text-base font-semibold">Max Distance ({distanceFilter[0]} km)</Label>
                      <Slider id="distance" min={0} max={5} step={0.5} value={distanceFilter} onValueChange={setDistanceFilter} className="mt-2"/>
                    </div>
                    <div>
                      <Label className="text-base font-semibold">Max Price</Label>
                      <RadioGroup value={priceFilter} onValueChange={setPriceFilter} className="mt-2 grid grid-cols-2 gap-2">
                        {['2', '4', 'all'].map(val => (
                          <div key={val} className="flex items-center space-x-2">
                            <RadioGroupItem value={val} id={`price-${val}`} />
                            <Label htmlFor={`price-${val}`}>{val === 'all' ? 'Any Price' : `< $${val}.00/hr`}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="suggestions" className="p-4 pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSuggest)} className="space-y-4">
                      <FormField control={form.control} name="currentLocation" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Location</FormLabel>
                            <FormControl><Input placeholder="e.g., Downtown Core" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="preferences" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parking Preferences</FormLabel>
                            <FormControl><Input placeholder="e.g., Cheapest, covered" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="realTimeAvailability" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Real-time Availability</FormLabel>
                            <FormControl><Input placeholder="e.g., Central Parkade is full" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSuggesting} className="w-full bg-accent hover:bg-accent/90">
                        {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Smart Suggestions
                      </Button>
                    </form>
                  </Form>
                  {suggestions && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>AI Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="font-semibold">Suggested Locations:</p>
                        <p className="text-muted-foreground">{suggestions.alternativeLocations}</p>
                        <Separator className="my-2" />
                        <p className="font-semibold">Reasoning:</p>
                        <p className="text-muted-foreground">{suggestions.reasoning}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="favorites" className="p-4 pt-0">
                  {favoriteSpots.length > 0 ? (
                    <div className="space-y-4">
                      {favoriteSpots.map(spot => (
                        <SpotCard key={spot.id} spot={spot} onSelect={setSelectedSpot} onToggleFavorite={handleToggleFavorite} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Heart className="mx-auto h-12 w-12" />
                      <p className="mt-4">No favorite spots yet.</p>
                      <p>Click the heart icon on a spot to save it.</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </Card>
          
          {/* Right Panel - Map */}
          <Card className="lg:col-span-2 relative min-h-[400px] lg:min-h-[600px] overflow-hidden">
            <Image src="https://placehold.co/1200x800.png" alt="City map" fill className="object-cover opacity-50" data-ai-hint="city map" />
            <AnimatePresence>
              {filteredSpots.map(spot => (
                <motion.div
                  key={spot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ top: spot.position.top, left: spot.position.left }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Button
                    onClick={() => setSelectedSpot(spot)}
                    className={`rounded-full h-12 w-12 shadow-lg transition-transform hover:scale-110 ${selectedSpot?.id === spot.id ? 'bg-accent' : 'bg-primary'}`}
                  >
                    <Car className="h-6 w-6 text-primary-foreground" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredSpots.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
                <div className="text-center p-6 bg-card rounded-lg shadow-xl">
                  <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold text-lg text-card-foreground">No Spots Found</p>
                  <p className="text-muted-foreground">Try adjusting your filters or viewing AI suggestions.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Spot Details Sheet */}
      <Sheet open={!!selectedSpot} onOpenChange={(isOpen) => !isOpen && setSelectedSpot(null)}>
        <SheetContent className="w-full sm:max-w-md bg-card">
          {selectedSpot && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl font-headline">{selectedSpot.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 pt-2">
                  <MapPin className="h-4 w-4" /> {selectedSpot.address}
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded-lg bg-secondary">
                        <DollarSign className="h-6 w-6 mx-auto text-accent" />
                        <p className="font-bold text-lg">${selectedSpot.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">per hour</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                        <Navigation className="h-6 w-6 mx-auto text-accent" />
                        <p className="font-bold text-lg">{selectedSpot.distance.toFixed(1)} km</p>
                        <p className="text-xs text-muted-foreground">away</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                        <Star className="h-6 w-6 mx-auto text-accent" />
                        <p className="font-bold text-lg">{selectedSpot.rating.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">rating</p>
                    </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button className="w-full bg-accent hover:bg-accent/90">Book Now</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to book a spot at {selectedSpot.name} for ${selectedSpot.price.toFixed(2)}/hr.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                              setSelectedSpot(null);
                              toast({ title: "Booking Confirmed!", description: `Your spot at ${selectedSpot.name} is reserved.` });
                          }}>
                              Confirm
                          </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" className="w-full" onClick={() => setDirectionsOpen(true)}>Get Directions</Button>
                  <Button variant={selectedSpot.isFavorite ? "secondary" : "outline"} size="icon" onClick={() => handleToggleFavorite(selectedSpot.id)}>
                      <Heart className={`h-5 w-5 ${selectedSpot.isFavorite ? 'text-destructive fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Directions Dialog */}
      {selectedSpot && (
        <DirectionsDialog
          open={isDirectionsOpen}
          onOpenChange={setDirectionsOpen}
          spotName={selectedSpot.name}
        />
      )}
    </div>
  );
}
