import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakData } from '../types';

interface StreakDisplayProps {
  streakData: StreakData;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streakData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <Ionicons name="flame" size={32} color="#FF6B35" />
        <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>
      <View style={styles.bestBox}>
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <Text style={styles.bestNumber}>{streakData.bestStreak}</Text>
        <Text style={styles.bestLabel}>Best</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakBox: {
    alignItems: 'center',
    flex: 1,
  },
  bestBox: {
    alignItems: 'center',
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bestNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 4,
  },
  bestLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
