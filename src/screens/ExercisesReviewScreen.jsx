import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ImageBackground, ActivityIndicator,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const SECTION_LABELS = { warmUp: 'Warm-Up', training: 'Training', stretching: 'Stretching' };

const ExercisesReviewScreen = ({ onBack, customization, beltName, onSelectExercise }) => {
  const [exercises, setExercises] = React.useState({ warmUp: [], training: [], stretching: [] });
  const [loading, setLoading] = React.useState(true);

  const selectedLevel = customization?.level || 'Easy';
  const selectedEquipment = customization?.equipment || 'With Chair';

  React.useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const base = API_CONFIG.BASE_URL;
        const serverBase = base.replace('/api', '');
        const res = await fetch(`${base}/exercises`);
        const json = await res.json();
        const list = json?.data?.exercises || [];

        // Filter by belt, level and equipment
        const filtered = list.filter(ex => {
          const beltMatch = !beltName || !ex.beltName || ex.beltName === beltName;
          // If exercise has no level set, show it for all levels
          const levelMatch = !ex.level || ex.level === '' || ex.level === selectedLevel;
          const eqVal = ex.equipment || 'all';
          const eqMatch =
            selectedEquipment === 'With Chair'
              ? eqVal === 'chair' || eqVal === 'all'
              : eqVal === 'noChair' || eqVal === 'all';
          return beltMatch && levelMatch && eqMatch;
        });

        // Group by section
        const grouped = { warmUp: [], training: [], stretching: [] };
        filtered.forEach((ex, i) => {
          const section = ex.section || 'training';
          if (grouped[section]) {
            grouped[section].push({
              id: ex._id || i,
              _id: ex._id,
              name: ex.name,
              level: ex.level || selectedLevel,
              section: ex.section,
              equipment: ex.equipment,
              duration: ex.duration,
              beltName: ex.beltName || '',
              steps: ex.steps || [],
              tips: ex.tips || [],
              videoUrl: ex.videoUrl || null,
              image: ex.image
                ? { uri: ex.image.startsWith('http') ? ex.image : `${serverBase}/${ex.image}` }
                : { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
            });
          }
        });
        setExercises(grouped);
      } catch (_) {
        // keep empty
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [selectedLevel, selectedEquipment, beltName]);

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
              No exercises have been added for {beltName ? `"${beltName}"` : 'this belt'} at {selectedLevel} level yet.
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
                {list.map(exercise => (
                  <TouchableOpacity
                    key={exercise.id}
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
                      <Text style={styles.exerciseLevel}>{exercise.level}</Text>
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
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: spacing.xs },
  exerciseLevel: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  footerSpace: { height: spacing.md },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
});

export default ExercisesReviewScreen;
