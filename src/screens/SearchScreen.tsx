import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const recentSearches = [
  'Downtown San Francisco',
  'Union Square',
  'Financial District',
  'Mission District',
];

const popularDestinations = [
  { name: 'Union Square', spots: 12, walk: 3 },
  { name: 'Pier 39', spots: 8, walk: 5 },
  { name: 'Oracle Park', spots: 15, walk: 10 },
  { name: 'Golden Gate Bridge', spots: 5, walk: 20 },
];

export default function SearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Search Parking" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for a location..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Find Parking</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.recentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.recentText, { color: colors.text }]}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Destinations</Text>
          <View style={styles.destinationsGrid}>
            {popularDestinations.map((dest, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.destinationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.destinationName, { color: colors.text }]}>{dest.name}</Text>
                <Text style={[styles.destinationSpots, { color: colors.primary }]}>
                  {dest.spots} spots
                </Text>
                <Text style={[styles.destinationWalk, { color: colors.textSecondary }]}>
                  {dest.walk} min walk
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingHorizontal: 20,
  },
  searchSection: {
    marginBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  recentText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: (width - 52) / 2,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  destinationSpots: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  destinationWalk: {
    fontSize: 14,
  },
});