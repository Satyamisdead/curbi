import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { User } from '../types';

const user: User = {
  name: 'Curbi User',
  rank: 8,
  points: 245,
  spotsReported: 12,
  validations: 31,
  avatar: 'https://placehold.co/100x100.png',
};

const badges = [
  {
    id: '1',
    title: 'First Spot',
    description: 'Reported your first parking spot',
    icon: 'star',
    color: '#FFD700',
  },
  {
    id: '2',
    title: 'Helpful Validator',
    description: 'Validated 25+ parking spots',
    icon: 'checkmark-circle',
    color: '#4CAF50',
  },
  {
    id: '3',
    title: 'Community Hero',
    description: 'Top contributor this month',
    icon: 'trophy',
    color: '#2196F3',
  },
];

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  const BadgeCard = ({ badge }: { badge: typeof badges[0] }) => (
    <View style={[styles.badgeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.badgeIconContainer, { backgroundColor: badge.color + '20' }]}>
        <Ionicons name={badge.icon as any} size={24} color={badge.color} />
      </View>
      <View style={styles.badgeInfo}>
        <Text style={[styles.badgeTitle, { color: colors.text }]}>{badge.title}</Text>
        <Text style={[styles.badgeDescription, { color: colors.textSecondary }]}>
          {badge.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              defaultSource={require('../../assets/icon.png')}
            />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userRank, { color: colors.textSecondary }]}>
            Rank #{user.rank}
          </Text>

          <View style={styles.statsContainer}>
            <StatCard label="Points" value={user.points} color={colors.primary} />
            <StatCard label="Spots Reported" value={user.spotsReported} color={colors.accent} />
            <StatCard label="Validations" value={user.validations} color={colors.secondary} />
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges Earned</Text>
          <View style={[styles.badgesContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          <View style={[styles.settingsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons 
                  name={isDark ? "moon" : "sunny"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
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
    paddingBottom: 100,
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1F51FF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRank: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  badgesContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
  },
  settingsContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});