import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';

import { Header } from '../components/Header';
import { ParkingButton } from '../components/ParkingButton';
import { ParkingSpotCard } from '../components/ParkingSpotCard';
import { useTheme } from '../context/ThemeContext';
import { ParkingSpot, SocrataSpot } from '../types';

const { width, height } = Dimensions.get('window');

const MOCK_SPOTS: ParkingSpot[] = [
  {
    id: 'spot1',
    name: 'Central Parkade',
    address: '123 Main St, Downtown',
    price: 3.50,
    distance: 0.5,
    rating: 4.5,
    isFavorite: false,
    availableSince: '1m ago',
    position: { lat: 40.7580, lng: -73.9855 }
  },
  {
    id: 'spot2',
    name: 'Uptown Garage',
    address: '456 Oak Ave, Uptown',
    price: 2.75,
    distance: 1.2,
    rating: 4.2,
    isFavorite: true,
    availableSince: '1m ago',
    position: { lat: 40.760, lng: -73.986 }
  },
  {
    id: 'spot3',
    name: 'River Lot',
    address: '789 River Rd, Riverside',
    price: 1.50,
    distance: 2.5,
    rating: 3.8,
    isFavorite: false,
    availableSince: '6m ago',
    position: { lat: 40.755, lng: -73.990 }
  },
];

const DEFAULT_REGION = {
  latitude: 40.7128,
  longitude: -74.0060,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const [spots] = useState<ParkingSpot[]>(MOCK_SPOTS);
  const [socrataSpots, setSocrataSpots] = useState<SocrataSpot[]>([]);
  const [isParking, setIsParking] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [parkedLocation, setParkedLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    requestLocationPermission();
    fetchParkingData();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby parking spots.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchParkingData = async () => {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/nfid-uabd.json');
      const data = await response.json();
      setSocrataSpots(data);
    } catch (error) {
      console.error('Failed to fetch parking data:', error);
    }
  };

  const handleToggleParkingState = async () => {
    if (isParking) {
      // Logic for leaving
      setIsParking(false);
      setParkedLocation(null);
      Toast.show({
        type: 'success',
        text1: 'Spot Reported',
        text2: 'Thanks for sharing your parking spot with the community!',
      });
    } else {
      // Logic for parking
      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        setIsParking(true);
        setParkedLocation(location);
        Toast.show({
          type: 'success',
          text1: "You've Parked",
          text2: "Enjoy your time! We'll remember where you parked.",
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: 'Could not get your current location.',
        });
      }
    }
  };

  const mapRegion = userLocation
    ? {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : DEFAULT_REGION;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Curbi" subtitle="Find & share parking spots" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* User's parked car marker */}
            {parkedLocation && (
              <Marker
                coordinate={{
                  latitude: parkedLocation.coords.latitude,
                  longitude: parkedLocation.coords.longitude,
                }}
                title="Your Car"
                description="You parked here"
                pinColor="red"
              />
            )}

            {/* Parking spots from Socrata data */}
            {socrataSpots.map((spot) => {
              if (!spot.the_geom) return null;
              return (
                <Marker
                  key={spot.objectid}
                  coordinate={{
                    latitude: spot.the_geom.coordinates[1],
                    longitude: spot.the_geom.coordinates[0],
                  }}
                  title={spot.sign}
                  description={`${spot.main_st} - ${spot.side_of_st}`}
                  pinColor="blue"
                />
              );
            })}

            {/* Mock parking spots */}
            {spots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={{
                  latitude: spot.position.lat,
                  longitude: spot.position.lng,
                }}
                title={spot.name}
                description={`$${spot.price}/hr - ${spot.distance}km away`}
                pinColor="green"
              />
            ))}
          </MapView>
        </View>

        <ParkingButton isParking={isParking} onPress={handleToggleParkingState} />

        <View style={styles.spotsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Spots ({spots.length})
          </Text>
          {spots.map((spot) => (
            <ParkingSpotCard key={spot.id} spot={spot} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  map: {
    flex: 1,
  },
  spotsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 24,
  },
});