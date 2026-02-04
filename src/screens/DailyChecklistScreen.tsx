import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DietItemCard } from '../components/DietItemCard';
import { StreakDisplay } from '../components/StreakDisplay';
import { WaterTracker } from '../components/WaterTracker';
import { MoodTracker } from '../components/MoodTracker';
import { DailyDiet, StreakData, DietItem } from '../types';
import { StorageService } from '../utils/storage';
import { DietUtils } from '../utils/dietUtils';
import { NotificationService } from '../utils/notifications';
import { format } from 'date-fns';

export const DailyChecklistScreen: React.FC = () => {
  const [diet, setDiet] = useState<DailyDiet | null>(null);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [perfectDay, setPerfectDay] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await DietUtils.checkAndResetDaily();
      const todayDiet = await DietUtils.getTodayDiet();
      const streak = await StorageService.getStreakData();
      
      setDiet(todayDiet);
      setStreakData(streak);
      setPerfectDay(DietUtils.checkPerfectDay(todayDiet));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    NotificationService.requestPermissions();
    NotificationService.scheduleMealReminders();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleToggleItem = async (id: string) => {
    if (!diet) return;

    const updatedItems = diet.items.map(item =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date().toISOString() : undefined,
          }
        : item
    );

    const updatedDiet: DailyDiet = {
      ...diet,
      items: updatedItems,
      perfectDay: DietUtils.checkPerfectDay({ ...diet, items: updatedItems }),
    };

    setDiet(updatedDiet);
    await StorageService.saveDailyDiet(updatedDiet);
    
    const updatedStreak = await StorageService.updateStreak(updatedDiet);
    setStreakData(updatedStreak);
    setPerfectDay(updatedDiet.perfectDay);

    if (updatedDiet.perfectDay && !perfectDay) {
      Alert.alert('🎉 Perfect Day!', 'You completed all meals and met your water goal!');
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    if (!diet) return;

    const updatedItems = diet.items.map(item =>
      item.id === id ? { ...item, notes } : item
    );

    const updatedDiet: DailyDiet = { ...diet, items: updatedItems };
    setDiet(updatedDiet);
    await StorageService.saveDailyDiet(updatedDiet);
  };

  const handleWaterAdd = async () => {
    if (!diet) return;

    const updatedDiet: DailyDiet = {
      ...diet,
      waterGlasses: Math.min(diet.waterGlasses + 1, diet.waterGoal * 2),
    };

    setDiet(updatedDiet);
    await StorageService.saveDailyDiet(updatedDiet);
    setPerfectDay(DietUtils.checkPerfectDay(updatedDiet));
  };

  const handleMoodSave = async (mood: {
    energy: 'low' | 'medium' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    stressLevel: 'low' | 'medium' | 'high';
  }) => {
    if (!diet) return;

    const updatedDiet: DailyDiet = {
      ...diet,
      mood,
    };

    setDiet(updatedDiet);
    await StorageService.saveDailyDiet(updatedDiet);
  };

  const groupItemsByType = (items: DietItem[]) => {
    const groups: Record<string, DietItem[]> = {
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: [],
    };

    items.forEach(item => {
      if (groups[item.type]) {
        groups[item.type].push(item);
      }
    });

    return groups;
  };

  if (!diet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedItems = groupItemsByType(diet.items);
  const completedCount = diet.items.filter(item => item.completed).length;
  const totalCount = diet.items.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          {perfectDay && (
            <View style={styles.badge}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.badgeText}>Perfect Day!</Text>
            </View>
          )}
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedCount} / {totalCount} meals completed ({completionPercent}%)
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
          </View>
        </View>

        <StreakDisplay streakData={streakData} />

        <WaterTracker
          current={diet.waterGlasses}
          goal={diet.waterGoal}
          onAdd={handleWaterAdd}
        />

        <MoodTracker mood={diet.mood} onSave={handleMoodSave} />

        {groupedItems.breakfast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌅 Breakfast</Text>
            {groupedItems.breakfast.map(item => (
              <DietItemCard
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onNotesChange={handleNotesChange}
              />
            ))}
          </View>
        )}

        {groupedItems.lunch.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Lunch</Text>
            {groupedItems.lunch.map(item => (
              <DietItemCard
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onNotesChange={handleNotesChange}
              />
            ))}
          </View>
        )}

        {groupedItems.snacks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍎 Snacks</Text>
            {groupedItems.snacks.map(item => (
              <DietItemCard
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onNotesChange={handleNotesChange}
              />
            ))}
          </View>
        )}

        {groupedItems.dinner.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌙 Dinner</Text>
            {groupedItems.dinner.map(item => (
              <DietItemCard
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onNotesChange={handleNotesChange}
              />
            ))}
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57F17',
    marginLeft: 4,
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  footer: {
    height: 32,
  },
});
