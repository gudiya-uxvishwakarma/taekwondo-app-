import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../components/common/Icon';
import BeltDetailScreen from './BeltDetailScreen';
import API_CONFIG from '../config/api';

const BeltCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress(item)}>
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <Text style={styles.beltName}>{item.belt}</Text>
        <Text style={styles.beltLesson}>
          {item.completed > 0 ? `Lesson ${item.completed} / ${item.total}` : `${item.total} lessons`}
        </Text>

        {item.completed > 0 && (
          <TouchableOpacity style={styles.continueBtn} onPress={() => onPress(item)} activeOpacity={0.8}>
            <Icon name="play-arrow" size={16} color="#fff" type="MaterialIcons" />
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        )}

        {item.completed === 0 && (
          <TouchableOpacity style={styles.continueBtn} onPress={() => onPress(item)} activeOpacity={0.8}>
            <Icon name="play-arrow" size={16} color="#fff" type="MaterialIcons" />
            <Text style={styles.continueBtnText}>Start</Text>
          </TouchableOpacity>
        )}

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(item.progress || 0) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.imageBox}>
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri, cache: 'reload' }}
            style={styles.beltImage}
            resizeMode="cover"
            onError={(e) => console.log('Belt image error:', item.imageUri, e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="sports-kabaddi" size={36} color="#bbb" type="MaterialIcons" />
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const AllBeltsScreen = ({ onBack }) => {
  const [selectedBelt, setSelectedBelt] = React.useState(null);
  const [belts, setBelts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState('');

  const fetchBelts = React.useCallback(async () => {
    try {
      setLoading(true);
      setFetchError('');
      const baseUrl = API_CONFIG.BASE_URL;
      const serverBase = baseUrl.replace('/api', '');

      // Fetch belts and exercises in parallel
      const [beltRes, exRes] = await Promise.all([
        fetch(`${baseUrl}/belt-content`),
        fetch(`${baseUrl}/exercises`),
      ]);
      const beltJson = await beltRes.json();
      const exJson = await exRes.json();

      const apiData = beltJson?.data?.belts || [];
      const allExercises = exJson?.data?.exercises || [];

      const mapped = await Promise.all(apiData.map(async (b, i) => {
        const beltName = b.beltName;
        const total = allExercises.filter(ex => !ex.beltName || ex.beltName === beltName).length;
        const saved = await AsyncStorage.getItem(`belt_progress_${beltName}`);
        const completed = saved ? parseInt(saved, 10) || 0 : 0;
        const progress = total > 0 ? completed / total : 0;

        return {
          id: b._id || i + 1,
          belt: beltName,
          total,
          completed,
          progress,
          imageUri: b.image
            ? (b.image.startsWith('http') ? b.image : `${serverBase}/${b.image}`)
            : null,
        };
      }));

      console.log('🥋 Belts:', JSON.stringify(mapped.map(b => ({ belt: b.belt, imageUri: b.imageUri }))));
      setBelts(mapped);
    } catch (err) {
      setFetchError(err.message || 'Network error');
      setBelts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchBelts(); }, [fetchBelts]);

  if (selectedBelt) {
    return <BeltDetailScreen belt={selectedBelt} onBack={() => { setSelectedBelt(null); fetchBelts(); }} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back" size={22} color="#1a1a1a" type="MaterialIcons" />
        </TouchableOpacity>
      </View>
      <Text style={styles.pageTitle}>Belts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a1a1a" style={{ marginTop: 40 }} />
      ) : fetchError ? (
        <View style={styles.empty}>
          <Icon name="wifi-off" size={56} color="#ccc" type="MaterialIcons" />
          <Text style={styles.emptyTitle}>Connection failed</Text>
          <Text style={styles.emptySubtitle}>{fetchError}</Text>
          <Text style={styles.emptySubtitle}>URL: {API_CONFIG.BASE_URL}/belt-content</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchBelts}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : belts.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="sports-kabaddi" size={56} color="#ccc" type="MaterialIcons" />
          <Text style={styles.emptyTitle}>No belts added yet</Text>
          <Text style={styles.emptySubtitle}>Add belts from the admin panel to see them here</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchBelts}>
            <Text style={styles.retryBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {belts.map((item) => (
            <BeltCard key={item.id} item={item} onPress={setSelectedBelt} />
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
  beltName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  beltLesson: { fontSize: 13, color: '#555', marginBottom: 10 },

  continueBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1a1a1a', borderRadius: 30,
    paddingVertical: 10, paddingHorizontal: 20,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  progressTrack: {
    height: 4, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 2, width: '85%',
  },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: '#1a1a1a' },

  imageBox: { width: 110, height: 110, borderRadius: 12, overflow: 'hidden' },
  beltImage: { width: '100%', height: '100%' },
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

export default AllBeltsScreen;
