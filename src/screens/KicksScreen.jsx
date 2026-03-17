import React, { useState } from 'react';
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
  ImageBackground,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import TechniqueDetailScreen from './TechniqueDetailScreen';

const KicksScreen = ({ onBack, onVideoWatch }) => {
  const [selectedCategory, setSelectedCategory] = useState('Kicks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const handleTechniqueClick = (technique) => {
    // Update recently watched in dashboard
    if (onVideoWatch) {
      onVideoWatch({
        id: technique.id,
        title: technique.name,
        duration: '5 min',
        lesson: '1/1',
        progress: 0,
        bgColor: '#2d3748',
      });
    }
    setSelectedTechnique(technique);
  };

  const categories = [
    { id: 1, name: 'Kicks', count: 80 },
    { id: 2, name: 'Jump Kicks', count: 45 },
    { id: 3, name: 'Kicks with chair', count: 30 },
    { id: 4, name: 'Punches', count: 25 },
  ];

  const techniques = {
    'Kicks': [
      { id: 1, name: 'Front Kick - Left', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 2, name: 'Front Kick - Right', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 3, name: 'Front Kick - Both Sides', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 4, name: 'Push Kick - Left', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 5, name: 'Push Kick - Right', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 6, name: 'Push Kick - Both Sides', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 7, name: 'Low Kick - Left', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 8, name: 'Low Kick - Right', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 9, name: 'Side Kick - Left', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 10, name: 'Side Kick - Right', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
    ],
    'Jump Kicks': [
      { id: 11, name: 'Jump Front Kick', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { id: 12, name: 'Jump Side Kick', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
      { id: 13, name: 'Jump Spin Kick', image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=100&h=100&fit=crop' } },
    ],
    'Kicks with chair': [
      { id: 14, name: 'Chair Support Kick', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
      { id: 15, name: 'Chair Balance Kick', image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' } },
    ],
    'Punches': [
      { id: 16, name: 'Straight Punch', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
      { id: 17, name: 'Hook Punch', image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=100&h=100&fit=crop' } },
    ],
  };

  const currentTechniques = techniques[selectedCategory] || [];
  const filteredTechniques = currentTechniques.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTechniqueItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.techniqueItem} 
      activeOpacity={0.7}
      onPress={() => handleTechniqueClick(item)}
    >
      <ImageBackground
        source={item.image}
        style={styles.techniqueImage}
        imageStyle={styles.techniqueImageStyle}
      >
        <View style={styles.techniqueImageOverlay} />
      </ImageBackground>
      <Text style={styles.techniqueName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Show technique detail screen
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{selectedCategory}</Text>
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
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.name && styles.categoryTabActive,
            ]}
            onPress={() => {
              setSelectedCategory(category.name);
              setSearchQuery('');
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category.name && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Bar */}
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

      {/* Techniques List */}
      <FlatList
        data={filteredTechniques}
        renderItem={renderTechniqueItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  categoryTabActive: {
    backgroundColor: '#1f2937',
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryTabTextActive: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 14,
    color: '#1f2937',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  techniqueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  techniqueImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: spacing.md,
    backgroundColor: '#e5e7eb',
  },
  techniqueImageStyle: {
    borderRadius: 10,
  },
  techniqueImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  techniqueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
});

export default KicksScreen;
