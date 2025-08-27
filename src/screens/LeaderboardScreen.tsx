import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { Achievement, Challenge } from '../types';

const { width } = Dimensions.get('window');

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Spot',
    description: 'Report your first parking spot',
    points: 10,
    progress: 100,
    current: 1,
    total: 1,
    completed: true,
    icon: 'star',
  },
  {
    id: '2',
    title: 'Helpful Validator',
    description: 'Validate 25 parking spots',
    points: 50,
    progress: 62,
    current: 31,
    total: 50,
    completed: false,
    icon: 'checkmark-circle',
  },
  {
    id: '3',
    title: 'Community Leader',
    description: 'Get 100 upvotes on your reports',
    points: 100,
    progress: 45,
    current: 45,
    total: 100,
    completed: false,
    icon: 'trophy',
  },
];

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Weekly Reporter',
    description: 'Report 5 parking spots this week',
    points: 50,
    progress: 60,
    current: 3,
    total: 5,
    timeLeft: '4d left',
  },
  {
    id: '2',
    title: 'Validation Master',
    description: 'Validate 15 spots this week',
    points: 40,
    progress: 53.33,
    current: 8,
    total: 15,
    timeLeft: '4d left',
  },
];

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges'>('challenges');

  const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
    <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
      <View
        style={[
          styles.progressBar,
          { width: `${progress}%`, backgroundColor: color },
        ]}
      />
    </View>
  );

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={achievement.icon as any} size={24} color={colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{achievement.title}</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            {achievement.description}
          </Text>
        </View>
      </View>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.pointsText, { color: colors.primary }]}>
            {achievement.points} points
          </Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {achievement.current}/{achievement.total}
          </Text>
        </View>
        <ProgressBar progress={achievement.progress} color={colors.primary} />
      </View>
    </View>
  );

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{challenge.title}</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>
        <View style={[styles.timeLeftBadge, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.timeLeftText, { color: colors.accent }]}>
            {challenge.timeLeft}
          </Text>
        </View>
      </View>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.pointsText, { color: colors.primary }]}>
            {challenge.points} bonus points
          </Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {challenge.current}/{challenge.total}
          </Text>
        </View>
        <ProgressBar progress={challenge.progress} color={colors.accent} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Achievements" />
      
      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'achievements' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'achievements' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'challenges' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('challenges')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'challenges' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'achievements' && (
            <>
              {/* Progress Overview */}
              <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.overviewTitle, { color: colors.text }]}>Your Progress</Text>
                <View style={styles.overviewStats}>
                  <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.primary }]}>3</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.accent }]}>3</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={[styles.statNumber, { color: colors.secondary }]}>85</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points Earned</Text>
                  </View>
                </View>
              </View>

              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              {/* Challenge Header */}
              <View style={[styles.challengeHeader, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
                <View style={styles.challengeHeaderContent}>
                  <Ionicons name="flash" size={24} color={colors.primary} />
                  <View style={styles.challengeHeaderText}>
                    <Text style={[styles.challengeHeaderTitle, { color: colors.primary }]}>
                      Weekly Challenges
                    </Text>
                    <Text style={[styles.challengeHeaderSubtitle, { color: colors.primary }]}>
                      Complete challenges to earn bonus points and exclusive badges!
                    </Text>
                  </View>
                </View>
              </View>

              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </>
          )}
        </ScrollView>
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 100,
  },
  overviewCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  challengeHeader: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  challengeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  challengeHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeHeaderSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  timeLeftBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeLeftText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});