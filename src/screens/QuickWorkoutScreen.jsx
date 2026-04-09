import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import QuickWorkoutTrainingScreen from './QuickWorkoutTrainingScreen';
import API_CONFIG from '../config/api';

const QuickWorkoutScreen = ({ onBack }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [belts, setBelts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingSelector, setLoadingSelector] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [customization, setCustomization] = useState({
    level: 'Easy',
    warmUp: true,
    stretching: true,
    equipment: 'With Chair',
  });

  const serverBase = API_CONFIG.BASE_URL.replace('/api', '');

  const getImageSource = (img) => {
    if (!img) return { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=500&fit=crop' };
    return { uri: img.startsWith('http') ? img : `${serverBase}/${img}` };
  };

  // Fetch belts and programs when selector opens
  useEffect(() => {
    if (!showSelector) return;
    const fetchData = async () => {
      try {
        setLoadingSelector(true);
        const [beltRes, progRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/belt-content`),
          fetch(`${API_CONFIG.BASE_URL}/programs`),
        ]);
        const beltJson = await beltRes.json();
        const progJson = await progRes.json();

        const mappedBelts = (beltJson?.data?.belts || []).map((b) => ({
          _id: b._id,
          title: b.beltName,
          type: 'belt',
          image: getImageSource(b.image),
        }));

        const mappedPrograms = (progJson?.data?.programs || []).map((p) => ({
          _id: p._id,
          title: p.title,
          type: 'program',
          image: getImageSource(p.image),
        }));

        setBelts(mappedBelts);
        setPrograms(mappedPrograms);

        // Auto-select first item if nothing selected yet
        if (!selectedProgram && mappedPrograms.length > 0) {
          setSelectedProgram(mappedPrograms[0]);
        }
      } catch (err) {
        console.log('Failed to fetch belts/programs:', err.message);
      } finally {
        setLoadingSelector(false);
      }
    };
    fetchData();
  }, [showSelector]);

  const levels = [
    { name: 'Easy', description: 'Improve fundamentals, balance and movement control' },
    { name: 'Advance', description: 'Refine technique with smooth and controlled combinations' },
    { name: 'Master', description: 'Train at the highest technical and physical level' },
  ];

  const equipmentOptions = ['With Chair', 'No Chair'];

  const BACKGROUND_IMAGE = selectedProgram?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=500&fit=crop' };

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
          {loadingSelector ? (
            <ActivityIndicator size="large" color="#1f2937" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Belts Section */}
              {belts.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>BELTS</Text>
                  {belts.map((belt) => (
                    <TouchableOpacity
                      key={belt._id}
                      style={[
                        styles.programCard,
                        selectedProgram?._id === belt._id && styles.programCardSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => { setSelectedProgram(belt); setShowSelector(false); }}
                    >
                      <Text style={[styles.programTitle, selectedProgram?._id === belt._id && styles.programTitleSelected]}>
                        {belt.title}
                      </Text>
                      <Text style={[styles.programMeta, selectedProgram?._id === belt._id && styles.programMetaSelected]}>
                        Belt Training
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Programs Section */}
              {programs.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>PROGRAMS</Text>
                  {programs.map((program) => (
                    <TouchableOpacity
                      key={program._id}
                      style={[
                        styles.programCard,
                        selectedProgram?._id === program._id && styles.programCardSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => { setSelectedProgram(program); setShowSelector(false); }}
                    >
                      <Text style={[styles.programTitle, selectedProgram?._id === program._id && styles.programTitleSelected]}>
                        {program.title}
                      </Text>
                      <Text style={[styles.programMeta, selectedProgram?._id === program._id && styles.programMetaSelected]}>
                        Program
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
          <View style={styles.footerSpace} />
        </ScrollView>

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

        <ScrollView 
          style={styles.workoutContent} 
          contentContainerStyle={styles.workoutContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.subtitle}>Let's start a quick workout</Text>
            <Text style={styles.title}>{selectedProgram?.title || 'Select a program'}</Text>
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
            style={[styles.startButton, !selectedProgram && styles.startButtonDisabled]} 
            activeOpacity={0.8}
            onPress={() => selectedProgram && setShowTraining(true)}
          >
            <Text style={styles.startButtonText}>START TRAINING</Text>
            <Icon name="play-arrow" size={20} color="#1f2937" type="MaterialIcons" />
          </TouchableOpacity>

          <View style={styles.footerSpace} />
        </ScrollView>

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
              {/* Level Row */}
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
  workoutContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
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
  startButtonDisabled: {
    opacity: 0.5,
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
