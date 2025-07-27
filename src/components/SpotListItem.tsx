
import type { ParkingSpot } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, Car } from "lucide-react";

interface SpotListItemProps {
  spot: ParkingSpot;
}

export function SpotListItem({ spot }: SpotListItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow rounded-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
            <Car className="h-6 w-6 text-primary"/>
        </div>
        <div className="flex-1">
            <p className="font-bold text-base">{spot.name}</p>
            <p className="text-sm text-muted-foreground">{spot.distance.toFixed(1)} km away &bull; {spot.availableSince}</p>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <Navigation className="h-5 w-5"/>
        </Button>
      </CardContent>
    </Card>
  );
}
