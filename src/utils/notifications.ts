import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageService } from './storage';
import { DietUtils } from './dietUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('diet-reminders', {
        name: 'Diet Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleMealReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const diet = await DietUtils.getTodayDiet();
    const motivationalMessages = [
      '💪 Breakfast time – fuel your day right!',
      '🥗 Lunch reminder – keep that energy going!',
      '🍎 Snack time – healthy choices ahead!',
      '🌙 Dinner time – end your day strong!',
    ];

    diet.items.forEach((item, index) => {
      const [hours, minutes] = item.time.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const message = motivationalMessages[index % motivationalMessages.length] || `⏰ ${item.name} time!`;

      Notifications.scheduleNotificationAsync({
        content: {
          title: item.name,
          body: message,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    });
  },

  async sendMissedMealReminder(itemName: string, time: string): Promise<void> {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours + 1, minutes, 0, 0); // 1 hour after meal time

    if (reminderTime < now) {
      return; // Don't send if time has passed
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Missed ${itemName}?`,
        body: 'Don\'t skip meals – your health matters! 💪',
        sound: true,
      },
      trigger: reminderTime,
    });
  },

  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
