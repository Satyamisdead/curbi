
import type { ParkingSpot } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, DollarSign, Star, Navigation } from "lucide-react";

interface SpotCardProps {
  spot: ParkingSpot;
  onSelect: (spot: ParkingSpot) => void;
  onToggleFavorite: (spotId: string) => void;
}

export function SpotCard({ spot, onSelect, onToggleFavorite }: SpotCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow" >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline hover:text-primary transition-colors cursor-pointer" onClick={() => onSelect(spot)}>{spot.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(spot.id);
            }}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                spot.isFavorite ? "text-destructive fill-current" : "text-muted-foreground hover:text-destructive"
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{spot.address}</span>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>${spot.price.toFixed(2)} / hr</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{spot.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>{spot.distance.toFixed(1)} km</span>
            </div>
        </div>
        <Button variant="outline" className="mt-2 w-full" onClick={() => onSelect(spot)}>
            View on Map & Book
        </Button>
      </CardContent>
    </Card>
  );
}
