import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyReport, MonthlyReport } from '../types';
import { DietUtils } from '../utils/dietUtils';
import { format, startOfWeek, startOfMonth } from 'date-fns';

export const ReportsScreen: React.FC = () => {
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    try {
      if (selectedPeriod === 'week') {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const report = await DietUtils.generateWeeklyReport(weekStart);
        setWeeklyReport(report);
      } else {
        const monthStart = startOfMonth(new Date());
        const report = await DietUtils.generateMonthlyReport(monthStart);
        setMonthlyReport(report);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const getProgressColor = (percent: number): string => {
    if (percent >= 80) return '#4CAF50';
    if (percent >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'week' && styles.periodButtonTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'month' && styles.periodButtonTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedPeriod === 'week' && weeklyReport && (
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="stats-chart" size={24} color="#2196F3" />
                <Text style={styles.cardTitle}>Weekly Overview</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Diet Followed</Text>
                  <Text
                    style={[
                      styles.progressPercent,
                      { color: getProgressColor(weeklyReport.dietFollowedPercent) },
                    ]}
                  >
                    {weeklyReport.dietFollowedPercent}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${weeklyReport.dietFollowedPercent}%`,
                        backgroundColor: getProgressColor(weeklyReport.dietFollowedPercent),
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{weeklyReport.completedMeals}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {weeklyReport.totalMeals - weeklyReport.completedMeals}
                  </Text>
                  <Text style={styles.statLabel}>Missed</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{weeklyReport.totalMeals}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Missed Meals by Type</Text>
              <View style={styles.missedMealsList}>
                <View style={styles.missedMealItem}>
                  <Ionicons name="sunny" size={20} color="#FFB74D" />
                  <Text style={styles.missedMealText}>Breakfast</Text>
                  <Text style={styles.missedMealCount}>
                    {weeklyReport.missedMealsByType.breakfast}
                  </Text>
                </View>
                <View style={styles.missedMealItem}>
                  <Ionicons name="restaurant" size={20} color="#4CAF50" />
                  <Text style={styles.missedMealText}>Lunch</Text>
                  <Text style={styles.missedMealCount}>
                    {weeklyReport.missedMealsByType.lunch}
                  </Text>
                </View>
                <View style={styles.missedMealItem}>
                  <Ionicons name="nutrition" size={20} color="#FF9800" />
                  <Text style={styles.missedMealText}>Snacks</Text>
                  <Text style={styles.missedMealCount}>
                    {weeklyReport.missedMealsByType.snacks}
                  </Text>
                </View>
                <View style={styles.missedMealItem}>
                  <Ionicons name="moon" size={20} color="#5C6BC0" />
                  <Text style={styles.missedMealText}>Dinner</Text>
                  <Text style={styles.missedMealCount}>
                    {weeklyReport.missedMealsByType.dinner}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Highlights</Text>
              <View style={styles.highlightItem}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightLabel}>Best Day</Text>
                  <Text style={styles.highlightValue}>
                    {weeklyReport.bestDay
                      ? format(new Date(weeklyReport.bestDay), 'MMM d')
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="alert-circle" size={20} color="#F44336" />
                <View style={styles.highlightContent}>
                  <Text style={styles.highlightLabel}>Needs Improvement</Text>
                  <Text style={styles.highlightValue}>
                    {weeklyReport.worstDay
                      ? format(new Date(weeklyReport.worstDay), 'MMM d')
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {selectedPeriod === 'month' && monthlyReport && (
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={24} color="#2196F3" />
                <Text style={styles.cardTitle}>Monthly Overview</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Diet Followed</Text>
                  <Text
                    style={[
                      styles.progressPercent,
                      { color: getProgressColor(monthlyReport.dietFollowedPercent) },
                    ]}
                  >
                    {monthlyReport.dietFollowedPercent}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${monthlyReport.dietFollowedPercent}%`,
                        backgroundColor: getProgressColor(monthlyReport.dietFollowedPercent),
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{monthlyReport.completedMeals}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{monthlyReport.perfectDays}</Text>
                  <Text style={styles.statLabel}>Perfect Days</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{monthlyReport.streakDays}</Text>
                  <Text style={styles.statLabel}>Streak Days</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Water Intake</Text>
              <View style={styles.waterStat}>
                <Ionicons name="water" size={32} color="#2196F3" />
                <View style={styles.waterStatContent}>
                  <Text style={styles.waterStatNumber}>
                    {monthlyReport.averageWaterIntake}
                  </Text>
                  <Text style={styles.waterStatLabel}>glasses per day</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Summary</Text>
              <Text style={styles.summaryText}>
                You followed your diet{' '}
                <Text style={styles.summaryHighlight}>
                  {monthlyReport.dietFollowedPercent}%
                </Text>{' '}
                this month. You had{' '}
                <Text style={styles.summaryHighlight}>
                  {monthlyReport.perfectDays} perfect days
                </Text>{' '}
                and maintained a streak for{' '}
                <Text style={styles.summaryHighlight}>
                  {monthlyReport.streakDays} days
                </Text>
                . Keep up the great work! 💪
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  missedMealsList: {
    gap: 12,
  },
  missedMealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  missedMealText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  missedMealCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  highlightContent: {
    flex: 1,
    marginLeft: 12,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#666',
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  waterStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  waterStatContent: {
    marginLeft: 16,
    alignItems: 'center',
  },
  waterStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  waterStatLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  summaryHighlight: {
    fontWeight: '600',
    color: '#2196F3',
  },
});
