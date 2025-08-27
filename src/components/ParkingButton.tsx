import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ParkingButtonProps {
  isParking: boolean;
  onPress: () => void;
}

export const ParkingButton: React.FC<ParkingButtonProps> = ({ isParking, onPress }) => {
  const { colors } = useTheme();

  const buttonColor = isParking ? '#FF073A' : colors.accent;
  const textColor = isParking ? '#FFFFFF' : '#1A1A1A';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: buttonColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons 
          name={isParking ? "car" : "location"} 
          size={32} 
          color={textColor} 
        />
        <Text style={[styles.text, { color: textColor }]}>
          {isParking ? "LEAVING" : "PARKED"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});