# Diet To-Do Tracker 🥗✅

A comprehensive diet tracking app that combines the power of Todoist, diet tracking, and habit formation. Built with React Native and Expo.

## Features

### Core Features

1. **Daily Diet Checklist** - Track breakfast, lunch, snacks, and dinner with:
   - ✅ Checkboxes to mark meals as complete
   - 🕒 Time suggestions for each meal
   - 📝 Optional notes for each meal

2. **Auto-Reset Every Day** - At midnight, all checkboxes reset automatically. Yesterday's data is saved in history.

3. **Streak System** - Track your consistency:
   - 🔥 Current streak display
   - 🏆 Best streak record
   - Automatic streak calculation

4. **Diet History & Calendar View** - Visual calendar showing:
   - 🟢 Green = Diet followed completely
   - 🟡 Yellow = Partial completion
   - 🔴 Red = Missed
   - Tap any date to see detailed meal history

5. **Smart Notifications** - Get reminders at meal times with motivational messages

### Advanced Features

6. **Weekly & Monthly Reports** - Analytics including:
   - Diet adherence percentage
   - Missed meals analysis
   - Best/worst day identification

7. **Custom Diet Plans** - Create and switch between multiple diet plans:
   - Weight loss
   - Muscle gain
   - Normal maintenance

8. **Water Intake Tracker** - Simple +1 glass button with progress bar

9. **Mood & Energy Tracking** - Track:
   - Energy levels (low/medium/high)
   - Sleep quality
   - Stress levels

10. **Offline First** - Works completely offline with local storage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── DietItemCard.tsx
│   │   ├── StreakDisplay.tsx
│   │   ├── WaterTracker.tsx
│   │   └── MoodTracker.tsx
│   ├── screens/          # Main app screens
│   │   ├── DailyChecklistScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── storage.ts
│       ├── dietUtils.ts
│       └── notifications.ts
├── App.tsx               # Main app entry point
└── package.json
```

## Usage

1. **Set Up Your Diet Plan**: Go to Settings and create or select a diet plan
2. **Track Daily Meals**: Check off meals as you complete them throughout the day
3. **Track Water**: Tap the +1 Glass button when you drink water
4. **View History**: Check the History tab to see your progress on the calendar
5. **View Reports**: See weekly and monthly analytics in the Reports tab
6. **Track Mood**: Add mood and energy data to understand patterns

## Data Storage

All data is stored locally using AsyncStorage. No internet connection required. Data persists between app sessions and resets automatically at midnight.

## Notifications

The app requests notification permissions to send meal reminders. You can enable/disable reminders in Settings.

## License

MIT
