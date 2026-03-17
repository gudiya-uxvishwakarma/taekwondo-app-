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
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import QuickWorkoutExerciseDetailScreen from './QuickWorkoutExerciseDetailScreen';

const QuickWorkoutTrainingScreen = ({ program, customization, onBack, onBackToDashboard }) => {
  const [selectedExercise, setSelectedExercise] = React.useState(null);

  // Parse duration to seconds
  const parseDuration = (durationStr) => {
    const match = durationStr?.match(/(\d+)/);
    if (!match) return 300;
    const minutes = parseInt(match[1]);
    return minutes * 60;
  };

  // Parse work time to seconds
  const parseWorkTime = (workTimeStr) => {
    const match = workTimeStr?.match(/(\d+)/);
    if (!match) return 25;
    return parseInt(match[1]);
  };

  // Parse rest time to seconds
  const parseRestTime = (restTimeStr) => {
    const match = restTimeStr?.match(/(\d+)/);
    if (!match) return 10;
    return parseInt(match[1]);
  };

  const totalDurationSeconds = parseDuration(customization?.duration || '20 min');
  const workTimeSeconds = parseWorkTime(customization?.workTime || '25 sec');
  const restTimeSeconds = parseRestTime(customization?.restTime || '10 sec');
  
  const cycleTime = workTimeSeconds + restTimeSeconds;
  const totalExercises = Math.floor(totalDurationSeconds / cycleTime);
  
  const visibleSections = [];
  if (customization?.warmUp !== false) visibleSections.push('warmUp');
  visibleSections.push('training');
  if (customization?.stretching !== false) visibleSections.push('stretching');
  
  const exercisesPerSection = Math.floor(totalExercises / visibleSections.length);

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
      { 
        name: 'Standing Split', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Stand on one leg', 'Lift the other leg up', 'Hold for balance', 'Switch legs'],
        tips: ['Keep your back straight', 'Engage your core', 'Breathe steadily']
      },
      { 
        name: 'Jumping Jack X', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Stand with feet together', 'Jump while spreading legs', 'Raise arms overhead', 'Return to start'],
        tips: ['Keep movements controlled', 'Land softly', 'Maintain rhythm']
      },
      { 
        name: 'Arm Circles', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Stand with arms extended', 'Rotate arms forward', 'Gradually increase speed', 'Reverse direction'],
        tips: ['Keep arms straight', 'Use full range of motion', 'Control the movement']
      },
      { 
        name: 'Leg Swings', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Stand on one leg', 'Swing other leg forward', 'Swing leg backward', 'Increase range gradually'],
        tips: ['Hold onto support if needed', 'Keep hips stable', 'Swing smoothly']
      },
      { 
        name: 'Chair Squats', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Stand in front of chair', 'Lower body toward chair', 'Lightly touch and stand', 'Repeat motion'],
        tips: ['Keep chest up', 'Engage core', 'Control descent']
      },
      { 
        name: 'Chair Dips', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Sit on chair edge', 'Place hands behind you', 'Lower body down', 'Push back up'],
        tips: ['Keep elbows close', 'Move slowly', 'Engage triceps']
      },
    ],
    training: [
      { 
        name: 'Inside-Out Kick - Both Sides', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Stand in fighting stance', 'Chamber leg at hip', 'Rotate hips and kick', 'Return to stance'],
        tips: ['Rotate hips fully', 'Keep balance', 'Control the kick']
      },
      { 
        name: 'Front Kick', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Stand in stance', 'Lift knee to chest', 'Extend leg forward', 'Retract and lower'],
        tips: ['Keep hips level', 'Snap the kick', 'Maintain balance']
      },
      { 
        name: 'Side Kick', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Turn sideways', 'Lift knee to side', 'Extend leg outward', 'Return to start'],
        tips: ['Rotate hips', 'Keep body aligned', 'Control power']
      },
      { 
        name: 'Chair Kick Hold', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Hold chair for support', 'Lift leg up', 'Hold position', 'Lower slowly'],
        tips: ['Maintain posture', 'Engage core', 'Hold steady']
      },
      { 
        name: 'Chair Balance Kick', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Stand near chair', 'Lift one leg', 'Balance on other', 'Switch legs'],
        tips: ['Focus on balance', 'Engage core', 'Move slowly']
      },
      { 
        name: 'Standing Kick Combo', 
        equipment: 'noChair', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Stand in stance', 'Execute first kick', 'Transition smoothly', 'Execute second kick'],
        tips: ['Flow between kicks', 'Maintain balance', 'Control transitions']
      },
      { 
        name: 'Roundhouse Kick', 
        equipment: 'noChair', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Rotate hips', 'Chamber leg', 'Extend in arc', 'Return to stance'],
        tips: ['Rotate fully', 'Keep height', 'Snap the kick']
      },
    ],
    stretching: [
      { 
        name: 'Standing Split Alternate Arms to Leg', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Stand on one leg', 'Lift other leg', 'Reach arms to leg', 'Hold stretch'],
        tips: ['Keep back straight', 'Breathe deeply', 'Gentle stretch']
      },
      { 
        name: 'Standing Split Elbows on Floor', 
        equipment: 'all', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Fold forward', 'Place elbows down', 'Relax into stretch', 'Hold position'],
        tips: ['Relax shoulders', 'Breathe slowly', 'No bouncing']
      },
      { 
        name: 'Standing Split Arms to Floor', 
        equipment: 'noChair', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Fold forward', 'Reach toward floor', 'Relax into stretch', 'Hold'],
        tips: ['Bend knees if needed', 'Breathe deeply', 'Gentle pressure']
      },
      { 
        name: 'Chair Hamstring Stretch', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Sit on chair', 'Extend one leg', 'Fold forward', 'Hold stretch'],
        tips: ['Keep back straight', 'Gentle stretch', 'Breathe']
      },
      { 
        name: 'Chair Hip Stretch', 
        equipment: 'chair', 
        image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' },
        steps: ['Sit on chair', 'Cross leg over knee', 'Fold forward', 'Hold'],
        tips: ['Relax into stretch', 'Breathe deeply', 'No forcing']
      },
      { 
        name: 'Floor Quad Stretch', 
        equipment: 'noChair', 
        image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' },
        steps: ['Lie on side', 'Pull foot to glute', 'Hold position', 'Switch sides'],
        tips: ['Keep hips aligned', 'Gentle pull', 'Breathe']
      },
      { 
        name: 'Floor Hamstring Stretch', 
        equipment: 'noChair', 
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
        steps: ['Lie on back', 'Pull leg toward chest', 'Hold stretch', 'Switch legs'],
        tips: ['Keep back flat', 'Gentle stretch', 'Breathe slowly']
      },
    ],
  };

  const filterExercisesByEquipment = (baseExercises, equipment) => {
    return baseExercises.filter(ex => {
      if (equipment === 'With Chair') {
        return ex.equipment === 'chair' || ex.equipment === 'all';
      } else if (equipment === 'No Chair') {
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

  // Flatten all exercises for video player
  const allExercises = [];
  if (customization?.warmUp !== false) allExercises.push(...exercises.warmUp);
  allExercises.push(...exercises.training);
  if (customization?.stretching !== false) allExercises.push(...exercises.stretching);

  if (selectedExercise) {
    return (
      <QuickWorkoutExerciseDetailScreen 
        exercise={selectedExercise}
        customization={customization}
        onBack={() => setSelectedExercise(null)}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
        style={styles.headerImage}
        imageStyle={styles.headerImageStyle}
      >
        <View style={styles.headerOverlay} />
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Let's go for</Text>
          <Text style={styles.headerTitle}>{program.title}</Text>
          <Text style={styles.headerMeta}>
            {customization.duration} • {customization.level}
          </Text>
          <Text style={styles.headerRest}>
            {customization.restTime} rest between exercise
          </Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Warm-Up Section */}
        {customization?.warmUp !== false && exercises.warmUp.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Warm-Up</Text>
              <Text style={styles.sectionCount}>{exercises.warmUp.length} exercises</Text>
            </View>
            {exercises.warmUp.map((exercise, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.exerciseItem} 
                activeOpacity={0.7}
                onPress={() => setSelectedExercise(exercise)}
              >
                <ImageBackground
                  source={exercise.image}
                  style={styles.exerciseImage}
                  imageStyle={styles.exerciseImageStyle}
                >
                  <View style={styles.exerciseImageOverlay} />
                </ImageBackground>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDuration}>{customization.workTime}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Training Section */}
        {exercises.training.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Training</Text>
              <Text style={styles.sectionCount}>{exercises.training.length} exercises</Text>
            </View>
            {exercises.training.map((exercise, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.exerciseItem} 
                activeOpacity={0.7}
                onPress={() => setSelectedExercise(exercise)}
              >
                <ImageBackground
                  source={exercise.image}
                  style={styles.exerciseImage}
                  imageStyle={styles.exerciseImageStyle}
                >
                  <View style={styles.exerciseImageOverlay} />
                </ImageBackground>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDuration}>{customization.workTime}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stretching Section */}
        {customization?.stretching !== false && exercises.stretching.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stretching</Text>
              <Text style={styles.sectionCount}>{exercises.stretching.length} exercises</Text>
            </View>
            {exercises.stretching.map((exercise, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.exerciseItem} 
                activeOpacity={0.7}
                onPress={() => setSelectedExercise(exercise)}
              >
                <ImageBackground
                  source={exercise.image}
                  style={styles.exerciseImage}
                  imageStyle={styles.exerciseImageStyle}
                >
                  <View style={styles.exerciseImageOverlay} />
                </ImageBackground>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDuration}>{customization.workTime}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerImage: {
    height: 280,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerImageStyle: {
    borderRadius: 0,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    zIndex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  headerMeta: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  headerRest: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  sectionCount: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: spacing.sm,
    backgroundColor: '#e5e7eb',
  },
  exerciseImageStyle: {
    borderRadius: 10,
  },
  exerciseImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  footerSpace: {
    height: spacing.xl,
  },
});

export default QuickWorkoutTrainingScreen;
