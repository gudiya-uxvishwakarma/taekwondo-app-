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
  ActivityIndicator,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import QuickWorkoutExerciseDetailScreen from './QuickWorkoutExerciseDetailScreen';
import API_CONFIG from '../config/api';

const QuickWorkoutTrainingScreen = ({ program, customization, onBack, onBackToDashboard }) => {
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [exercises, setExercises] = React.useState({ warmUp: [], training: [], stretching: [] });
  const [loading, setLoading] = React.useState(true);

  const serverBase = API_CONFIG.BASE_URL.replace('/api', '');

  const getImageSource = (img) => {
    if (!img) return { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' };
    return { uri: img.startsWith('http') ? img : `${serverBase}/${img}` };
  };

  React.useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const selectedLevel = customization?.level || 'Easy';
        const selectedEquipment = customization?.equipment || 'No Chair';

        let all = [];

        if (program?.type === 'belt') {
          // Fetch belt exercises
          const res = await fetch(`${API_CONFIG.BASE_URL}/exercises`);
          const json = await res.json();
          const beltName = program?.title || '';
          all = (json?.data?.exercises || []).filter(
            ex => !ex.beltName || ex.beltName === beltName
          );
        } else {
          // Fetch program exercises
          const programId = program?._id;
          const url = programId
            ? `${API_CONFIG.BASE_URL}/programs/exercises/all?programId=${programId}`
            : `${API_CONFIG.BASE_URL}/programs/exercises/all`;
          const res = await fetch(url);
          const json = await res.json();
          all = json?.data?.exercises || [];
        }

        // Filter by level and equipment
        const filtered = all.filter(ex => {
          const levelMatch = !ex.level || ex.level === '' || ex.level === selectedLevel;
          const eq = ex.equipment || 'all';
          const eqMatch = selectedEquipment === 'With Chair'
            ? eq === 'chair' || eq === 'all'
            : eq === 'noChair' || eq === 'all';
          return levelMatch && eqMatch;
        });

        // Group by section
        const grouped = { warmUp: [], training: [], stretching: [] };
        filtered.forEach(ex => {
          const section = ex.section || 'training';
          if (grouped[section]) {
            grouped[section].push({
              ...ex,
              image: getImageSource(ex.image),
              videoUrl: ex.videoUrl
                ? (ex.videoUrl.startsWith('http') ? ex.videoUrl : `${serverBase}/${ex.videoUrl}`)
                : null,
            });
          }
        });

        setExercises(grouped);
      } catch (err) {
        console.log('Failed to fetch exercises:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [program?._id, program?.title, customization?.level, customization?.equipment]);

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

  const renderExerciseItem = (exercise, index) => (
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
        <Text style={styles.exerciseLevel}>{customization?.level || 'Easy'}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      <ImageBackground
        source={program?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
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
          <Text style={styles.headerSubtitle}>
            {program?.type === 'belt' ? 'Belt Training' : 'Program Training'}
          </Text>
          <Text style={styles.headerTitle}>{program?.title}</Text>
          <Text style={styles.headerMeta}>{customization?.level || 'Easy'}</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#1f2937" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Warm-Up Section */}
            {customization?.warmUp !== false && exercises.warmUp.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Warm-Up</Text>
                  <Text style={styles.sectionCount}>{exercises.warmUp.length} exercises</Text>
                </View>
                {exercises.warmUp.map(renderExerciseItem)}
              </View>
            )}

            {/* Training Section */}
            {exercises.training.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Training</Text>
                  <Text style={styles.sectionCount}>{exercises.training.length} exercises</Text>
                </View>
                {exercises.training.map(renderExerciseItem)}
              </View>
            )}

            {/* Stretching Section */}
            {customization?.stretching !== false && exercises.stretching.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Stretching</Text>
                  <Text style={styles.sectionCount}>{exercises.stretching.length} exercises</Text>
                </View>
                {exercises.stretching.map(renderExerciseItem)}
              </View>
            )}

            {!loading && exercises.warmUp.length === 0 && exercises.training.length === 0 && exercises.stretching.length === 0 && (
              <Text style={styles.emptyText}>No exercises found for the selected options.</Text>
            )}
          </>
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
    height: 260,
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
  exerciseLevel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  footerSpace: {
    height: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 40,
  },
});

export default QuickWorkoutTrainingScreen;
