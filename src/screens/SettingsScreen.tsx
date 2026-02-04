import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DietPlan, MealType } from '../types';
import { StorageService } from '../utils/storage';
import { DietUtils } from '../utils/dietUtils';
import { NotificationService } from '../utils/notifications';

export const SettingsScreen: React.FC = () => {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    await StorageService.initializeDefaultPlan();
    const loadedPlans = await StorageService.getDietPlans();
    const currentId = await StorageService.getCurrentPlanId();
    setPlans(loadedPlans);
    setCurrentPlanId(currentId);
  };

  const handleSelectPlan = async (planId: string) => {
    await StorageService.setCurrentPlanId(planId);
    setCurrentPlanId(planId);
    // Reset today's diet to use new plan
    const today = new Date().toISOString().split('T')[0];
    const newDiet = await DietUtils.createDailyDietFromPlan(today);
    await StorageService.saveDailyDiet(newDiet);
    Alert.alert('Plan Changed', 'Your daily checklist has been updated!');
  };

  const handleCreatePlan = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      name: '',
      description: '',
      items: [],
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan || !editingPlan.name.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    await StorageService.saveDietPlan(editingPlan);
    await loadPlans();
    setShowPlanModal(false);
    setEditingPlan(null);
    Alert.alert('Success', 'Diet plan saved!');
  };

  const handleDeletePlan = async (planId: string) => {
    if (planId === currentPlanId) {
      Alert.alert('Error', 'Cannot delete the active plan');
      return;
    }

    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteDietPlan(planId);
            await loadPlans();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Plans</Text>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                plan.id === currentPlanId && styles.planCardActive,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
            >
              <View style={styles.planCardContent}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                <Text style={styles.planItems}>
                  {plan.items.length} meals configured
                </Text>
              </View>
              {plan.id === currentPlanId && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
              {plan.id !== currentPlanId && (
                <TouchableOpacity
                  onPress={() => handleDeletePlan(plan.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreatePlan}
          >
            <Ionicons name="add-circle" size={24} color="#2196F3" />
            <Text style={styles.addButtonText}>Create New Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={async () => {
              await NotificationService.requestPermissions();
              await NotificationService.scheduleMealReminders();
              Alert.alert('Success', 'Notifications scheduled!');
            }}
          >
            <Ionicons name="notifications" size={24} color="#2196F3" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Enable Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified at meal times
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Diet To-Do Tracker helps you maintain a consistent diet by tracking
              your daily meals, water intake, and building healthy habits through
              streaks and progress tracking.
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPlanModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPlan?.id.startsWith('plan-') ? 'Create Plan' : 'Edit Plan'}
              </Text>
              <TouchableOpacity onPress={() => setShowPlanModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {editingPlan && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Plan Name</Text>
                <TextInput
                  style={styles.input}
                  value={editingPlan.name}
                  onChangeText={text =>
                    setEditingPlan({ ...editingPlan, name: text })
                  }
                  placeholder="e.g., Weight Loss Plan"
                />
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={editingPlan.description}
                  onChangeText={text =>
                    setEditingPlan({ ...editingPlan, description: text })
                  }
                  placeholder="Brief description"
                  multiline
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSavePlan}
                >
                  <Text style={styles.saveButtonText}>Save Plan</Text>
                </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planCardActive: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  planCardContent: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planItems: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
