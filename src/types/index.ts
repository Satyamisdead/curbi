
export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number; // hourly rate
  distance: number; // in km
  rating: number; // out of 5
  isFavorite: boolean;
  availableSince: string;
  position: {
    lat: number;
    lng: number;
  };
}

export interface SocrataSpot {
  objectid: string;
  the_geom: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  sign: string;
  main_st: string;
  from_st: string;
  to_st: string;
  side_of_st: string;
}

    