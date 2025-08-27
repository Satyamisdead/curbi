import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ParkingSpot } from '../types';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onPress?: () => void;
}

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="car" size={24} color={colors.primary} />
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{spot.name}</Text>
          <Text style={[styles.details, { color: colors.textSecondary }]}>
            {spot.distance.toFixed(1)} km away • {spot.availableSince}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${spot.price.toFixed(2)}/hr
          </Text>
        </View>

        <TouchableOpacity style={styles.navigationButton}>
          <Ionicons name="navigate" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});