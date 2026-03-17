import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';
import BasicTheoryScreen from './theory/BasicTheoryScreen';
import StancesScreen from './theory/StancesScreen';
import BodyPartsScreen from './theory/BodyPartsScreen';
import AppInfoScreen from './theory/AppInfoScreen';
import SourcesScreen from './theory/SourcesScreen';
import TheoryQuestionsScreen from './theory/TheoryQuestionsScreen';
import BeltsScreen from './theory/BeltsScreen';
import SparringScreen from './theory/SparringScreen';
import SparringListScreen from './theory/SparringListScreen';
import TechniqueScreen from './theory/TechniqueScreen';
import KoreanScreen from './theory/KoreanScreen';

const TheorySyllabusScreen = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBasicTheory, setShowBasicTheory] = useState(false);
  const [showStances, setShowStances] = useState(false);
  const [showBodyParts, setShowBodyParts] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showTheoryQuestions, setShowTheoryQuestions] = useState(false);
  const [showAllBelts, setShowAllBelts] = useState(false);
  const [showSparring, setShowSparring] = useState(false);
  const [selectedSparringType, setSelectedSparringType] = useState(null);
  const [showTechnique, setShowTechnique] = useState(false);
  const [showKorean, setShowKorean] = useState(false);

  const categories = [
    {
      id: 1,
      title: 'Basic Theory',
      iconName: 'menu-book',
      iconColor: '#3b82f6',
      bgColor: '#eff6ff',
      description: 'Fundamentals of Taekwon-Do',
      topics: ['History', 'Philosophy', 'Principles', 'Etiquette'],
    },
    {
      id: 2,
      title: 'Technique',
      iconName: 'human-handsup',
      iconType: 'MaterialCommunityIcons',
      iconColor: '#8b5cf6',
      bgColor: '#f5f3ff',
      description: 'Kicks, Punches & Blocks',
      topics: ['Kicks', 'Punches', 'Blocks', 'Combinations'],
    },
    {
      id: 3,
      title: 'Belts',
      iconName: 'medal',
      iconType: 'MaterialCommunityIcons',
      iconColor: '#f59e0b',
      bgColor: '#fffbeb',
      description: 'Belt System & Progression',
      topics: ['White Belt', 'Yellow Belt', 'Green Belt', 'Blue Belt', 'Red Belt', 'Black Belt'],
    },
    {
      id: 4,
      title: 'Korean + Korean MATCH!',
      iconName: 'translate',
      iconColor: '#ef4444',
      bgColor: '#fef2f2',
      description: 'Korean Language & Commands',
      topics: ['Korean Words', 'Counting', 'Commands', 'Culture'],
    },
    {
      id: 5,
      title: 'Body Parts',
      iconName: 'accessibility-new',
      iconColor: '#10b981',
      bgColor: '#ecfdf5',
      description: 'Anatomy & Body Mechanics',
      topics: ['Upper Body', 'Lower Body', 'Core', 'Balance'],
    },
    {
      id: 6,
      title: 'Sparring',
      iconName: 'sports-kabaddi',
      iconColor: '#f97316',
      bgColor: '#fff7ed',
      description: 'Sparring Rules & Techniques',
      topics: ['Rules', 'Scoring', 'Strategy', 'Safety'],
    },
    {
      id: 7,
      title: 'Stances',
      iconName: 'directions-walk',
      iconColor: '#06b6d4',
      bgColor: '#ecfeff',
      description: 'Fundamental Stances',
      topics: ['Ready Stance', 'Walking Stance', 'L-Stance', 'X-Stance'],
    },
    {
      id: 8,
      title: 'Theory Questions',
      iconName: 'question-answer',
      iconColor: '#ec4899',
      bgColor: '#fdf2f8',
      description: 'Practice Q&A for belt tests',
      topics: ['White Belt Questions', 'Yellow Belt Questions', 'Green Belt Questions', 'Blue Belt Questions', 'Red Belt Questions', 'Black Belt Questions'],
    },
    {
      id: 9,
      title: 'Sources',
      iconName: 'book-open-page-variant',
      iconType: 'MaterialCommunityIcons',
      iconColor: '#6366f1',
      bgColor: '#eef2ff',
      description: 'References & Study Materials',
      topics: ['Official ITF Documents', 'Training Manuals', 'Reference Books', 'Online Resources'],
    },
    {
      id: 10,
      title: 'App Info',
      iconName: 'info',
      iconColor: '#64748b',
      bgColor: '#f1f5f9',
      description: 'About this application',
      topics: ['Version Info', 'About Us', 'Contact', 'Feedback'],
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        if (item.id === 1) {
          setShowBasicTheory(true);
        } else if (item.id === 7) {
          setShowStances(true);
        } else if (item.id === 5) {
          setShowBodyParts(true);
        } else if (item.id === 10) {
          setShowAppInfo(true);
        } else if (item.id === 9) {
          setShowSources(true);
        } else if (item.id === 8) {
          setShowTheoryQuestions(true);
        } else if (item.id === 3) {
          setShowAllBelts(true);
        } else if (item.id === 6) {
          setShowSparring(true);
        } else if (item.id === 2) {
          setShowTechnique(true);
        } else if (item.id === 4) {
          setShowKorean(true);
        } else {
          setSelectedCategory(item);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: item.bgColor }]}>
        <Icon name={item.iconName} size={28} color={item.iconColor} type={item.iconType || 'MaterialIcons'} />
      </View>
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <Icon name="chevron-right" size={22} color="#9ca3af" type="MaterialIcons" />
    </TouchableOpacity>
  );

  const renderTopicItem = ({ item }) => (
    <TouchableOpacity style={styles.topicItem} activeOpacity={0.7}>
      <Icon name="check-circle" size={20} color={colors.primary} type="MaterialIcons" />
      <Text style={styles.topicText}>{item}</Text>
    </TouchableOpacity>
  );

  if (showBasicTheory) {
    return <BasicTheoryScreen onBack={() => setShowBasicTheory(false)} />;
  }

  if (showStances) {
    return <StancesScreen onBack={() => setShowStances(false)} />;
  }

  if (showBodyParts) {
    return <BodyPartsScreen onBack={() => setShowBodyParts(false)} />;
  }

  if (showAppInfo) {
    return <AppInfoScreen onBack={() => setShowAppInfo(false)} />;
  }

  if (showSources) {
    return <SourcesScreen onBack={() => setShowSources(false)} />;
  }

  if (showTheoryQuestions) {
    return <TheoryQuestionsScreen onBack={() => setShowTheoryQuestions(false)} />;
  }

  if (showAllBelts) {
    return <BeltsScreen onBack={() => setShowAllBelts(false)} />;
  }

  if (showSparring) {
    if (selectedSparringType) {
      return (
        <SparringScreen
          sparring={selectedSparringType}
          onBack={() => setSelectedSparringType(null)}
        />
      );
    }
    return (
      <SparringListScreen
        onBack={() => setShowSparring(false)}
        onSelectSparring={(type) => setSelectedSparringType(type)}
      />
    );
  }

  if (showTechnique) {
    return <TechniqueScreen onBack={() => setShowTechnique(false)} />;
  }

  if (showKorean) {
    return <KoreanScreen onBack={() => setShowKorean(false)} />;
  }

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCategory.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          {/* Category Icon & Description */}
          <View style={styles.categoryDetailHeader}>
            <View style={[styles.categoryDetailIconContainer, { backgroundColor: selectedCategory.bgColor }]}>
              <Icon name={selectedCategory.iconName} size={48} color={selectedCategory.iconColor} type={selectedCategory.iconType || 'MaterialIcons'} />
            </View>
            <Text style={styles.categoryDetailTitle}>{selectedCategory.title}</Text>
            <Text style={styles.categoryDetailDescription}>{selectedCategory.description}</Text>
          </View>

          {/* Topics List */}
          <View style={styles.topicsSection}>
            <Text style={styles.topicsTitle}>Topics Covered:</Text>
            <FlatList
              data={selectedCategory.topics}
              renderItem={renderTopicItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Coming Soon Notice */}
          <View style={styles.comingSoonBox}>
            <Icon name="info" size={20} color={colors.primary} type="MaterialIcons" />
            <Text style={styles.comingSoonText}>
              Detailed content for this category is coming soon. Check back regularly for updates!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theory Syllabus</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: '#1f2937',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  // Detail view styles
  detailContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  categoryDetailHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
  },
  categoryDetailIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryDetailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  categoryDetailDescription: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  topicsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  topicsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.md,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  topicText: {
    fontSize: 15,
    color: '#4b5563',
    marginLeft: spacing.md,
    flex: 1,
  },
  comingSoonBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.xl,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: 20,
  },
});

export default TheorySyllabusScreen;
