import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';

const ProgramExerciseDetailScreen = ({ exercise, onBack, customization }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Video Container - Fixed */}
      <View style={styles.videoContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <View style={styles.videoPlaceholder}>
          <Icon name="play-circle-outline" size={60} color="#fff" type="MaterialIcons" />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
        {/* Exercise Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.difficulty}>{customization?.level || 'Easy'}</Text>
            <Text style={styles.infoDot}>•</Text>
            <Text style={styles.difficulty}>{customization?.duration || '20 min'}</Text>
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{exercise?.name || 'Knee Rotation'}</Text>
          
          {[
            'Stand with your feet shoulder-width apart.',
            'Place your hands on your hips for balance.',
            'Slowly rotate your knees in a circular motion.',
            'Change direction after a few rotations.',
            'Keep your movements controlled and steady.',
          ].map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips to succeed</Text>
          
          {[
            'Keep your upper body relaxed to avoid unnecessary tension.',
            'Maintain a steady and controlled rhythm for better balance.',
            'Engage your core muscles to support smooth rotations.',
          ].map((tip, index) => (
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
  videoContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
  },
  scrollableContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoSection: {
    paddingVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  difficulty: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  infoDot: {
    fontSize: 12,
    color: '#9ca3af',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  instructionText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  tipText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  footerSpace: {
    height: spacing.xl,
  },
});

export default ProgramExerciseDetailScreen;
