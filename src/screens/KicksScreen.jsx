import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import TechniqueDetailScreen from './TechniqueDetailScreen';
import axios from 'axios';
import API_CONFIG from '../config/api';

const FALLBACK_CATEGORIES = [
  { _id: '1', name: 'Kicks' },
  { _id: '2', name: 'Jump Kicks' },
  { _id: '3', name: 'Kicks with chair' },
  { _id: '4', name: 'Punches' },
];

const KicksScreen = ({ onBack, onVideoWatch }) => {
  const [categories, setCategories] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const urlsToTry = [API_CONFIG.BASE_URL, ...(API_CONFIG.FALLBACK_URLS || [])].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    for (const baseUrl of urlsToTry) {
      try {
        const [catRes, techRes] = await Promise.all([
          axios.get(`${baseUrl}/techniques/categories`, { timeout: 8000 }),
          axios.get(`${baseUrl}/techniques`, { timeout: 8000 }),
        ]);
        // Server responded — use its data (even if empty)
        const cats = catRes.data || [];
        const techs = techRes.data || [];
        setCategories(cats);
        setTechniques(techs);
        setSelectedCategory(cats[0]?.name || '');
        setLoading(false);
        return; // done
      } catch {
        // try next URL
      }
    }

    // All URLs failed — use fallback
    setCategories(FALLBACK_CATEGORIES);
    setSelectedCategory('Kicks');
    setLoading(false);
  };

  const handleTechniqueClick = (technique) => {
    if (onVideoWatch) {
      onVideoWatch({
        id: technique._id,
        title: technique.name,
        duration: '5 min',
        lesson: '1/1',
        progress: 0,
        bgColor: '#2d3748',
      });
    }
    setSelectedTechnique(technique);
  };

  const currentTechniques = techniques.filter(t => t.category === selectedCategory);
  const filteredTechniques = currentTechniques.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTechniqueItem = ({ item }) => (
    <TouchableOpacity
      style={styles.techniqueItem}
      activeOpacity={0.7}
      onPress={() => handleTechniqueClick(item)}
    >
      <View style={styles.techniqueImageWrapper}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.techniqueImageStyle}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.techniqueImageStyle, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>🥋</Text>
          </View>
        )}
        <View style={styles.techniqueImageOverlay} />
      </View>
      <Text style={styles.techniqueName}>{item.name}</Text>
      {item.difficulty && (
        <View style={[styles.difficultyBadge,
          item.difficulty === 'Easy' ? styles.easy :
          item.difficulty === 'Medium' ? styles.medium : styles.hard]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedTechnique) {
    return (
      <TechniqueDetailScreen
        technique={selectedTechnique}
        onBack={() => setSelectedTechnique(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{selectedCategory || 'Techniques'}</Text>
          <Text style={styles.headerCount}>{filteredTechniques.length}</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[styles.categoryTab, selectedCategory === cat.name && styles.categoryTabActive]}
            onPress={() => { setSelectedCategory(cat.name); setSearchQuery(''); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryTabText, selectedCategory === cat.name && styles.categoryTabTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9ca3af" type="MaterialIcons" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006CB5" />
        </View>
      ) : filteredTechniques.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No techniques in this category yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTechniques}
          renderItem={renderTechniqueItem}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  headerContent: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1f2937' },
  headerCount: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    maxHeight: 60,
  },
  categoriesContent: { paddingHorizontal: 16, paddingVertical: 8 },
  categoryTab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 18, backgroundColor: '#e5e7eb', marginRight: 10, alignSelf: 'flex-start',
  },
  categoryTabActive: { backgroundColor: '#1f2937' },
  categoryTabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  categoryTabTextActive: { color: '#fff' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#e5e7eb', borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md, marginVertical: spacing.md,
  },
  searchInput: {
    flex: 1, paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm, fontSize: 14, color: '#1f2937',
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  techniqueItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  techniqueImageWrapper: {
    width: 60, height: 60, borderRadius: 10,
    overflow: 'hidden', marginRight: spacing.md, backgroundColor: '#e5e7eb',
  },
  techniqueImageStyle: { width: 60, height: 60, borderRadius: 10 },
  imagePlaceholder: {
    backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center',
  },
  placeholderText: { fontSize: 24 },
  techniqueImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  techniqueName: { fontSize: 14, fontWeight: '600', color: '#1f2937', flex: 1 },
  difficultyBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  easy: { backgroundColor: '#dcfce7' },
  medium: { backgroundColor: '#fef9c3' },
  hard: { backgroundColor: '#fee2e2' },
  difficultyText: { fontSize: 10, fontWeight: '700', color: '#374151' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 14 },
});

export default KicksScreen;
