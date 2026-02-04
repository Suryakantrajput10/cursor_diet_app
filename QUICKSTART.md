# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android) OR iOS Simulator/Android Emulator

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - **Physical Device**: Scan the QR code with Expo Go app
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal

## First Time Setup

1. When you first open the app, a default "Balanced Diet" plan will be created automatically
2. Go to Settings to create custom diet plans or modify the default one
3. Enable notifications in Settings to get meal reminders
4. Start tracking your meals by checking them off as you complete them

## Key Features to Try

- ✅ **Daily Checklist**: Mark meals as complete throughout the day
- 💧 **Water Tracker**: Tap +1 Glass to track water intake
- 🔥 **Streaks**: Build consistency with the streak counter
- 📅 **History**: View your progress on the calendar
- 📊 **Reports**: See weekly and monthly analytics
- 😊 **Mood Tracking**: Track your energy, sleep, and stress levels

## Troubleshooting

- **Notifications not working**: Make sure you've granted notification permissions in your device settings
- **Data not persisting**: Check that AsyncStorage is working (should work automatically)
- **App crashes on start**: Make sure all dependencies are installed (`npm install`)

## Building for Production

To create a production build:

```bash
expo build:android
# or
expo build:ios
```

For more information, see the [Expo documentation](https://docs.expo.dev/).
