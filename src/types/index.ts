export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface DietItem {
  id: string;
  type: MealType;
  name: string;
  time: string; // HH:MM format
  notes?: string;
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface DailyDiet {
  date: string; // YYYY-MM-DD format
  items: DietItem[];
  waterGlasses: number;
  waterGoal: number;
  mood?: {
    energy: 'low' | 'medium' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    stressLevel: 'low' | 'medium' | 'high';
  };
  perfectDay: boolean;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  items: Omit<DietItem, 'id' | 'completed' | 'completedAt'>[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  dietFollowedPercent: number;
  totalMeals: number;
  completedMeals: number;
  missedMealsByType: Record<MealType, number>;
  bestDay: string;
  worstDay: string;
}

export interface MonthlyReport {
  month: string;
  dietFollowedPercent: number;
  totalMeals: number;
  completedMeals: number;
  averageWaterIntake: number;
  perfectDays: number;
  streakDays: number;
}
