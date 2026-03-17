import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { colors } from '../theme';
import { logo } from '../assets';

const { width, height } = Dimensions.get('window');

const OPTIONS = [
  {
    key: 'student',
    label: 'Student Data',
    description: 'View attendance, fees & certificates',
    icon: '🎓',
    accent: '#006CB5',
    bg: '#EBF5FF',
  },
  {
    key: 'practical',
    label: 'Practical Syllabus',
    description: 'Techniques, patterns & belt grading',
    icon: '🥋',
    accent: '#1a1a2e',
    bg: '#EEEEF5',
  },
  {
    key: 'theory',
    label: 'Theory Syllabus',
    description: 'Korean terms, rules & history',
    icon: '📖',
    accent: '#C0392B',
    bg: '#FDECEA',
  },
];

const SelectionScreen = ({ onSelect }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(OPTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    OPTIONS.forEach((_, i) => {
      Animated.timing(cardAnims[i], {
        toValue: 1,
        duration: 400,
        delay: 300 + i * 120,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Decorative background blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Header */}
      <Animated.View
        style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.logoCircle}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Taekwon-Do Portal</Text>
        <Text style={styles.subtitle}>Choose your access type to continue</Text>
      </Animated.View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {OPTIONS.map((opt, i) => (
          <Animated.View
            key={opt.key}
            style={{
              opacity: cardAnims[i],
              transform: [
                {
                  translateY: cardAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => onSelect(opt.key)}
              activeOpacity={0.82}
            >
              {/* Left accent bar */}
              <View style={[styles.accentBar, { backgroundColor: opt.accent }]} />

              {/* Icon bubble */}
              <View style={[styles.iconBubble, { backgroundColor: opt.bg }]}>
                <Text style={styles.iconText}>{opt.icon}</Text>
              </View>

              {/* Text */}
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: opt.accent }]}>{opt.label}</Text>
                <Text style={styles.cardDesc}>{opt.description}</Text>
              </View>

              {/* Arrow */}
              <View style={[styles.arrowCircle, { backgroundColor: opt.bg }]}>
                <Text style={[styles.arrowIcon, { color: opt.accent }]}>›</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Footer */}
      <Animated.Text style={[styles.footerText, { opacity: fadeAnim }]}>
        Combat Warrior Taekwon-Do
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  blobTopRight: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#D6EEFF',
    top: -70,
    right: -70,
    opacity: 0.6,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#D6EEFF',
    bottom: -50,
    left: -60,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#006CB5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  logo: {
    width: 82,
    height: 82,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#006CB5',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 0.2,
  },
  cardsContainer: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingRight: 16,
    paddingLeft: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginRight: 14,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 26,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.1,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 26,
    marginLeft: 2,
  },
  footerText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 13,
    marginTop: 36,
    letterSpacing: 0.3,
  },
});

export default SelectionScreen;
