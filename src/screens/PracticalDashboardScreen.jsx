import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStudent } from '../context/StudentContext';
import { colors, typography, spacing } from '../theme';
import Icon from '../components/common/Icon';
import AllBeltsScreen from './AllBeltsScreen';
import AllProgramsScreen from './AllProgramsScreen';
import ProgramDetailScreen from './ProgramDetailScreen';
import QuickWorkoutScreen from './QuickWorkoutScreen';
import KicksScreen from './KicksScreen';
import LearnerProfileScreen from './LearnerProfileScreen';

const { width } = Dimensions.get('window');

const PracticalDashboardScreen = ({ onBack, onLogout, onSelectBelt }) => {
  const { student } = useStudent();
  const today = new Date();
  const todayKey = today.toDateString();
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [lessons, setLessons] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState({
    id: 1,
    title: 'Basic Kicks',
    duration: '25 min',
    lesson: '1/20',
    progress: 5,
    status: 'continue',
    label: 'CONTINUE',
    bgColor: '#2d3748',
  });
  const [beltProgress, setBeltProgress] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showAllBelts, setShowAllBelts] = useState(false);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showQuickWorkout, setShowQuickWorkout] = useState(false);
  const [showKicks, setShowKicks] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadRecentlyWatched();
  }, []);

  useEffect(() => {
    console.log('Recently watched updated:', recentlyWatched);
  }, [recentlyWatched]);

  const loadRecentlyWatched = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentlyWatched');
      if (stored) {
        setRecentlyWatched(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading recently watched:', error);
    }
  };

  const handleVideoWatch = async (video) => {
    console.log('=== handleVideoWatch called ===');
    console.log('Video data:', video);
    setRecentlyWatched(video);
    try {
      await AsyncStorage.setItem('recentlyWatched', JSON.stringify(video));
    } catch (error) {
      console.log('Error saving recently watched:', error);
    }
  };

  const handleProgramClick = (program) => {
    // Update recently watched
    handleVideoWatch({
      id: program.id,
      title: program.title,
      duration: program.duration,
      lesson: program.lessons,
      progress: program.progress,
      bgColor: '#2d3748',
    });
    setSelectedProgram(program);
  };

  const loadDashboardData = () => {
    const lessonsData = [
      {
        id: 1,
        title: 'Basic Kicks',
        duration: '25 min',
        lesson: '1/20',
        progress: 5,
        status: 'continue',
        label: 'CONTINUE',
        bgColor: '#2d3748',
      },
    ];

    const beltData = [
      {
        id: 1,
        belt: 'White',
        color: '#e5e7eb',
        progress: 100,
        status: 'completed',
      },
      {
        id: 2,
        belt: 'Yellow',
        color: '#fbbf24',
        progress: 65,
        status: 'in-progress',
      },
      {
        id: 3,
        belt: 'Green',
        color: '#34d399',
        progress: 0,
        status: 'locked',
      },
      {
        id: 4,
        belt: 'Blue',
        color: '#60a5fa',
        progress: 0,
        status: 'locked',
      },
      {
        id: 5,
        belt: 'Red',
        color: '#ef4444',
        progress: 0,
        status: 'locked',
      },
      {
        id: 6,
        belt: 'Black',
        color: '#1f2937',
        progress: 0,
        status: 'locked',
      },
    ];

    const programsData = [
      {
        id: 1,
        category: 'Taekwondo Kicks',
        programs: [
          {
            id: 'p1',
            title: 'Basic Kicks',
            lessons: '1/20',
            duration: '25 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Basic+Kicks' },
            progress: 5,
          },
          {
            id: 'p2',
            title: 'Kicks Mastery',
            lessons: '20',
            duration: '25 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Kicks+Mastery' },
            progress: 0,
          },
          {
            id: 'p3',
            title: 'Explosive Kicks',
            lessons: '20',
            duration: '30 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Expert+Kicks' },
            progress: 0,
          },
        ],
      },
      {
        id: 2,
        category: 'Target Focus',
        programs: [
          {
            id: 'p4',
            title: 'Combo Junkies',
            lessons: '20',
            duration: '15 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Combo+Junkies' },
            progress: 0,
          },
          {
            id: 'p5',
            title: 'Punches & Blocks',
            lessons: '30',
            duration: '15 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Punches' },
            progress: 0,
          },
          {
            id: 'p6',
            title: 'Lightning Footwork',
            lessons: '25',
            duration: '20 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Speed' },
            progress: 0,
          },
        ],
      },
      {
        id: 3,
        category: 'Stretching & Recovery',
        programs: [
          {
            id: 'p7',
            title: 'Stretching & Flexibility',
            lessons: '15',
            duration: '20 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Flexibility' },
            progress: 0,
          },
          {
            id: 'p8',
            title: 'Recovery',
            lessons: '10',
            duration: '15 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Recovery' },
            progress: 0,
          },
          {
            id: 'p9',
            title: 'Full Split Goal',
            lessons: '8',
            duration: '10 min',
            image: { uri: 'https://via.placeholder.com/160x140/1f2937/ffffff?text=Cool+Down' },
            progress: 0,
          },
        ],
      },
    ];

    setLessons(lessonsData);
    setBeltProgress(beltData);
    setPrograms(programsData);
  };

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    // Start from Monday of current week
    const dayOfWeek = today.getDay(); // 0=Sun
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    d.setDate(today.getDate() + diffToMonday + i);
    return { key: d.toDateString(), label: DAY_NAMES[d.getDay()], date: d.getDate() };
  });

  const renderLessonCard = ({ item }) => (
    <TouchableOpacity style={[styles.lessonCard, { backgroundColor: item.bgColor }]} activeOpacity={0.8}>
      <View style={styles.lessonLabelContainer}>
        <Text style={styles.lessonLabel}>{item.label}</Text>
      </View>

      <View style={styles.lessonFooter}>
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDuration}>
            Lesson {item.lesson} • {item.duration}
          </Text>
          {item.status === 'continue' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.progress}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.continueButton}>
          <Icon name="arrow-forward" size={20} color={colors.primary} type="MaterialIcons" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderBeltCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.beltCard} 
      activeOpacity={0.8}
      onPress={() => {
        // Update recently watched
        handleVideoWatch({
          id: item.id,
          title: item.belt,
          duration: '25 min',
          lesson: '1/20',
          progress: item.progress,
          bgColor: '#2d3748',
        });
        // Call original handler if exists
        onSelectBelt && onSelectBelt(item);
      }}
    >
      <View
        style={[
          styles.beltImageContainer,
          { backgroundColor: '#f3f4f6' },
          item.status === 'locked' && styles.beltImageContainerLocked,
        ]}
      >
        {item.status === 'locked' ? (
          <Icon name="lock" size={32} color="#9ca3af" type="MaterialIcons" />
        ) : item.status === 'completed' ? (
          <Icon name="check-circle" size={32} color="#10b981" type="MaterialIcons" />
        ) : (
          <Text style={styles.beltEmoji}>🥋</Text>
        )}
      </View>

      <View style={styles.beltInfoContainer}>
        <Text style={styles.beltName}>{item.belt}</Text>
        <Text style={styles.beltLessons}>20 lessons • 25 min</Text>
        
        <View style={styles.beltProgressBar}>
          <View
            style={[
              styles.beltProgressFill,
              { width: `${item.progress}%`, backgroundColor: item.color },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProgramCard = ({ item }) => (
    <TouchableOpacity style={styles.programCard} activeOpacity={0.8} onPress={() => handleProgramClick(item)}>
      <ImageBackground
        source={item.image}
        style={styles.programImageContainer}
        imageStyle={styles.programImageStyle}
      >
        <View style={styles.programImageOverlay} />
      </ImageBackground>

      <View style={styles.programInfo}>
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.programMeta}>
          {item.lessons} • {item.duration}
        </Text>
        
        {item.progress > 0 && (
          <View style={styles.programProgressBar}>
            <View
              style={[
                styles.programProgressFill,
                { width: `${item.progress}%` },
              ]}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {showAllBelts ? (
        <AllBeltsScreen 
          onBack={() => setShowAllBelts(false)}
          onVideoWatch={handleVideoWatch}
        />
      ) : showAllPrograms ? (
        <AllProgramsScreen onBack={() => setShowAllPrograms(false)} />
      ) : selectedProgram ? (
        <ProgramDetailScreen 
          program={selectedProgram}
          onBack={() => setSelectedProgram(null)}
          onVideoWatch={handleVideoWatch}
        />
      ) : showQuickWorkout ? (
        <QuickWorkoutScreen onBack={() => setShowQuickWorkout(false)} />
      ) : showKicks ? (
        <KicksScreen 
          onBack={() => setShowKicks(false)}
          onVideoWatch={handleVideoWatch}
        />
      ) : showProfile ? (
        <LearnerProfileScreen 
          onBack={() => setShowProfile(false)}
          onLogout={onLogout}
        />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>{student?.name || 'Student'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Weekly Schedule */}
        <View style={styles.section}>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.dayButton,
                  selectedDay === day.key && styles.dayButtonActive,
                ]}
                onPress={() => setSelectedDay(day.key)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === day.key && styles.dayTextActive,
                  ]}
                >
                  {day.label}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    selectedDay === day.key && styles.dayCircleActive,
                  ]}
                >
                  <Text style={[styles.dayNumber, selectedDay === day.key && styles.dayNumberActive]}>{day.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Watched */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Watched</Text>
          </View>

          <TouchableOpacity 
            style={[styles.lessonCard, { backgroundColor: recentlyWatched.bgColor }]} 
            activeOpacity={0.8}
            onPress={() => {
              // Navigate back to the program
              const program = programs.flatMap(p => p.programs).find(prog => prog.title === recentlyWatched.title);
              if (program) {
                setSelectedProgram(program);
              }
            }}
          >
            <View style={styles.lessonLabelContainer}>
              <Text style={styles.lessonLabel}>CONTINUE</Text>
            </View>

            <View style={styles.lessonFooter}>
              <View style={styles.lessonContent}>
                <Text style={styles.lessonTitle}>{recentlyWatched.title}</Text>
                <Text style={styles.lessonDuration}>
                  Lesson {recentlyWatched.lesson} • {recentlyWatched.duration}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${recentlyWatched.progress}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.continueButton}>
                <Icon name="arrow-forward" size={20} color={colors.primary} type="MaterialIcons" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progression by Belt */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progression by belt</Text>
            <TouchableOpacity onPress={() => setShowAllBelts(true)}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={beltProgress}
            renderItem={renderBeltCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={styles.beltScrollContainer}
          />
        </View>

        {/* Programs Sections */}
        {programs.map((programSection) => (
          <View key={programSection.id} style={styles.section}>
            {programSection.id === 1 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Programs</Text>
                <TouchableOpacity onPress={() => setShowAllPrograms(true)}>
                  <Text style={styles.viewAllText}>VIEW ALL</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Text style={styles.categorySubtitle}>{programSection.category}</Text>

            <FlatList
              data={programSection.programs}
              renderItem={renderProgramCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              contentContainerStyle={styles.programScrollContainer}
            />
          </View>
        ))}

        {/* Feature Cards Section */}
        <View style={styles.featureSection}>
          {/* Technique Library Card */}
          <TouchableOpacity style={styles.featureCard} activeOpacity={1} onPress={() => setShowKicks(true)}>
            <View style={styles.featureCardContent}>
              <View style={styles.featureCardTextContainer}>
                <Text style={styles.featureCardTitle}>Technique Library</Text>
                <Text style={styles.featureCardDesc}>300+ exercises and tips</Text>
              </View>
              
              <View style={styles.featureCardArrow}>
                <Icon name="arrow-forward" size={24} color={colors.primary} type="MaterialIcons" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Icon name="home" size={28} color={colors.primary} type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setShowQuickWorkout(true)}>
          <Icon name="schedule" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setShowKicks(true)}>
          <Icon name="menu" size={28} color="#9ca3af" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setShowProfile(true)}>
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
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  welcomeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  categorySubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  viewAllText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    marginHorizontal: 2,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  dayText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  dayTextActive: {
    color: '#fff',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  dayNumberActive: {
    color: '#fff',
  },
  lessonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
    padding: spacing.lg,
    minHeight: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonLabelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  lessonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  lessonDuration: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.sm,
  },
  progressContainer: {
    width: 200,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  continueButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  beltScrollContainer: {
    paddingRight: spacing.md,
  },
  programScrollContainer: {
    paddingRight: spacing.md,
  },
  programCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  programImageContainer: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f2937',
  },
  programImageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  programImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  programEmoji: {
    fontSize: 48,
  },
  programInfo: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  programTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  programMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  programProgressBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  programProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  bannerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerSection: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
  },
  bannerImageContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
  },
  bannerImageStyle: {
    borderRadius: 20,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    zIndex: 1,
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: spacing.xs,
    lineHeight: 32,
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  bannerStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  bannerArrowButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  featureSection: {
    marginVertical: spacing.md,
  },
  featureSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.lg,
  },
  featureCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 140,
    justifyContent: 'center',
  },
  featureCardImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  featureCardImageStyle: {
    borderRadius: 24,
  },
  featureCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 24,
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  featureCardTextContainer: {
    flex: 1,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  featureCardDesc: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  featureCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureStatItem: {
    alignItems: 'center',
  },
  featureStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  featureStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  featureStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing.md,
  },
  featureCardArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickStatTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  communityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  communityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  communityDesc: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  beltCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  beltImageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beltImageContainerLocked: {
    opacity: 0.6,
  },
  beltEmoji: {
    fontSize: 40,
  },
  beltName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.xs,
  },
  beltLessons: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  beltInfoContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  beltColorBar: {
    width: '100%',
    height: 6,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  beltProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  beltProgressFill: {
    height: '100%',
  },
  beltProgressContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
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

export default PracticalDashboardScreen;
