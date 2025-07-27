export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number; // hourly rate
  distance: number; // in km
  rating: number; // out of 5
  isFavorite: boolean;
  position: {
    top: string;
    left: string;
  };
}
