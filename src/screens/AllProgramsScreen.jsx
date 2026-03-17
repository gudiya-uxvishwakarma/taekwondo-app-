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
import { colors, typography, spacing } from '../theme';
import Icon from '../components/common/Icon';
import ProgramDetailScreen from './ProgramDetailScreen';

const AllProgramsScreen = ({ onBack }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs] = useState([
    {
      id: 'p1',
      title: 'Basic Kicks',
      lessons: '20',
      duration: '25 min',
      category: 'Taekwondo Kicks',
      image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
      progress: 5,
      status: 'in-progress',
    },
    {
      id: 'p2',
      title: 'Kicks Mastery',
      lessons: '20',
      duration: '25 min',
      category: 'Taekwondo Kicks',
      image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p3',
      title: 'Expert Kicks',
      lessons: '20',
      duration: '30 min',
      category: 'Taekwondo Kicks',
      image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p4',
      title: 'Explosive Kicks',
      lessons: '18',
      duration: '28 min',
      category: 'Taekwondo Kicks',
      image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p5',
      title: 'Combo Junkies',
      lessons: '20',
      duration: '15 min',
      category: 'Target Focus',
      image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p6',
      title: 'Punches & Blocks',
      lessons: '30',
      duration: '15 min',
      category: 'Target Focus',
      image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p7',
      title: 'Lightning Speed',
      lessons: '25',
      duration: '20 min',
      category: 'Target Focus',
      image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p8',
      title: 'Flexibility Training',
      lessons: '15',
      duration: '20 min',
      category: 'Stretching & Recovery',
      image: { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p9',
      title: 'Recovery Routine',
      lessons: '10',
      duration: '15 min',
      category: 'Stretching & Recovery',
      image: { uri: 'https://images.unsplash.com/photo-1552821206-e4c40ea199e8?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
    {
      id: 'p10',
      title: 'Cool Down',
      lessons: '8',
      duration: '10 min',
      category: 'Stretching & Recovery',
      image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop' },
      progress: 0,
      status: 'locked',
    },
  ]);

  const renderProgramCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.beltCard} 
      activeOpacity={0.8}
      onPress={() => setSelectedProgram(item)}
    >
      <View style={styles.beltContent}>
        <View style={styles.beltInfo}>
          <Text style={styles.beltName}>{item.title}</Text>
          <Text style={styles.beltLessons}>
            {item.lessons} lessons • {item.duration}
          </Text>
          {item.status === 'in-progress' && (
            <TouchableOpacity style={styles.continueButton}>
              <Icon name="play-arrow" size={18} color="#fff" type="MaterialIcons" />
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.beltImage}>
          <View style={styles.beltIconContainer}>
            {item.status === 'in-progress' && (
              <Icon name="schedule" size={40} color={colors.primary} type="MaterialIcons" />
            )}
            {item.status === 'locked' && (
              <Icon name="lock" size={40} color="#9ca3af" type="MaterialIcons" />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {selectedProgram ? (
        <ProgramDetailScreen 
          program={selectedProgram}
          onBack={() => setSelectedProgram(null)}
        />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Programs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Programs List */}
        <FlatList
          data={programs}
          renderItem={renderProgramCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="home" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="search" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="menu" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="person" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>
      </View>
        </>
      )}
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContainer: {
    paddingVertical: spacing.sm,
  },
  beltCard: {
    backgroundColor: '#d1d5db',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  beltContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'space-between',
  },
  beltInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  beltName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  beltLessons: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  beltImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beltImageStyle: {
    borderRadius: 16,
  },
  beltImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  beltIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSpace: {
    height: spacing.xl,
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
});

export default AllProgramsScreen;
