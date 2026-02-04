import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { DailyDiet } from '../types';
import { StorageService } from '../utils/storage';
import { DietUtils } from '../utils/dietUtils';
import { format, parseISO } from 'date-fns';

export const HistoryScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDiet, setSelectedDiet] = useState<DailyDiet | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const allDiets = await StorageService.getAllDailyDiets();
      const marked: Record<string, any> = {};

      Object.keys(allDiets).forEach(date => {
        const diet = allDiets[date];
        const completedCount = diet.items.filter(item => item.completed).length;
        const totalCount = diet.items.length;
        const completionPercent = totalCount > 0 ? completedCount / totalCount : 0;

        let dotColor = '#F44336'; // Red - missed
        if (completionPercent === 1) {
          dotColor = '#4CAF50'; // Green - complete
        } else if (completionPercent > 0) {
          dotColor = '#FFC107'; // Yellow - partial
        }

        marked[date] = {
          marked: true,
          dotColor,
          selected: date === selectedDate,
          selectedColor: dotColor,
        };
      });

      // Mark selected date
      if (marked[selectedDate]) {
        marked[selectedDate].selected = true;
      } else {
        marked[selectedDate] = {
          selected: true,
          selectedColor: '#2196F3',
        };
      }

      setMarkedDates(marked);
      await loadDietForDate(selectedDate);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, [selectedDate]);

  const loadDietForDate = async (date: string) => {
    const diet = await StorageService.getDailyDiet(date);
    setSelectedDiet(diet);
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDateSelect = async (day: any) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    await loadDietForDate(dateStr);
    setShowDetails(true);
  };

  const getStatusColor = (diet: DailyDiet | null): string => {
    if (!diet || diet.items.length === 0) return '#F44336';
    const completedCount = diet.items.filter(item => item.completed).length;
    const completionPercent = completedCount / diet.items.length;
    if (completionPercent === 1) return '#4CAF50';
    if (completionPercent > 0) return '#FFC107';
    return '#F44336';
  };

  const getStatusText = (diet: DailyDiet | null): string => {
    if (!diet || diet.items.length === 0) return 'No data';
    const completedCount = diet.items.filter(item => item.completed).length;
    const completionPercent = completedCount / diet.items.length;
    if (completionPercent === 1) return 'Complete';
    if (completionPercent > 0) return 'Partial';
    return 'Missed';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet History</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Complete</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Partial</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
        </View>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDateSelect}
        markingType="dot"
        theme={{
          selectedDayBackgroundColor: '#2196F3',
          selectedDayTextColor: '#fff',
          todayTextColor: '#2196F3',
          dayTextColor: '#333',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4CAF50',
          selectedDotColor: '#fff',
          arrowColor: '#2196F3',
          monthTextColor: '#333',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        style={styles.calendar}
      />

      {selectedDiet && (
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => setShowDetails(true)}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryDate}>
              {format(parseISO(selectedDiet.date), 'EEEE, MMMM d, yyyy')}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(selectedDiet) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText(selectedDiet)}</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.statText}>
                {selectedDiet.items.filter(item => item.completed).length} / {selectedDiet.items.length} meals
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="water" size={20} color="#2196F3" />
              <Text style={styles.statText}>
                {selectedDiet.waterGlasses} glasses
              </Text>
            </View>
            {selectedDiet.perfectDay && (
              <View style={styles.stat}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <Text style={styles.statText}>Perfect Day!</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDiet
                  ? format(parseISO(selectedDiet.date), 'EEEE, MMMM d')
                  : 'No Data'}
              </Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {selectedDiet && (
              <ScrollView style={styles.modalBody}>
                {selectedDiet.items.map(item => (
                  <View
                    key={item.id}
                    style={[
                      styles.mealItem,
                      item.completed && styles.mealItemCompleted,
                    ]}
                  >
                    <View style={styles.mealItemHeader}>
                      <Text style={styles.mealItemName}>{item.name}</Text>
                      {item.completed ? (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      ) : (
                        <Ionicons name="close-circle" size={20} color="#F44336" />
                      )}
                    </View>
                    <Text style={styles.mealItemTime}>{item.time}</Text>
                    {item.notes && (
                      <Text style={styles.mealItemNotes}>{item.notes}</Text>
                    )}
                  </View>
                ))}
                {selectedDiet.mood && (
                  <View style={styles.moodSection}>
                    <Text style={styles.moodTitle}>Mood & Energy</Text>
                    <Text style={styles.moodText}>
                      Energy: {selectedDiet.mood.energy}
                    </Text>
                    <Text style={styles.moodText}>
                      Sleep: {selectedDiet.mood.sleepQuality}
                    </Text>
                    <Text style={styles.moodText}>
                      Stress: {selectedDiet.mood.stressLevel}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  calendar: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  mealItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  mealItemCompleted: {
    backgroundColor: '#E8F5E9',
  },
  mealItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealItemTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mealItemNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  moodSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  moodText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
