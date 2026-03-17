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
  Modal,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import ExercisesReviewScreen from './ExercisesReviewScreen';
import ExerciseDetailScreen from './ExerciseDetailScreen';
import ExerciseVideoPlayerScreen from './ExerciseVideoPlayerScreen';

const BeltDetailScreen = ({ belt, onBack }) => {
  const [showCustomization, setShowCustomization] = React.useState(false);
  const [showLevelPicker, setShowLevelPicker] = React.useState(false);
  const [showDurationPicker, setShowDurationPicker] = React.useState(false);
  const [showRestTimePicker, setShowRestTimePicker] = React.useState(false);
  const [showWorkTimePicker, setShowWorkTimePicker] = React.useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = React.useState(false);
  const [showExercises, setShowExercises] = React.useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [customization, setCustomization] = React.useState({
    level: 'Easy',
    duration: '20 min',
    warmUp: true,
    stretching: true,
    restTime: '10 sec',
    workTime: '25 sec',
    equipment: 'With Chair',
  });

  const levels = [
    { name: 'Easy', description: 'Improve fundamentals, balance and movement control' },
    { name: 'Normal', description: 'Refine technique with smooth and controlled combinations' },
    { name: 'Advanced', description: 'Push technique to a higher performance level' },
    { name: 'Expert', description: 'Master advanced combinations and fight rhythm' },
    { name: 'Master', description: 'Train at the highest technical and physical level' },
  ];

  const durations = ['5 min', '8 min', '10 min', '12 min', '15 min', '18 min', '20 min', '25 min', '30 min', '40 min', '45 min', '60 min'];

  const restTimes = ['No rest', '5 sec', '10 sec', '15 sec', '20 sec', '30 sec', '40 sec', '45 sec', '60 sec'];

  const workTimes = ['10 sec', '15 sec', '20 sec', '25 sec', '30 sec', '40 sec', '45 sec', '60 sec', '90 sec', '120 sec'];

  const equipmentOptions = ['With Chair', 'No Chair'];

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {selectedExercise ? (
        <ExerciseDetailScreen 
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
          customization={customization}
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
              <ExercisesReviewScreen 
                onBack={() => setShowExercises(false)}
                customization={customization}
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
        />
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
        </TouchableOpacity>

        {/* Card Section */}
        <View style={styles.cardContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
          >
            <View style={styles.cardOverlay} />
            
            <View style={styles.cardContent}>
              <View style={styles.cardTextSection}>
                <Text style={styles.beltTitle}>{belt.belt}</Text>
                <Text style={styles.beltDescription}>
                  Fundamentals, balance and basic techniques.
                </Text>
                <Text style={styles.beltCategory}>fundamentals</Text>
              </View>

              <View style={styles.cardProgressSection}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Lesson 1 / {belt.lessons}</Text>
                  <Text style={styles.progressPercent}>0% COMPLETE</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${belt.progress}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Duration and Level */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>DURATION</Text>
            <Text style={styles.infoValue}>{customization.duration}</Text>
          </View>
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
              {/* Level and Duration Row */}
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

                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowDurationPicker(true)}
                >
                  <Text style={styles.customLabel}>DURATION</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.duration}</Text>
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

              {/* Rest Time and Work Time Row */}
              <View style={styles.customRow}>
                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowRestTimePicker(true)}
                >
                  <Text style={styles.customLabel}>REST TIME</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.restTime}</Text>
                    <Icon name="chevron-right" size={16} color="#9ca3af" type="MaterialIcons" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.customOption, { flex: 1 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowWorkTimePicker(true)}
                >
                  <Text style={styles.customLabel}>WORK TIME</Text>
                  <View style={styles.customValueRow}>
                    <Text style={styles.customValue}>{customization.workTime}</Text>
                    <Icon name="chevron-right" size={16} color="#9ca3af" type="MaterialIcons" />
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

      {/* Duration Picker Modal */}
      <Modal
        visible={showDurationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDurationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowDurationPicker(false)}
          />
          
          <View style={styles.durationPickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Change your workout duration</Text>
              <TouchableOpacity 
                onPress={() => setShowDurationPicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.durationPickerContent} showsVerticalScrollIndicator={false}>
              <View style={styles.durationGrid}>
                {durations.map((duration, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.durationOption,
                      customization.duration === duration && styles.durationOptionActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setCustomization({ ...customization, duration });
                      setShowDurationPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.durationText,
                      customization.duration === duration && styles.durationTextActive,
                    ]}>
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Rest Time Picker Modal */}
      <Modal
        visible={showRestTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRestTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowRestTimePicker(false)}
          />
          
          <View style={styles.restTimePickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Change your rest time between each exercise</Text>
              <TouchableOpacity 
                onPress={() => setShowRestTimePicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.restTimePickerContent} showsVerticalScrollIndicator={false}>
              <View style={styles.restTimeGrid}>
                {restTimes.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.restTimeOption,
                      customization.restTime === time && styles.restTimeOptionActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setCustomization({ ...customization, restTime: time });
                      setShowRestTimePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.restTimeText,
                      customization.restTime === time && styles.restTimeTextActive,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Work Time Picker Modal */}
      <Modal
        visible={showWorkTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWorkTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowWorkTimePicker(false)}
          />
          
          <View style={styles.workTimePickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Choose the duration for each exercise</Text>
              <TouchableOpacity 
                onPress={() => setShowWorkTimePicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.workTimePickerContent} showsVerticalScrollIndicator={false}>
              <View style={styles.workTimeGrid}>
                {workTimes.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.workTimeOption,
                      customization.workTime === time && styles.workTimeOptionActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setCustomization({ ...customization, workTime: time });
                      setShowWorkTimePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.workTimeText,
                      customization.workTime === time && styles.workTimeTextActive,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
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

export default BeltDetailScreen;
