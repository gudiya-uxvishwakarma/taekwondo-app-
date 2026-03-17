import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import QuickWorkoutTrainingScreen from './QuickWorkoutTrainingScreen';

const QuickWorkoutScreen = ({ onBack }) => {
  const [selectedProgram, setSelectedProgram] = useState({
    id: 'p2',
    title: 'Kicks Mastery',
    description: 'unlock the secrets to perfecting your kicks',
    duration: 25,
    type: 'program',
  });
  const [showSelector, setShowSelector] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showRestTimePicker, setShowRestTimePicker] = useState(false);
  const [showWorkTimePicker, setShowWorkTimePicker] = useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [showKicks, setShowKicks] = useState(false);
  const [customization, setCustomization] = useState({
    level: 'Easy',
    duration: '5 min',
    warmUp: true,
    stretching: true,
    restTime: '10 sec',
    workTime: '20 sec',
    equipment: 'No Chair',
  });

  // Animation for rotating blue dot
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 360,
        duration: 8000, // 8 seconds for full rotation
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotationAnim]);

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

  // Fixed background image
  const BACKGROUND_IMAGE = { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=500&fit=crop' };

  const belts = [
    {
      id: 'b1',
      title: 'White Belt',
      lessons: '30',
      duration: 20,
      type: 'belt',
    },
    {
      id: 'b2',
      title: 'Yellow Belt',
      lessons: '30',
      duration: 20,
      type: 'belt',
    },
    {
      id: 'b3',
      title: 'Green Belt',
      lessons: '30',
      duration: 25,
      type: 'belt',
    },
    {
      id: 'b4',
      title: 'Blue Belt',
      lessons: '30',
      duration: 25,
      type: 'belt',
    },
    {
      id: 'b5',
      title: 'Red Belt',
      lessons: '30',
      duration: 25,
      type: 'belt',
    },
    {
      id: 'b6',
      title: 'Black Belt',
      lessons: '30',
      duration: 30,
      type: 'belt',
    },
  ];

  const programs = [
    {
      id: 'p1',
      title: 'Basic Kicks',
      lessons: '20',
      duration: 20,
      type: 'program',
    },
    {
      id: 'p2',
      title: 'Kicks Mastery',
      lessons: '20',
      duration: 25,
      type: 'program',
    },
    {
      id: 'p3',
      title: 'Expert Kicks',
      lessons: '20',
      duration: 30,
      type: 'program',
    },
    {
      id: 'p4',
      title: 'Explosive Kicks',
      lessons: '18',
      duration: 28,
      type: 'program',
    },
    {
      id: 'p5',
      title: 'Combo Junkies',
      lessons: '20',
      duration: 15,
      type: 'program',
    },
    {
      id: 'p6',
      title: 'Punches & Blocks',
      lessons: '30',
      duration: 20,
      type: 'program',
    },
    {
      id: 'p7',
      title: 'Lightning Speed',
      lessons: '25',
      duration: 22,
      type: 'program',
    },
    {
      id: 'p8',
      title: 'Flexibility Training',
      lessons: '15',
      duration: 20,
      type: 'program',
    },
    {
      id: 'p9',
      title: 'Recovery Routine',
      lessons: '10',
      duration: 15,
      type: 'program',
    },
    {
      id: 'p10',
      title: 'Cool Down',
      lessons: '8',
      duration: 10,
      type: 'program',
    },
  ];

  const allPrograms = [...belts, ...programs];

  const getProgressRotation = (duration) => {
    // Parse duration string to get minutes
    const match = duration?.match(/(\d+)/);
    if (!match) return 0;
    const minutes = parseInt(match[1]);
    // Calculate rotation based on duration (max 60 minutes = 360 degrees)
    return (minutes / 60) * 360;
  };

  // Show training screen
  if (showTraining) {
    return (
      <QuickWorkoutTrainingScreen 
        program={selectedProgram}
        customization={customization}
        onBack={() => setShowTraining(false)}
        onBackToDashboard={onBack}
      />
    );
  }

  if (showSelector) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerBackButton} 
            onPress={() => setShowSelector(false)}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose your program</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Belts Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>BELTS</Text>
            {belts.map((belt) => (
              <TouchableOpacity
                key={belt.id}
                style={[
                  styles.programCard,
                  selectedProgram.id === belt.id && styles.programCardSelected
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedProgram(belt);
                  setShowSelector(false);
                }}
              >
                <Text style={[
                  styles.programTitle,
                  selectedProgram.id === belt.id && styles.programTitleSelected
                ]}>
                  {belt.title}
                </Text>
                <Text style={[
                  styles.programMeta,
                  selectedProgram.id === belt.id && styles.programMetaSelected
                ]}>
                  {belt.lessons} lessons • {belt.duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Programs Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>PROGRAMS</Text>
            {programs.map((program) => (
              <TouchableOpacity
                key={program.id}
                style={[
                  styles.programCard,
                  selectedProgram.id === program.id && styles.programCardSelected
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedProgram(program);
                  setShowSelector(false);
                }}
              >
                <Text style={[
                  styles.programTitle,
                  selectedProgram.id === program.id && styles.programTitleSelected
                ]}>
                  {program.title}
                </Text>
                <Text style={[
                  styles.programMeta,
                  selectedProgram.id === program.id && styles.programMetaSelected
                ]}>
                  {program.lessons} lessons • {program.duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSpace} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onBack}>
            <Icon name="home" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="schedule" size={28} color={colors.primary} type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="menu" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="person" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Workout Start Screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.workoutContainer}
        imageStyle={styles.containerImage}
      >
        <View style={styles.overlay} />

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <ScrollView style={styles.workoutContent} showsVerticalScrollIndicator={false}>
          {/* Timer Circle */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              {/* Background Circle */}
              <View style={styles.timerBackground} />
              
              {/* Progress Indicator - Blue dot that rotates */}
              <Animated.View 
                style={[
                  styles.timerProgressDot,
                  { 
                    transform: [{ 
                      rotate: rotationAnim.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }
                ]}
              />
              
              {/* Center Content */}
              <View style={styles.timerInner}>
                <Text style={styles.timerNumber}>{customization.duration.match(/\d+/)[0]}</Text>
                <Text style={styles.timerLabel}>minutes</Text>
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>Let's start a quick workout</Text>
            <Text style={styles.title}>{selectedProgram.title}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.outlineButton}
              activeOpacity={0.7}
              onPress={() => setShowSelector(true)}
            >
              <Text style={styles.outlineButtonText}>Change program</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.outlineButton} 
              activeOpacity={0.7}
              onPress={() => setShowCustomization(true)}
            >
              <Text style={styles.outlineButtonText}>Options</Text>
            </TouchableOpacity>
          </View>

          {/* Start Training Button */}
          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.8}
            onPress={() => setShowTraining(true)}
          >
            <Text style={styles.startButtonText}>START TRAINING</Text>
            <Icon name="play-arrow" size={20} color="#1f2937" type="MaterialIcons" />
          </TouchableOpacity>

          <View style={styles.footerSpace} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onBack}>
            <Icon name="home" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="schedule" size={28} color={colors.primary} type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="menu" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Icon name="person" size={28} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9ca3af',
    marginBottom: spacing.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  programCard: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  programCardSelected: {
    backgroundColor: '#1f2937',
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  programTitleSelected: {
    color: '#fff',
  },
  programMeta: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  programMetaSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  programTitleLight: {
    color: '#1f2937',
  },
  programDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    lineHeight: 18,
  },
  programDescriptionLight: {
    color: '#6b7280',
  },
  workoutContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  containerImage: {
    borderRadius: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  workoutContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginLeft: spacing.md,
    alignSelf: 'flex-start',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  timerBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timerProgressDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#006CB5',
    top: 0,
    left: '50%',
    marginLeft: -8,
    marginTop: -8,
  },
  timerInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  timerNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  titleSection: {
    marginVertical: spacing.xl,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginRight: spacing.sm,
    letterSpacing: 0.5,
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
  footerSpace: {
    height: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBottomSheet: {
    height: '50%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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

export default QuickWorkoutScreen;
