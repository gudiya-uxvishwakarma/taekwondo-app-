import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import ExerciseDetailScreen from './ExerciseDetailScreen';

const ProgramExercisesReviewScreen = ({ onBack, customization, onSelectExercise }) => {
  const [activeSection, setActiveSection] = React.useState('warmUp');
  
  // Parse duration to seconds
  const parseDuration = (durationStr) => {
    const match = durationStr?.match(/(\d+)/);
    if (!match) return 300; // default 5 mins
    const minutes = parseInt(match[1]);
    return minutes * 60;
  };

  // Parse work time to seconds
  const parseWorkTime = (workTimeStr) => {
    const match = workTimeStr?.match(/(\d+)/);
    if (!match) return 25; // default 25 sec
    return parseInt(match[1]);
  };

  // Parse rest time to seconds
  const parseRestTime = (restTimeStr) => {
    const match = restTimeStr?.match(/(\d+)/);
    if (!match) return 10; // default 10 sec
    return parseInt(match[1]);
  };

  const totalDurationSeconds = parseDuration(customization?.duration || '20 min');
  const workTimeSeconds = parseWorkTime(customization?.workTime || '25 sec');
  const restTimeSeconds = parseRestTime(customization?.restTime || '10 sec');
  
  // Calculate total exercises: (work + rest) per cycle
  const cycleTime = workTimeSeconds + restTimeSeconds;
  const totalExercises = Math.floor(totalDurationSeconds / cycleTime);
  
  // Determine which sections to show based on customization
  const visibleSections = [];
  if (customization?.warmUp !== false) visibleSections.push('warmUp');
  visibleSections.push('training');
  if (customization?.stretching !== false) visibleSections.push('stretching');
  
  // Distribute exercises equally across visible sections only
  const exercisesPerSection = Math.floor(totalExercises / visibleSections.length);
  
  // Generate exercises based on calculated count
  const generateExercises = (baseExercises, count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const baseExercise = baseExercises[i % baseExercises.length];
      result.push({
        ...baseExercise,
        id: i + 1,
      });
    }
    return result;
  };

  const baseExercises = {
    warmUp: [
      { name: 'Standing Split', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Jumping Jack X', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Arm Circles', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { name: 'Leg Swings', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Chair Squats', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Chair Dips', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
    ],
    training: [
      { name: 'Inside-Out Kick - Both Sides', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { name: 'Front Kick', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Side Kick', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Chair Kick Hold', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { name: 'Chair Balance Kick', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Standing Kick Combo', equipment: 'noChair', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Roundhouse Kick', equipment: 'noChair', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
    ],
    stretching: [
      { name: 'Standing Split Alternate Arms to Leg', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { name: 'Standing Split Elbows on Floor', equipment: 'all', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Standing Split Arms to Floor', equipment: 'noChair', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Chair Hamstring Stretch', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { name: 'Chair Hip Stretch', equipment: 'chair', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { name: 'Floor Quad Stretch', equipment: 'noChair', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { name: 'Floor Hamstring Stretch', equipment: 'noChair', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
    ],
  };

  // Filter exercises based on equipment setting
  const filterExercisesByEquipment = (baseExercises, equipment) => {
    return baseExercises.filter(ex => {
      if (equipment === 'With Chair') {
        // Show chair exercises and all exercises
        return ex.equipment === 'chair' || ex.equipment === 'all';
      } else if (equipment === 'No Chair') {
        // Show only no-chair exercises
        return ex.equipment === 'noChair' || ex.equipment === 'all';
      }
      return true;
    });
  };

  const filteredBaseExercises = {
    warmUp: filterExercisesByEquipment(baseExercises.warmUp, customization?.equipment || 'With Chair'),
    training: filterExercisesByEquipment(baseExercises.training, customization?.equipment || 'With Chair'),
    stretching: filterExercisesByEquipment(baseExercises.stretching, customization?.equipment || 'With Chair'),
  };

  const exercises = {
    warmUp: generateExercises(filteredBaseExercises.warmUp, exercisesPerSection),
    training: generateExercises(filteredBaseExercises.training, exercisesPerSection),
    stretching: generateExercises(filteredBaseExercises.stretching, exercisesPerSection),
  };

  const sectionNames = {
    warmUp: 'Warm-Up',
    training: 'Training',
    stretching: 'Stretching',
  };

  const renderExerciseCard = (exercise) => (
    <TouchableOpacity 
      style={styles.exerciseCard} 
      activeOpacity={0.7}
      onPress={() => onSelectExercise(exercise)}
    >
      <ImageBackground
        source={exercise.image}
        style={styles.exerciseImage}
        imageStyle={styles.exerciseImageStyle}
      >
        <View style={styles.exerciseImageOverlay} />
      </ImageBackground>
      
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
      </View>

      <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
    </TouchableOpacity>
  );

  const renderSection = (title, count, data) => (
    <View key={title} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{count} exercises</Text>
      </View>
      {data.map((exercise) => (
        <View key={exercise.id}>
          {renderExerciseCard(exercise)}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.modalContent}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with close button */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.modalTitle}>Your training • {customization?.workTime || '25 sec'} work / {customization?.restTime || '10 sec'} rest</Text>
          </View>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        {Object.keys(exercises).map((sectionKey) => {
          // Only render if section is visible
          if (!visibleSections.includes(sectionKey)) return null;
          
          return (
            <View key={sectionKey} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionNames[sectionKey]}</Text>
                <Text style={styles.sectionCount}>{exercises[sectionKey].length} exercises</Text>
              </View>
              {exercises[sectionKey].map((exercise) => (
                <TouchableOpacity 
                  key={exercise.id}
                  style={styles.exerciseCard} 
                  activeOpacity={0.7}
                  onPress={() => {
                    setActiveSection(sectionKey);
                    onSelectExercise(exercise);
                  }}
                >
                  <ImageBackground
                    source={exercise.image}
                    style={styles.exerciseImage}
                    imageStyle={styles.exerciseImageStyle}
                  >
                    <View style={styles.exerciseImageOverlay} />
                  </ImageBackground>
                  
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDuration}>{customization?.workTime || '25 s'}</Text>
                  </View>

                  <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  currentSectionContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  currentSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  equipmentInfo: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  trainingInfo: {
    marginBottom: spacing.md,
  },
  trainingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
  },
  sectionCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  exerciseImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  exerciseImageStyle: {
    borderRadius: 12,
  },
  exerciseImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  exerciseDuration: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  footerSpace: {
    height: spacing.md,
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});

export default ProgramExercisesReviewScreen;
