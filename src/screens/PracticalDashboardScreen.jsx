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
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStudent } from '../context/StudentContext';
import { colors, typography, spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';
import AllBeltsScreen from './AllBeltsScreen';
import AllProgramsScreen from './AllProgramsScreen';
import ProgramDetailScreen from './ProgramDetailScreen';
import QuickWorkoutScreen from './QuickWorkoutScreen';
import KicksScreen from './KicksScreen';
import techImage from '../assets/tech.png';
import LearnerProfileScreen from './LearnerProfileScreen';

const { width } = Dimensions.get('window');

const PracticalDashboardScreen = ({ onBack, onLogout, onSelectBelt }) => {
  const { student } = useStudent();
  const today = new Date();
  const todayKey = today.toDateString();
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [lessons, setLessons] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState({
    title: 'Basic Kicks',
    subtitle: 'Start your first session',
    type: 'program',
    bgColor: '#2d3748',
    image: null,
  });
  const [beltProgress, setBeltProgress] = useState([]);
  const [beltLoading, setBeltLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [showAllBelts, setShowAllBelts] = useState(false);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

  // Fetch latest photo from server (handles case where photo uploaded after login)
  useEffect(() => {
    const loadPhoto = async () => {
      const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
      if (student?.photo) {
        const url = student.photo.startsWith('http')
          ? student.photo
          : `${BASE_URL}${student.photo.startsWith('/') ? '' : '/'}${student.photo}`;
        setProfilePhotoUrl(url);
        return;
      }
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const p = data?.data?.user?.photo;
        if (p) {
          const url = p.startsWith('http') ? p : `${BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
          setProfilePhotoUrl(url);
        }
      } catch (e) { /* ignore */ }
    };
    loadPhoto();
  }, [student]);
  const [activeTab, setActiveTab] = useState('home');

  const loadBeltProgress = React.useCallback(async () => {
    try {
      setBeltLoading(true);
      const baseUrl = API_CONFIG.BASE_URL;
      const serverBase = baseUrl.replace('/api', '');
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

      setBeltProgress(mapped);
    } catch (err) {
      console.log('loadBeltProgress error:', err?.message);
    } finally {
      setBeltLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    loadRecentlyWatched();
    loadBeltProgress();
  }, [loadBeltProgress]);

  const loadRecentlyWatched = async () => {
    try {
      // One-time migration: clear old format data
      const migrated = await AsyncStorage.getItem('rw_migrated_v2');
      if (!migrated) {
        await AsyncStorage.removeItem('recentlyWatched');
        await AsyncStorage.setItem('rw_migrated_v2', '1');
        return;
      }
      const stored = await AsyncStorage.getItem('recentlyWatched');
      console.log('Loaded from AsyncStorage:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Parsed recently watched:', parsed);
        const validTypes = ['kicks', 'quickWorkout', 'program', 'belt'];
        if (parsed && validTypes.includes(parsed.type) && parsed.title) {
          // Restore image for kicks type if not present
          if (parsed.type === 'kicks' && !parsed.image) {
            parsed.image = techImage;
          }
          setRecentlyWatched(parsed);
        } else {
          await AsyncStorage.removeItem('recentlyWatched');
        }
      }
    } catch (error) {
      console.log('Error loading recently watched:', error);
      await AsyncStorage.removeItem('recentlyWatched').catch(() => {});
    }
  };

  const handleVideoWatch = async (video) => {
    console.log('Saving recently watched:', video);
    setRecentlyWatched(video);
    try {
      // Save to AsyncStorage, preserving image data structure
      const toSave = { 
        ...video, 
        // Don't serialize local asset images (they're numbers, not serializable)
        // But preserve URI-based images
        image: video.image && typeof video.image === 'object' && video.image.uri 
          ? video.image 
          : (video.type === 'kicks' ? null : video.image)
      };
      console.log('Saving to AsyncStorage:', toSave);
      await AsyncStorage.setItem('recentlyWatched', JSON.stringify(toSave));
    } catch (error) {
      console.log('Error saving recently watched:', error);
    }
  };

  const handleProgramClick = async (program) => {
    await handleVideoWatch({
      title: program.title,
      subtitle: `${program.total ?? 0} lessons`,
      type: 'program',
      bgColor: '#2d3748',
      image: program.image || null,
      programId: program.id || program._id,
    });
    setSelectedProgram(program);
  };

  const navigateToRecent = () => {
    if (recentlyWatched.type === 'program') {
      const program = programs.flatMap(p => p.programs).find(
        prog => (prog.id || prog._id) === recentlyWatched.programId || prog.title === recentlyWatched.title
      );
      if (program) setSelectedProgram(program);
    } else if (recentlyWatched.type === 'belt') {
      const belt = beltProgress.find(b => b.belt === recentlyWatched.beltName);
      if (belt) handleBeltClick(belt);
    } else if (recentlyWatched.type === 'kicks') {
      // Navigate to kicks screen and potentially to specific technique
      setActiveTab('kicks');
    } else if (recentlyWatched.type === 'quickWorkout') {
      setActiveTab('workout');
    }
  };

  const handleBeltClick = async (belt) => {
    const imageObj = belt.imageUri ? { uri: belt.imageUri } : null;
    console.log('Belt image:', JSON.stringify(imageObj));
    await handleVideoWatch({
      title: belt.belt,
      subtitle: `${belt.total ?? 0} lessons`,
      type: 'belt',
      bgColor: '#1a3a5c',
      image: imageObj,
      beltName: belt.belt,
    });
    onSelectBelt && onSelectBelt(belt);
  };

  const handleKicksClick = () => {
    handleVideoWatch({
      title: 'Technique Library',
      subtitle: '100+ exercises and tips',
      type: 'kicks',
      bgColor: '#1f2937',
      image: techImage,
    });
    setActiveTab('kicks');
  };

  const handleQuickWorkoutClick = () => {
    handleVideoWatch({
      title: 'Quick Workout',
      subtitle: 'Custom training session',
      type: 'quickWorkout',
      bgColor: '#2d3748',
      image: null,
    });
    setActiveTab('workout');
  };

  const loadDashboardData = async () => {
    try {
      const serverBase = API_CONFIG.BASE_URL.replace('/api', '');
      const [progRes, exRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/programs`),
        fetch(`${API_CONFIG.BASE_URL}/programs/exercises/all`),
      ]);
      const progJson = await progRes.json();
      const exJson = await exRes.json();
      const apiPrograms = progJson?.data?.programs || [];
      const allExercises = exJson?.data?.exercises || [];

      // Group by category
      const categoryMap = {};
      apiPrograms.forEach(p => {
        const cat = p.category || 'General';
        if (!categoryMap[cat]) categoryMap[cat] = [];
        const total = allExercises.filter(ex => ex.programId === p._id || ex.programTitle === p.title).length;
        categoryMap[cat].push({
          ...p,
          id: p._id,
          total,
          image: p.image
            ? { uri: p.image.startsWith('http') ? p.image : `${serverBase}/${p.image}` }
            : null,
          progress: 0,
        });
      });

      const programsData = Object.entries(categoryMap).map(([category, programs], i) => ({
        id: i + 1,
        category,
        programs,
      }));

      setPrograms(programsData);
    } catch (err) {
      console.log('loadDashboardData error:', err.message);
    }
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
      onPress={() => handleBeltClick(item)}
    >
      <View style={styles.beltImageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.beltImageFull} resizeMode="cover" />
        ) : (
          <View style={styles.beltImagePlaceholder}>
            <Text style={styles.beltEmoji}>🥋</Text>
          </View>
        )}
      </View>

      <View style={styles.beltInfoContainer}>
        <Text style={styles.beltName}>{item.belt}</Text>
        <Text style={styles.beltLessons}>
          {item.completed > 0 ? `${item.completed} / ${item.total} lessons` : `${item.total} lessons`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProgramCard = ({ item }) => (
    <TouchableOpacity style={styles.programCard} activeOpacity={0.8} onPress={() => handleProgramClick(item)}>
      <View style={styles.programImageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.programImageFull} resizeMode="cover" />
        ) : (
          <View style={styles.programImagePlaceholder}>
            <Icon name="fitness-center" size={36} color="#9ca3af" type="MaterialIcons" />
          </View>
        )}
      </View>
      <View style={styles.programInfo}>
        <Text style={styles.programTitle}>{item.title}</Text>
        <Text style={styles.programMeta}>{item.total ?? 0} lessons</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Full-screen overlays (no bottom nav) */}
      {showAllBelts ? (
        <AllBeltsScreen 
          onBack={() => { setShowAllBelts(false); loadBeltProgress(); }}
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
      ) : (
        <>
          {/* Tab Content */}
          <View style={{ flex: 1 }}>
            {activeTab === 'home' && (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                      {profilePhotoUrl ? (
                        <Image source={{ uri: profilePhotoUrl }} style={styles.avatarImage} resizeMode="cover" />
                      ) : (
                        <Text style={styles.avatarEmoji}>👤</Text>
                      )}
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
                          style={[styles.dayButton, selectedDay === day.key && styles.dayButtonActive]}
                          onPress={() => setSelectedDay(day.key)}
                        >
                          <Text style={[styles.dayText, selectedDay === day.key && styles.dayTextActive]}>{day.label}</Text>
                          <View style={[styles.dayCircle, selectedDay === day.key && styles.dayCircleActive]}>
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
                    <TouchableOpacity activeOpacity={0.8} onPress={navigateToRecent}>
                      {(() => {
                        // Handle different image sources properly
                        let img = null;
                        if (recentlyWatched.image) {
                          if (typeof recentlyWatched.image === 'object' && recentlyWatched.image.uri) {
                            img = recentlyWatched.image; // URI-based image
                          } else if (typeof recentlyWatched.image === 'number') {
                            img = recentlyWatched.image; // Local asset
                          }
                        } else if (recentlyWatched.type === 'kicks') {
                          img = techImage; // Fallback for kicks
                        }

                        return img ? (
                        <ImageBackground
                          source={img}
                          style={styles.recentCard}
                          imageStyle={{ borderRadius: 16, resizeMode: 'cover' }}
                        >
                          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16 }} />
                          </View>
                          <View style={styles.recentCardContent}>
                            <Text style={styles.recentTitle}>{recentlyWatched.title}</Text>
                            <Text style={styles.recentSubtitle}>{recentlyWatched.subtitle}</Text>
                            <View style={styles.recentCardRow}>
                              <View style={styles.recentContinueBtn}>
                                <Text style={styles.recentContinueBtnText}>Continue</Text>
                                <Icon name="arrow-forward" size={16} color="#1f2937" type="MaterialIcons" />
                              </View>
                            </View>
                          </View>
                        </ImageBackground>
                        ) : (
                        <View style={[styles.recentCard, { backgroundColor: recentlyWatched.bgColor || '#2d3748', justifyContent: 'center', alignItems: 'center' }]}>
                          <Icon name="play-circle-outline" size={48} color="rgba(255,255,255,0.3)" type="MaterialIcons" />
                          <Text style={[styles.lessonTitle, { marginTop: 8, textAlign: 'center' }]}>
                            {recentlyWatched.title || 'No recent activity'}
                          </Text>
                          <Text style={[styles.lessonDuration, { textAlign: 'center' }]}>
                            {recentlyWatched.subtitle || 'Visit a belt or program to track progress'}
                          </Text>
                        </View>
                        );
                      })()}
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
                    {beltLoading ? (
                      <ActivityIndicator size="small" color="#006CB5" style={{ marginVertical: 20 }} />
                    ) : beltProgress.length === 0 ? (
                      <View style={styles.beltEmpty}>
                        <Icon name="sports-kabaddi" size={32} color="#d1d5db" type="MaterialIcons" />
                        <Text style={styles.beltEmptyText}>No belts available</Text>
                      </View>
                    ) : (
                      <FlatList
                        data={beltProgress}
                        renderItem={renderBeltCard}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.beltScrollContainer}
                      />
                    )}
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
                        contentContainerStyle={styles.programScrollContainer}
                      />
                    </View>
                  ))}

                  {/* Technique Library Card */}
                  <View style={styles.featureSection}>
                    <TouchableOpacity style={styles.techCard} activeOpacity={0.9} onPress={handleKicksClick}>
                      <ImageBackground source={techImage} style={styles.techCardBg} imageStyle={styles.techCardBgImage} resizeMode="cover">
                        <View style={styles.techCardOverlay} />
                        <View style={styles.techCardArrow}>
                          <Icon name="arrow-forward" size={18} color="#fff" type="MaterialIcons" />
                        </View>
                        <View style={styles.techCardLeft}>
                          <View style={styles.techBadge}>
                            <Text style={styles.techBadgeText}>🥋 Library</Text>
                          </View>
                          <Text style={styles.techCardTitle}>Technique Library</Text>
                          <Text style={styles.techCardDesc}>100+ exercises and tips</Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footerSpace} />
                </ScrollView>
              </>
            )}

            {activeTab === 'workout' && (
              <QuickWorkoutScreen onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'kicks' && (
              <KicksScreen
                onBack={() => setActiveTab('home')}
                onVideoWatch={handleVideoWatch}
              />
            )}

            {activeTab === 'profile' && (
              <LearnerProfileScreen
                onBack={() => setActiveTab('home')}
                onLogout={onLogout}
                onSwitch={onBack}
                canEdit={false}
              />
            )}
          </View>

          {/* Bottom Navigation — always visible */}
          <View style={styles.bottomNavigation}>
            <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('home')}>
              <Icon name="home" size={26} color={activeTab === 'home' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <Text style={[styles.navLabel, activeTab === 'home' && { color: colors.primary }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('workout')}>
              <Icon name="schedule" size={26} color={activeTab === 'workout' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <Text style={[styles.navLabel, activeTab === 'workout' && { color: colors.primary }]}>Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('kicks')}>
              <Icon name="menu" size={26} color={activeTab === 'kicks' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <Text style={[styles.navLabel, activeTab === 'kicks' && { color: colors.primary }]}>Kicks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => setActiveTab('profile')}>
              <Icon name="person" size={26} color={activeTab === 'profile' ? colors.primary : '#9ca3af'} type="MaterialIcons" />
              <Text style={[styles.navLabel, activeTab === 'profile' && { color: colors.primary }]}>Profile</Text>
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
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  recentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  recentCardShade: {
    display: 'none',
  },
  recentGradient1: {
    display: 'none',
  },
  recentGradient2: {
    display: 'none',
  },
  recentGradient3: {
    display: 'none',
  },  recentCardContent: {
    padding: spacing.lg,
    paddingTop: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flex: 1,
  },
  recentCardBottom: {
    paddingVertical: spacing.xs,
  },
  recentCardRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  recentCardGradient: {
    display: 'none',
  },
  recentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  recentSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  recentContinueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  recentContinueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  lessonLabelContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  lessonLabel: {
    fontSize: 11,
    fontWeight: '800',
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
  beltEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  beltEmptyText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
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
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  programImageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  programImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
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
  techCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
    height: 200,
  },
  techCardBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  techCardBgImage: {
    borderRadius: 24,
    resizeMode: 'cover',
  },
  techCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 24,
  },
  techCardLeft: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 6,
    zIndex: 2,
  },
  techBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  techBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  techCardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 28,
  },
  techCardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 8,
  },
  techCardArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  techCardImage: {
    width: '48%',
    height: '100%',
  },
  featureCardImage: {
    width: '100%',
    height: 160,
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
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  beltImageFull: {
    width: '100%',
    height: '100%',
  },
  beltImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  beltEmoji: {
    fontSize: 40,
  },
  beltName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  beltLessons: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  beltProgressPct: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 3,
  },
  beltInfoContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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
    paddingVertical: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.lg,
    gap: 3,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default PracticalDashboardScreen;
