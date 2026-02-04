import { DailyDiet, DietItem, MealType, WeeklyReport, MonthlyReport } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { StorageService } from './storage';

export const DietUtils = {
  // Create daily diet from plan
  async createDailyDietFromPlan(date: string): Promise<DailyDiet> {
    const planId = await StorageService.getCurrentPlanId();
    const plans = await StorageService.getDietPlans();
    const plan = plans.find(p => p.id === planId) || plans[0];

    const items: DietItem[] = plan.items.map((item, index) => ({
      ...item,
      id: `${date}-${item.type}-${index}`,
      completed: false,
    }));

    return {
      date,
      items,
      waterGlasses: 0,
      waterGoal: 8,
      perfectDay: false,
    };
  },

  // Get or create today's diet
  async getTodayDiet(): Promise<DailyDiet> {
    const today = format(new Date(), 'yyyy-MM-dd');
    let diet = await StorageService.getDailyDiet(today);

    if (!diet) {
      diet = await this.createDailyDietFromPlan(today);
      await StorageService.saveDailyDiet(diet);
    }

    return diet;
  },

  // Check if all items completed (perfect day)
  checkPerfectDay(diet: DailyDiet): boolean {
    const allItemsCompleted = diet.items.every(item => item.completed);
    const waterGoalMet = diet.waterGlasses >= diet.waterGoal;
    return allItemsCompleted && waterGoalMet;
  },

  // Get diet status for a date
  async getDietStatus(date: string): Promise<'complete' | 'partial' | 'missed'> {
    const diet = await StorageService.getDailyDiet(date);
    if (!diet || diet.items.length === 0) {
      return 'missed';
    }

    const completedCount = diet.items.filter(item => item.completed).length;
    const completionPercent = completedCount / diet.items.length;

    if (completionPercent === 1) {
      return 'complete';
    } else if (completionPercent > 0) {
      return 'partial';
    } else {
      return 'missed';
    }
  },

  // Generate weekly report
  async generateWeeklyReport(weekStart: Date): Promise<WeeklyReport> {
    const weekEnd = endOfWeek(weekStart);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    let totalMeals = 0;
    let completedMeals = 0;
    const missedMealsByType: Record<MealType, number> = {
      breakfast: 0,
      lunch: 0,
      snacks: 0,
      dinner: 0,
    };

    let bestDay = '';
    let worstDay = '';
    let bestPercent = 0;
    let worstPercent = 100;

    for (const day of days) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const diet = await StorageService.getDailyDiet(dateStr);
      
      if (diet && diet.items.length > 0) {
        const dayCompleted = diet.items.filter(item => item.completed).length;
        const dayTotal = diet.items.length;
        const dayPercent = dayCompleted / dayTotal;

        totalMeals += dayTotal;
        completedMeals += dayCompleted;

        if (dayPercent > bestPercent) {
          bestPercent = dayPercent;
          bestDay = dateStr;
        }
        if (dayPercent < worstPercent) {
          worstPercent = dayPercent;
          worstDay = dateStr;
        }

        diet.items.forEach(item => {
          if (!item.completed) {
            missedMealsByType[item.type]++;
          }
        });
      }
    }

    const dietFollowedPercent = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

    return {
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      weekEnd: format(weekEnd, 'yyyy-MM-dd'),
      dietFollowedPercent: Math.round(dietFollowedPercent * 10) / 10,
      totalMeals,
      completedMeals,
      missedMealsByType,
      bestDay,
      worstDay,
    };
  },

  // Generate monthly report
  async generateMonthlyReport(month: Date): Promise<MonthlyReport> {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let totalMeals = 0;
    let completedMeals = 0;
    let totalWater = 0;
    let perfectDays = 0;
    let streakDays = 0;

    for (const day of days) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const diet = await StorageService.getDailyDiet(dateStr);
      
      if (diet) {
        totalMeals += diet.items.length;
        completedMeals += diet.items.filter(item => item.completed).length;
        totalWater += diet.waterGlasses;
        
        if (this.checkPerfectDay(diet)) {
          perfectDays++;
        }

        const completedCount = diet.items.filter(item => item.completed).length;
        if (completedCount === diet.items.length && diet.items.length > 0) {
          streakDays++;
        }
      }
    }

    const daysInMonth = days.length;
    const dietFollowedPercent = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
    const averageWaterIntake = daysInMonth > 0 ? totalWater / daysInMonth : 0;

    return {
      month: format(month, 'yyyy-MM'),
      dietFollowedPercent: Math.round(dietFollowedPercent * 10) / 10,
      totalMeals,
      completedMeals,
      averageWaterIntake: Math.round(averageWaterIntake * 10) / 10,
      perfectDays,
      streakDays,
    };
  },

  // Reset check - should be called on app start
  async checkAndResetDaily(): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastReset = await StorageService.getLastResetDate();

    if (lastReset !== today) {
      // Update yesterday's perfect day status if needed
      if (lastReset) {
        const yesterdayDiet = await StorageService.getDailyDiet(lastReset);
        if (yesterdayDiet) {
          yesterdayDiet.perfectDay = this.checkPerfectDay(yesterdayDiet);
          await StorageService.saveDailyDiet(yesterdayDiet);
          await StorageService.updateStreak(yesterdayDiet);
        }
      }

      // Initialize today's diet
      await this.getTodayDiet();
      await StorageService.setLastResetDate(today);
    }
  },
};
