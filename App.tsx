import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { DailyChecklistScreen } from './src/screens/DailyChecklistScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { StorageService } from './src/utils/storage';
import { DietUtils } from './src/utils/dietUtils';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Initialize app data
    const initializeApp = async () => {
      try {
        await StorageService.initializeDefaultPlan();
        await DietUtils.checkAndResetDaily();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Today') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Reports') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Today" component={DailyChecklistScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
