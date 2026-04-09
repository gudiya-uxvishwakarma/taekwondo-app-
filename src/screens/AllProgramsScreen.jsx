import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/common/Icon';
import ProgramDetailScreen from './ProgramDetailScreen';
import API_CONFIG from '../config/api';

const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');

const getImageSource = (image) => {
  if (!image) return null;
  if (typeof image === 'object') return image;
  if (image.startsWith('http')) return { uri: image };
  return { uri: `${BASE_URL}/${image.replace(/^\//, '')}` };
};

const ProgramCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(item)}>
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <Text style={styles.programName}>{item.title}</Text>
        <Text style={styles.programLesson}>
          {item.completed > 0 ? `Lesson ${item.completed} / ${item.total}` : `${item.total} lessons`}
        </Text>

        <TouchableOpacity style={styles.startBtn} onPress={() => onPress(item)} activeOpacity={0.8}>
          <Icon name="play-arrow" size={16} color="#fff" type="MaterialIcons" />
          <Text style={styles.startBtnText}>{item.completed > 0 ? 'Continue' : 'Start'}</Text>
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${item.total > 0 ? (item.completed / item.total) * 100 : 0}%` }]} />
        </View>
      </View>

      <View style={styles.imageBox}>
        {item.imageSource ? (
          <Image source={item.imageSource} style={styles.programImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="fitness-center" size={36} color="#bbb" type="MaterialIcons" />
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const AllProgramsScreen = ({ onBack }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const [progRes, exRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/programs`),
        fetch(`${API_CONFIG.BASE_URL}/programs/exercises/all`),
      ]);
      const progJson = await progRes.json();
      const exJson = await exRes.json();

      const apiPrograms = progJson?.data?.programs || [];
      const allExercises = exJson?.data?.exercises || [];

      const mapped = await Promise.all(apiPrograms.map(async (p) => {
        const total = allExercises.filter(ex => ex.programId === p._id || ex.programTitle === p.title).length;
        const saved = await AsyncStorage.getItem(`program_progress_${p._id}`);
        const completed = saved ? parseInt(saved, 10) || 0 : 0;
        return {
          ...p,
          total,
          completed,
          imageSource: p.image ? getImageSource(p.image) : null,
        };
      }));

      setPrograms(mapped);
    } catch (err) {
      console.log('Failed to fetch programs:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  if (selectedProgram) {
    return (
      <ProgramDetailScreen
        program={selectedProgram}
        onBack={() => { setSelectedProgram(null); fetchPrograms(); }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back" size={22} color="#1a1a1a" type="MaterialIcons" />
        </TouchableOpacity>
      </View>
      <Text style={styles.pageTitle}>Programs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a1a1a" style={{ marginTop: 40 }} />
      ) : programs.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="fitness-center" size={56} color="#ccc" type="MaterialIcons" />
          <Text style={styles.emptyTitle}>No programs yet</Text>
          <Text style={styles.emptySubtitle}>Add programs from the admin panel</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPrograms}>
            <Text style={styles.retryBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {programs.map((item) => (
            <ProgramCard key={item._id} item={item} onPress={setSelectedProgram} />
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32, fontWeight: '800', color: '#1a1a1a',
    paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, gap: 14 },

  card: {
    borderRadius: 20, overflow: 'hidden',
    paddingHorizontal: 20, paddingVertical: 20,
    minHeight: 130, backgroundColor: '#e4e8ee',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flex: 1, paddingRight: 12 },
  programName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  programLesson: { fontSize: 13, color: '#555', marginBottom: 10 },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1a1a1a', borderRadius: 30,
    paddingVertical: 10, paddingHorizontal: 20,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  progressTrack: {
    height: 4, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 2, width: '85%',
  },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: '#1a1a1a' },

  imageBox: { width: 110, height: 110, borderRadius: 12, overflow: 'hidden' },
  programImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%', height: '100%', backgroundColor: '#d0d4da',
    justifyContent: 'center', alignItems: 'center', borderRadius: 12,
  },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#555' },
  emptySubtitle: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: '#1a1a1a', borderRadius: 20,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default AllProgramsScreen;
