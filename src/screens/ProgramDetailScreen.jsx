import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import ProgramExercisesReviewScreen from './ProgramExercisesReviewScreen';
import ExerciseDetailScreen from './ExerciseDetailScreen';
import ExerciseVideoPlayerScreen from './ExerciseVideoPlayerScreen';
import API_CONFIG from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');

const getImageSource = (image) => {
  if (!image) return null;
  if (typeof image === 'object') return image; // already {uri: ...}
  if (image.startsWith('http')) return { uri: image };
  return { uri: `${BASE_URL}/${image.replace(/^\//, '')}` };
};

const ProgramDetailScreen = ({ program, onBack }) => {
  const [apiExercises, setApiExercises] = React.useState({ warmUp: [], training: [], stretching: [] });
  const [completedLessons, setCompletedLessons] = React.useState(0);

  const programKey = `program_progress_${program?._id || program?.id || 'unknown'}`;
  const [showCustomization, setShowCustomization] = React.useState(false);
  const [showLevelPicker, setShowLevelPicker] = React.useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = React.useState(false);
  const [showExercises, setShowExercises] = React.useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [customization, setCustomization] = React.useState({
    level: 'Easy',
    warmUp: true,
    stretching: true,
    equipment: 'With Chair',
  });

  const levels = [
    { name: 'Easy', description: 'Improve fundamentals, balance and movement control' },
    { name: 'Advance', description: 'Refine technique with smooth and controlled combinations' },
    { name: 'Master', description: 'Train at the highest technical and physical level' },
  ];

  // Fetch exercises and load saved progress
  React.useEffect(() => {
    const fetchExercises = async () => {
      try {
        const programId = program?._id || program?.id;
        const url = programId
          ? `${API_CONFIG.BASE_URL}/programs/exercises/all?programId=${programId}`
          : `${API_CONFIG.BASE_URL}/programs/exercises/all`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === 'success') {
          const all = json.data.exercises || [];
          const grouped = { warmUp: [], training: [], stretching: [] };
          all.forEach(ex => {
            const section = ex.section;
            if (grouped[section]) {
              grouped[section].push({
                ...ex,
                image: ex.image ? getImageSource(ex.image) : null,
              });
            }
          });
          setApiExercises(grouped);
        }
        const saved = await AsyncStorage.getItem(programKey);
        if (saved) setCompletedLessons(parseInt(saved, 10) || 0);
      } catch (err) {
        console.log('Failed to fetch program exercises:', err.message);
      }
    };
    fetchExercises();
  }, [program?._id, program?.id, programKey]);

  const handleLessonCompleted = React.useCallback(async () => {
    setCompletedLessons(prev => {
      const next = Math.min(prev + 1, totalExerciseCount);
      AsyncStorage.setItem(programKey, String(next));
      return next;
    });
  }, [programKey, totalExerciseCount]);

  const totalExerciseCount =
    apiExercises.warmUp.length + apiExercises.training.length + apiExercises.stretching.length;

  const equipmentOptions = ['With Chair', 'No Chair'];

  const filterExercisesByEquipment = (list, equipment) =>
    list.filter(ex => {
      const eq = ex.equipment || 'all';
      if (equipment === 'With Chair') return eq === 'chair' || eq === 'all';
      if (equipment === 'No Chair') return eq === 'noChair' || eq === 'all';
      return true;
    });

  const filterExercisesByLevel = (list, level) =>
    list.filter(ex => !ex.level || ex.level === '' || ex.level === level);

  const getFilteredExercises = (section) => {
    const base = apiExercises[section] || [];
    const byLevel = filterExercisesByLevel(base, customization?.level || 'Easy');
    return filterExercisesByEquipment(byLevel, customization?.equipment || 'With Chair');
  };

  // Flatten all exercises for video player
  const allExercises = [];
  if (customization?.warmUp !== false) allExercises.push(...getFilteredExercises('warmUp'));
  allExercises.push(...getFilteredExercises('training'));
  if (customization?.stretching !== false) allExercises.push(...getFilteredExercises('stretching'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {selectedExercise ? (
        <ExerciseDetailScreen 
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
          customization={customization}
          onVideoCompleted={handleLessonCompleted}
        />
      ) : showExercises ? (
        <Modal
          visible={showExercises}
          transparent
          animationType="slide"
          onRequestClose={() => setShowExercises(false)}
        >
          <View style={styles.exercisesModalOverlay}>
            <TouchableOpacity 
              style={styles.exercisesModalBackdrop}
              activeOpacity={1}
              onPress={() => setShowExercises(false)}
            />
            
            <View style={styles.exercisesModalSheet}>
              <ProgramExercisesReviewScreen 
                onBack={() => setShowExercises(false)}
                customization={customization}
                programId={program?._id}
                onSelectExercise={(exercise) => {
                  setSelectedExercise(exercise);
                  setShowExercises(false);
                }}
              />
            </View>
          </View>
        </Modal>
      ) : showVideoPlayer ? (
        <ExerciseVideoPlayerScreen 
          exercises={allExercises}
          onBack={() => setShowVideoPlayer(false)}
          customization={customization}
          onExerciseCompleted={handleLessonCompleted}
        />
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
        </TouchableOpacity>

        {/* Card Section */}
        <View style={styles.cardContainer}>
          {getImageSource(program?.image) && (
            <Image
              source={getImageSource(program?.image)}
              style={styles.cardBgImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardOverlay} />

          <View style={styles.cardImage}>
            <View style={styles.cardContent}>
              <View style={styles.cardTextSection}>
                <Text style={styles.beltTitle}>{program?.title || ''}</Text>
                <Text style={styles.beltDescription}>
                  Master the techniques and combinations of {(program?.title || '').toLowerCase()}.
                </Text>
              </View>

              <View style={styles.cardProgressSection}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>
                    Lesson {completedLessons}/{totalExerciseCount}
                  </Text>
                  <Text style={styles.progressPercent}>
                    {totalExerciseCount > 0 ? Math.round((completedLessons / totalExerciseCount) * 100) : 0}% COMPLETE
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${totalExerciseCount > 0 ? Math.round((completedLessons / totalExerciseCount) * 100) : 0}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Level */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>LEVEL</Text>
            <Text style={styles.infoValue}>{customization.level}</Text>
          </View>
          <View style={styles.iconButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              activeOpacity={0.7}
              onPress={() => setShowCustomization(true)}
            >
              <Icon name="settings" size={24} color="#1f2937" type="MaterialIcons" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Review Exercises Button */}
        <TouchableOpacity style={styles.reviewButton} activeOpacity={0.8} onPress={() => setShowExercises(true)}>
          <Icon name="visibility" size={20} color="#1f2937" type="MaterialIcons" />
          <Text style={styles.reviewButtonText}>Review exercises</Text>
        </TouchableOpacity>

        {/* Start Training Button */}
        <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={() => setShowVideoPlayer(true)}>
          <Icon name="play-arrow" size={24} color="#fff" type="MaterialIcons" />
          <Text style={styles.startButtonText}>START TRAINING</Text>
        </TouchableOpacity>

        <View style={styles.footerSpace} />
      </ScrollView>
      )}

      {/* Customization Modal */}
      <Modal
        visible={showCustomization}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomization(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowCustomization(false)}
          />
          
          <View style={styles.modalBottomSheet}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Customize your training</Text>
              <TouchableOpacity 
                onPress={() => setShowCustomization(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Level and Warm-up/Stretching Row */}
              <View style={styles.customRow}>
                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowLevelPicker(true)}
                >
                  <Text style={styles.customLabel}>LEVEL</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.level}</Text>
                    <Icon name="chevron-right" size={16} color="#9ca3af" type="MaterialIcons" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Warm-up and Stretching Row */}
              <View style={styles.customRow}>
                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setCustomization({...customization, warmUp: !customization.warmUp})}
                >
                  <Text style={styles.customLabel}>WARM-UP</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.warmUp ? 'Yes' : 'No'}</Text>
                    <View style={[styles.toggle, customization.warmUp && styles.toggleActive]} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setCustomization({...customization, stretching: !customization.stretching})}
                >
                  <Text style={styles.customLabel}>STRETCHING</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.stretching ? 'Yes' : 'No'}</Text>
                    <View style={[styles.toggle, customization.stretching && styles.toggleActive]} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Equipment Full Width */}
              <TouchableOpacity 
                style={styles.customOption}
                activeOpacity={0.7}
                onPress={() => setShowEquipmentPicker(true)}
              >
                <Text style={styles.customLabel}>USE A CHAIR - RECOMMENDED</Text>
                <View style={styles.customValueRow}>
                  <Text style={styles.customValue}>{customization.equipment}</Text>
                  <Icon name="chevron-right" size={16} color="#9ca3af" type="MaterialIcons" />
                </View>
              </TouchableOpacity>

              <View style={styles.modalFooterSpace} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Level Picker Modal */}
      <Modal
        visible={showLevelPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLevelPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowLevelPicker(false)}
          />
          
          <View style={styles.levelPickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Change the difficulty</Text>
              <TouchableOpacity 
                onPress={() => setShowLevelPicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.levelPickerContent} showsVerticalScrollIndicator={false}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.name}
                  style={[
                    styles.levelOption,
                    customization.level === level.name && styles.levelOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setCustomization({ ...customization, level: level.name });
                    setShowLevelPicker(false);
                  }}
                >
                  <View>
                    <Text style={[
                      styles.levelName,
                      customization.level === level.name && styles.levelNameActive,
                    ]}>
                      {level.name}
                    </Text>
                    <Text style={[
                      styles.levelDescription,
                      customization.level === level.name && styles.levelDescriptionActive,
                    ]}>
                      {level.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Equipment Picker Modal */}
      <Modal
        visible={showEquipmentPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEquipmentPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowEquipmentPicker(false)}
          />
          
          <View style={styles.equipmentPickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Use a chair - Recommended</Text>
              <TouchableOpacity 
                onPress={() => setShowEquipmentPicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.equipmentPickerContent} showsVerticalScrollIndicator={false}>
              <View style={styles.equipmentGrid}>
                {equipmentOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.equipmentOption,
                      customization.equipment === option && styles.equipmentOptionActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setCustomization({ ...customization, equipment: option });
                      setShowEquipmentPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.equipmentText,
                      customization.equipment === option && styles.equipmentTextActive,
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    marginLeft: spacing.md,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  cardContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  cardBgImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  cardImageStyle: {
    borderRadius: 24,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 24,
  },
  cardContent: {
    zIndex: 1,
  },
  cardTextSection: {
    marginBottom: spacing.lg,
  },
  beltTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  beltDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
    lineHeight: 19,
  },
  beltCategory: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  cardProgressSection: {
    zIndex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressBar: {
    width: '100%',
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginTop: -12,
    marginBottom: spacing.md,
    borderRadius: 0,
  },
  infoItem: {
    flex: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
  },
  iconButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'flex-end',
    flex: 0,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  reviewButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  startSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  startTitle: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    marginHorizontal: spacing.lg,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
  },
  footerSpace: {
    height: spacing.xl,
  },
  exercisesModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  exercisesModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  exercisesModalSheet: {
    height: '80%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBottomSheet: {
    height: '50%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
  },
  customOption: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  customLabel: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  customValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '700',
  },
  customValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#d1d5db',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  customRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  modalFooterSpace: {
    height: spacing.xs,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  levelPickerSheet: {
    height: '65%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: spacing.sm,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
  },
  levelPickerContent: {
    flex: 1,
  },
  levelOption: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  levelOptionActive: {
    backgroundColor: '#1f2937',
  },
  levelName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  levelNameActive: {
    color: '#fff',
  },
  levelDescription: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 15,
  },
  levelDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  durationPickerSheet: {
    height: '70%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
  },
  durationPickerContent: {
    flex: 1,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  durationOption: {
    width: '48%',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationOptionActive: {
    backgroundColor: '#1f2937',
  },
  durationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  durationTextActive: {
    color: '#fff',
  },
  restTimePickerSheet: {
    height: '65%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
  },
  restTimePickerContent: {
    flex: 1,
  },
  restTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  restTimeOption: {
    width: '48%',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restTimeOptionActive: {
    backgroundColor: '#1f2937',
  },
  restTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  restTimeTextActive: {
    color: '#fff',
  },
  workTimePickerSheet: {
    height: '65%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
  },
  workTimePickerContent: {
    flex: 1,
  },
  workTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  workTimeOption: {
    width: '48%',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workTimeOptionActive: {
    backgroundColor: '#1f2937',
  },
  workTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  workTimeTextActive: {
    color: '#fff',
  },
  equipmentPickerSheet: {
    height: '45%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
  },
  equipmentPickerContent: {
    flex: 1,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  equipmentOption: {
    width: '48%',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentOptionActive: {
    backgroundColor: '#1f2937',
  },
  equipmentText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  equipmentTextActive: {
    color: '#fff',
  },
});

export default ProgramDetailScreen;
