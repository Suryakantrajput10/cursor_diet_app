import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onAdd: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ current, goal, onAdd }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="water" size={24} color="#2196F3" />
        <Text style={styles.title}>Water Intake</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {current} / {goal} glasses
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Ionicons name="add-circle" size={32} color="#2196F3" />
        <Text style={styles.addButtonText}>+1 Glass</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
});
