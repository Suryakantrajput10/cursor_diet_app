import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyDiet, StreakData, DietPlan } from '../types';
import { format } from 'date-fns';

const STORAGE_KEYS = {
  DAILY_DIETS: 'daily_diets',
  STREAK_DATA: 'streak_data',
  DIET_PLANS: 'diet_plans',
  CURRENT_PLAN_ID: 'current_plan_id',
  LAST_RESET_DATE: 'last_reset_date',
};

export const StorageService = {
  // Daily Diet Operations
  async getDailyDiet(date: string): Promise<DailyDiet | null> {
    try {
      const allDiets = await this.getAllDailyDiets();
      return allDiets[date] || null;
    } catch (error) {
      console.error('Error getting daily diet:', error);
      return null;
    }
  },

  async saveDailyDiet(diet: DailyDiet): Promise<void> {
    try {
      const allDiets = await this.getAllDailyDiets();
      allDiets[diet.date] = diet;
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_DIETS, JSON.stringify(allDiets));
    } catch (error) {
      console.error('Error saving daily diet:', error);
    }
  },

  async getAllDailyDiets(): Promise<Record<string, DailyDiet>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_DIETS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting all daily diets:', error);
      return {};
    }
  },

  // Streak Operations
  async getStreakData(): Promise<StreakData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
      if (data) {
        return JSON.parse(data);
      }
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: '',
      };
    } catch (error) {
      console.error('Error getting streak data:', error);
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: '',
      };
    }
  },

  async updateStreak(diet: DailyDiet): Promise<StreakData> {
    try {
      const streakData = await this.getStreakData();
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedItems = diet.items.filter(item => item.completed).length;
      const isComplete = completedItems === diet.items.length && diet.items.length > 0;

      if (isComplete) {
        const lastDate = streakData.lastActiveDate;
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

        if (!lastDate || lastDate === yesterday || lastDate === today) {
          // Continue or start streak
          if (lastDate === yesterday || !lastDate) {
            streakData.currentStreak = lastDate === yesterday ? streakData.currentStreak + 1 : 1;
          }
          streakData.lastActiveDate = today;
        } else {
          // Streak broken
          streakData.currentStreak = 1;
          streakData.lastActiveDate = today;
        }

        if (streakData.currentStreak > streakData.bestStreak) {
          streakData.bestStreak = streakData.currentStreak;
        }
      } else {
        // Check if streak should be broken
        const lastDate = streakData.lastActiveDate;
        if (lastDate && lastDate !== today && lastDate !== format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')) {
          streakData.currentStreak = 0;
        }
      }

      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
      return streakData;
    } catch (error) {
      console.error('Error updating streak:', error);
      return await this.getStreakData();
    }
  },

  // Diet Plans Operations
  async getDietPlans(): Promise<DietPlan[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DIET_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting diet plans:', error);
      return [];
    }
  },

  async saveDietPlan(plan: DietPlan): Promise<void> {
    try {
      const plans = await this.getDietPlans();
      const index = plans.findIndex(p => p.id === plan.id);
      if (index >= 0) {
        plans[index] = plan;
      } else {
        plans.push(plan);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(plans));
    } catch (error) {
      console.error('Error saving diet plan:', error);
    }
  },

  async saveDietPlans(plans: DietPlan[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(plans));
    } catch (error) {
      console.error('Error saving diet plans:', error);
    }
  },

  async deleteDietPlan(planId: string): Promise<void> {
    try {
      const plans = await this.getDietPlans();
      const filtered = plans.filter(p => p.id !== planId);
      await AsyncStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting diet plan:', error);
    }
  },

  async getCurrentPlanId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PLAN_ID);
    } catch (error) {
      console.error('Error getting current plan ID:', error);
      return null;
    }
  },

  async setCurrentPlanId(planId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PLAN_ID, planId);
    } catch (error) {
      console.error('Error setting current plan ID:', error);
    }
  },

  // Reset Operations
  async getLastResetDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);
    } catch (error) {
      return null;
    }
  },

  async setLastResetDate(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, date);
    } catch (error) {
      console.error('Error setting last reset date:', error);
    }
  },

  // Initialize default diet plan
  async initializeDefaultPlan(): Promise<void> {
    const plans = await this.getDietPlans();
    if (plans.length === 0) {
      const defaultPlan: DietPlan = {
        id: 'default',
        name: 'Balanced Diet',
        description: 'A balanced daily meal plan',
        items: [
          { type: 'breakfast', name: 'Oats + Banana', time: '08:00' },
          { type: 'snacks', name: 'Fruits', time: '11:00' },
          { type: 'lunch', name: 'Rice + Dal + Salad', time: '14:00' },
          { type: 'snacks', name: 'Nuts', time: '17:00' },
          { type: 'dinner', name: 'Light Dinner', time: '20:30' },
        ],
      };
      await this.saveDietPlan(defaultPlan);
      await this.setCurrentPlanId('default');
    }
  },
};
