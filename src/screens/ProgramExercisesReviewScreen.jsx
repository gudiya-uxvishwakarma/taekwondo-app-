import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ImageBackground, ActivityIndicator,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
const SECTION_LABELS = { warmUp: 'Warm-Up', training: 'Training', stretching: 'Stretching' };

const getImageSource = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return { uri: image };
  return { uri: `${BASE_URL}/${image.replace(/^\//, '')}` };
};

const ProgramExercisesReviewScreen = ({ onBack, customization, onSelectExercise, programId }) => {
  const [exercises, setExercises] = React.useState({ warmUp: [], training: [], stretching: [] });
  const [loading, setLoading] = React.useState(true);

  const selectedLevel = customization?.level || 'Easy';
  const selectedEquipment = customization?.equipment || 'With Chair';

  React.useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const url = programId
          ? `${API_CONFIG.BASE_URL}/programs/exercises/all?programId=${programId}`
          : `${API_CONFIG.BASE_URL}/programs/exercises/all`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === 'success') {
          const all = json.data.exercises || [];

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
                image: ex.image ? getImageSource(ex.image) : null,
                videoUrl: ex.videoUrl
                  ? (ex.videoUrl.startsWith('http') ? ex.videoUrl : `${BASE_URL}/${ex.videoUrl}`)
                  : null,
              });
            }
          });
          setExercises(grouped);
        }
      } catch (err) {
        console.log('Failed to fetch program exercises:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [programId, selectedLevel, selectedEquipment]);

  const visibleSections = [];
  if (customization?.warmUp !== false) visibleSections.push('warmUp');
  visibleSections.push('training');
  if (customization?.stretching !== false) visibleSections.push('stretching');

  return (
    <View style={styles.modalContent}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.modalTitle}>Your training • {selectedLevel}</Text>
          </View>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#006CB5" style={{ marginTop: 40 }} />
        ) : visibleSections.every(s => (exercises[s] || []).length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptySubtitle}>
              No exercises have been added for this program at {selectedLevel} level yet.
            </Text>
          </View>
        ) : (
          visibleSections.map(sectionKey => {
            const list = exercises[sectionKey] || [];
            if (list.length === 0) return null;
            return (
              <View key={sectionKey} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{SECTION_LABELS[sectionKey]}</Text>
                  <Text style={styles.sectionCount}>{list.length} exercises</Text>
                </View>
                {list.map((exercise, idx) => (
                  <TouchableOpacity
                    key={exercise._id || idx}
                    style={styles.exerciseCard}
                    activeOpacity={0.7}
                    onPress={() => onSelectExercise(exercise)}
                  >
                    {exercise.image ? (
                      <ImageBackground
                        source={exercise.image}
                        style={styles.exerciseImage}
                        imageStyle={styles.exerciseImageStyle}
                      >
                        <View style={styles.exerciseImageOverlay} />
                      </ImageBackground>
                    ) : (
                      <View style={[styles.exerciseImage, styles.exerciseImagePlaceholder]}>
                        <Icon name="fitness-center" size={24} color="#9ca3af" type="MaterialIcons" />
                      </View>
                    )}
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseLevel}>{exercise.level || selectedLevel}</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#9ca3af" type="MaterialIcons" />
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        )}

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { flex: 1, paddingHorizontal: spacing.md },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md, marginBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingHorizontal: spacing.md,
  },
  headerLeft: { flex: 1 },
  modalTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  section: { marginBottom: spacing.md },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937' },
  sectionCount: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  exerciseCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  exerciseImage: { width: 65, height: 65, borderRadius: 12, overflow: 'hidden', marginRight: spacing.md },
  exerciseImageStyle: { borderRadius: 12 },
  exerciseImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  exerciseImagePlaceholder: { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: spacing.xs },
  exerciseLevel: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  footerSpace: { height: spacing.md },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
});

export default ProgramExercisesReviewScreen;
