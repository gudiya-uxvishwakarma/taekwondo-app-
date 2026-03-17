import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useStudent } from '../context/StudentContext';
import { colors, typography, spacing } from '../theme';
import Icon from '../components/common/Icon';

const PracticalSyllabusScreen = ({ onBack, onPaymentRequired }) => {
  const { student, isAuthenticated } = useStudent();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [syllabusContent, setSyllabusContent] = useState([]);

  useEffect(() => {
    checkAccess();
  }, [isAuthenticated, student]);

  const checkAccess = async () => {
    setLoading(true);
    
    try {
      // Check if user is authenticated with student email
      if (!isAuthenticated || !student) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Students with registered emails have access
      // Check if student has valid email (registered student)
      if (student.email) {
        setHasAccess(true);
        loadSyllabusContent();
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.log('Access check error:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSyllabusContent = () => {
    // Sample syllabus content - replace with actual API call
    const content = [
      {
        id: 1,
        belt: 'White Belt',
        level: 'Beginner',
        techniques: [
          'Basic Stances (Narani Sogi, Gunnun Sogi)',
          'Walking Stance Punches',
          'Low Block (Najunde Makgi)',
          'Rising Block (Chookyo Makgi)',
          'Middle Section Punch (Kaunde Jirugi)',
        ],
        patterns: ['Saju Jirugi', 'Saju Makgi'],
        description: 'Foundation level focusing on basic stances and blocks',
      },
      {
        id: 2,
        belt: 'Yellow Stripe',
        level: 'Beginner',
        techniques: [
          'Front Snap Kick (Ap Cha Busigi)',
          'Knife Hand Strike (Sonkal Taerigi)',
          'Inner Forearm Block (An Palmok Makgi)',
          'Outer Forearm Block (Bakat Palmok Makgi)',
        ],
        patterns: ['Chon-Ji (19 movements)'],
        description: 'Introduction to basic kicks and hand techniques',
      },
      {
        id: 3,
        belt: 'Yellow Belt',
        level: 'Beginner',
        techniques: [
          'Side Piercing Kick (Yop Cha Jirugi)',
          'Back Fist Strike (Dung Joomuk Taerigi)',
          'Turning Kick (Dollyo Chagi)',
          'Twin Forearm Block (Sang Palmok Makgi)',
        ],
        patterns: ['Dan-Gun (21 movements)'],
        description: 'Advanced beginner techniques with side kicks',
      },
      {
        id: 4,
        belt: 'Green Stripe',
        level: 'Intermediate',
        techniques: [
          'Back Kick (Dwit Cha Jirugi)',
          'Hooking Kick (Golcho Chagi)',
          'Reverse Knife Hand Strike (Sonkal Dung Taerigi)',
          'X-Block (Kyocha Makgi)',
        ],
        patterns: ['Do-San (24 movements)'],
        description: 'Intermediate level with complex kicks',
      },
      {
        id: 5,
        belt: 'Green Belt',
        level: 'Intermediate',
        techniques: [
          'Flying Side Kick (Twimyo Yop Cha Jirugi)',
          'Elbow Strike (Palkup Taerigi)',
          'Knee Strike (Moorup Chagi)',
          'Circular Block (Dollimyo Makgi)',
        ],
        patterns: ['Won-Hyo (28 movements)'],
        description: 'Advanced intermediate with flying techniques',
      },
      {
        id: 6,
        belt: 'Blue Stripe',
        level: 'Advanced',
        techniques: [
          'Spinning Hook Kick (Bandae Dollyo Chagi)',
          'Jump Spinning Kick (Twimyo Dollyo Chagi)',
          'Double Punch (Sang Jirugi)',
          'Pressing Block (Noollo Makgi)',
        ],
        patterns: ['Yul-Gok (38 movements)'],
        description: 'Advanced spinning and jumping techniques',
      },
    ];
    
    setSyllabusContent(content);
  };

  const handlePaymentRequest = () => {
    Alert.alert(
      'Payment Required',
      'To access the Practical Syllabus, you need to register as a student and complete the payment process.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Register & Pay',
          onPress: () => {
            if (onPaymentRequired) {
              onPaymentRequired();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking access...</Text>
      </View>
    );
  }

  // Access Denied Screen
  if (!hasAccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Back Button */}
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={colors.primary} type="MaterialIcons" />
          </TouchableOpacity>
        )}

        <View style={styles.accessDeniedContainer}>
          <View style={styles.lockIconContainer}>
            <Icon name="lock" size={80} color={colors.primary} type="MaterialIcons" />
          </View>
          
          <Text style={styles.accessDeniedTitle}>Access Restricted</Text>
          
          <Text style={styles.accessDeniedMessage}>
            The Practical Syllabus is only available to registered students.
          </Text>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>To get access:</Text>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={24} color="#10b981" type="MaterialIcons" />
              <Text style={styles.benefitText}>Register with your student email</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={24} color="#10b981" type="MaterialIcons" />
              <Text style={styles.benefitText}>Complete the admission process</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={24} color="#10b981" type="MaterialIcons" />
              <Text style={styles.benefitText}>Pay the registration fee</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handlePaymentRequest}
            activeOpacity={0.8}
          >
            <Icon name="payment" size={20} color="#fff" type="MaterialIcons" />
            <Text style={styles.paymentButtonText}>Register & Pay Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToSelectionButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backToSelectionText}>Back to Selection</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Syllabus Content Screen (for authenticated students)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.headerBackButton} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Practical Syllabus</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Icon name="school" size={40} color={colors.primary} type="MaterialIcons" />
          <Text style={styles.welcomeTitle}>Welcome, {student?.name || 'Student'}!</Text>
          <Text style={styles.welcomeMessage}>
            Access your complete Taekwon-Do practical syllabus below
          </Text>
        </View>

        {/* Syllabus Content */}
        {syllabusContent.map((item) => (
          <View key={item.id} style={styles.syllabusCard}>
            <View style={styles.syllabusHeader}>
              <View style={styles.beltBadge}>
                <Text style={styles.beltBadgeText}>{item.belt}</Text>
              </View>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>

            {item.description && (
              <Text style={styles.descriptionText}>{item.description}</Text>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="fitness-center" size={20} color={colors.primary} type="MaterialIcons" />
                <Text style={styles.sectionTitle}>Techniques</Text>
              </View>
              {item.techniques.map((technique, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{technique}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="auto-awesome" size={20} color={colors.primary} type="MaterialIcons" />
                <Text style={styles.sectionTitle}>Patterns (Tul)</Text>
              </View>
              {item.patterns.map((pattern, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{pattern}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  lockIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    fontSize: 15,
    color: '#4b5563',
    marginLeft: spacing.sm,
    flex: 1,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  backToSelectionButton: {
    paddingVertical: 12,
  },
  backToSelectionText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerBackButton: {
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  welcomeMessage: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  syllabusCard: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  syllabusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  beltBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  beltBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  levelText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingLeft: spacing.md,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  listItemText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
    lineHeight: 22,
  },
  footerSpace: {
    height: spacing.xl,
  },
});

export default PracticalSyllabusScreen;
