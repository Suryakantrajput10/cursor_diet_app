import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DietItem, MealType } from '../types';

interface DietItemCardProps {
  item: DietItem;
  onToggle: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
}

const mealIcons: Record<MealType, string> = {
  breakfast: 'sunny',
  lunch: 'restaurant',
  snacks: 'nutrition',
  dinner: 'moon',
};

const mealColors: Record<MealType, string> = {
  breakfast: '#FFB74D',
  lunch: '#4CAF50',
  snacks: '#FF9800',
  dinner: '#5C6BC0',
};

export const DietItemCard: React.FC<DietItemCardProps> = ({ item, onToggle, onNotesChange }) => {
  const [showNotes, setShowNotes] = React.useState(false);
  const [notes, setNotes] = React.useState(item.notes || '');

  const handleNotesBlur = () => {
    if (onNotesChange) {
      onNotesChange(item.id, notes);
    }
    setShowNotes(false);
  };

  return (
    <TouchableOpacity
      style={[styles.container, item.completed && styles.completed]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: mealColors[item.type] + '20' }]}>
            <Ionicons name={mealIcons[item.type]} size={24} color={mealColors[item.type]} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.name, item.completed && styles.completedText]}>
              {item.name}
            </Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          onPress={() => onToggle(item.id)}
        >
          {item.completed && <Ionicons name="checkmark" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
      {item.completed && (
        <TouchableOpacity
          style={styles.notesButton}
          onPress={() => setShowNotes(!showNotes)}
        >
          <Ionicons name="create-outline" size={16} color="#666" />
          <Text style={styles.notesButtonText}>
            {item.notes ? 'Edit notes' : 'Add notes'}
          </Text>
        </TouchableOpacity>
      )}
      {showNotes && (
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes about this meal..."
          value={notes}
          onChangeText={setNotes}
          onBlur={handleNotesBlur}
          multiline
          autoFocus
        />
      )}
      {item.notes && !showNotes && (
        <View style={styles.notesDisplay}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completed: {
    opacity: 0.7,
    borderLeftColor: '#81C784',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  notesButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  notesInput: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  notesDisplay: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
  },
});
