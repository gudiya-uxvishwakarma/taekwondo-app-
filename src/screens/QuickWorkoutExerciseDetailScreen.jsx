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

const QuickWorkoutExerciseDetailScreen = ({ exercise, customization, onBack, onBackToDashboard }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Get steps and tips from exercise data, or use defaults
  const steps = exercise?.steps || [
    'Stand with your feet shoulder-width apart.',
    'Place your hands on your hips for balance.',
    'Slowly rotate your knees in a circular motion.',
    'Change direction after a few rotations.',
    'Keep your movements controlled and steady.',
  ];

  const tips = exercise?.tips || [
    'Keep your upper body relaxed to avoid unnecessary tension.',
    'Maintain a steady and controlled rhythm for better balance.',
    'Engage your core muscles to support smooth rotations.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* Exercise Image - Fixed */}
      <View style={styles.imageContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <ImageBackground
          source={exercise?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
          style={styles.exerciseImage}
          imageStyle={styles.exerciseImageStyle}
        >
          <View style={styles.imageOverlay} />
          {!isPlaying && (
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPlaying(true)}
              activeOpacity={0.7}
            >
              <Icon name="play-arrow" size={60} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Exercise Info */}
        <View style={styles.infoSection}>
          <Text style={styles.difficulty}>{customization?.level || 'Easy'}</Text>
          <Text style={styles.exerciseName}>{exercise?.name || 'Exercise'}</Text>
        </View>

        {/* Steps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips to succeed</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

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
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e5e7eb',
    position: 'relative',
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
  exerciseImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  exerciseImageStyle: {
    borderRadius: 0,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  container: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  difficulty: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  stepText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
    paddingTop: spacing.xs,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  tipText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
    paddingTop: spacing.xs,
  },
  footerSpace: {
    height: spacing.md,
  },
});

export default QuickWorkoutExerciseDetailScreen;
