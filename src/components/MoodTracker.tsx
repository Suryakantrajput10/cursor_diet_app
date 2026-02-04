import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MoodTrackerProps {
  mood?: {
    energy: 'low' | 'medium' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    stressLevel: 'low' | 'medium' | 'high';
  };
  onSave: (mood: {
    energy: 'low' | 'medium' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    stressLevel: 'low' | 'medium' | 'high';
  }) => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ mood, onSave }) => {
  const [showModal, setShowModal] = useState(false);
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>(mood?.energy || 'medium');
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>(mood?.sleepQuality || 'good');
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>(mood?.stressLevel || 'medium');

  const handleSave = () => {
    onSave({ energy, sleepQuality, stressLevel });
    setShowModal(false);
  };

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case 'high': return 'battery-full';
      case 'medium': return 'battery-half';
      default: return 'battery-dead';
    }
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FFC107';
      default: return '#F44336';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.header}>
          <Ionicons name="happy-outline" size={24} color="#9C27B0" />
          <Text style={styles.title}>Mood & Energy</Text>
        </View>
        {mood ? (
          <View style={styles.moodDisplay}>
            <View style={styles.moodItem}>
              <Ionicons name={getEnergyIcon(mood.energy)} size={20} color={getEnergyColor(mood.energy)} />
              <Text style={styles.moodText}>Energy: {mood.energy}</Text>
            </View>
            <View style={styles.moodItem}>
              <Ionicons name="moon" size={20} color="#5C6BC0" />
              <Text style={styles.moodText}>Sleep: {mood.sleepQuality}</Text>
            </View>
            <View style={styles.moodItem}>
              <Ionicons name="heart" size={20} color="#E91E63" />
              <Text style={styles.moodText}>Stress: {mood.stressLevel}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholder}>Tap to track your mood</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Track Your Mood</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Energy Level</Text>
              <View style={styles.optionsRow}>
                {(['low', 'medium', 'high'] as const).map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      energy === level && styles.optionButtonActive,
                    ]}
                    onPress={() => setEnergy(level)}
                  >
                    <Ionicons
                      name={getEnergyIcon(level)}
                      size={24}
                      color={energy === level ? getEnergyColor(level) : '#999'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        energy === level && styles.optionTextActive,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sleep Quality</Text>
              <View style={styles.optionsRow}>
                {(['poor', 'fair', 'good', 'excellent'] as const).map(quality => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.optionButton,
                      sleepQuality === quality && styles.optionButtonActive,
                    ]}
                    onPress={() => setSleepQuality(quality)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        sleepQuality === quality && styles.optionTextActive,
                      ]}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stress Level</Text>
              <View style={styles.optionsRow}>
                {(['low', 'medium', 'high'] as const).map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      stressLevel === level && styles.optionButtonActive,
                    ]}
                    onPress={() => setStressLevel(level)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        stressLevel === level && styles.optionTextActive,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  moodDisplay: {
    gap: 8,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  optionTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
