import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { flashcard } from '../assets';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Taekwon-Do',
    description: 'Track your progress.\nManage attendance.\nAchieve your goals.',
    image: flashcard,
    buttonText: 'Next',
  },
  {
    id: '2',
    title: 'Track Your Belt Progress',
    description: 'Monitor your belt level.\nView exam schedules.\nSee your achievements.',
    image: flashcard,
    buttonText: 'Next',
  },
  {
    id: '3',
    title: 'Stay Connected',
    description: 'Check attendance records.\nView upcoming events.\nAccess certificates.',
    image: flashcard,
    buttonText: 'Next',
  },
  {
    id: '4',
    title: 'Start Your Journey',
    description: 'Login to access your student portal.',
    image: flashcard,
    buttonText: 'Get Started',
  },
];

const OnboardingScreen = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    callback();
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateTransition(() => setCurrentIndex(currentIndex + 1));
    } else {
      if (onFinish) onFinish();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      animateTransition(() => setCurrentIndex(currentIndex - 1));
    }
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Blue header area */}
      <View style={styles.header}>
        {/* Decorative circles */}
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        {/* Back button */}
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        )}

        {/* Skip button */}
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Image */}
        <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
          <Image source={currentSlide.image} style={styles.image} resizeMode="cover" />
        </Animated.View>
      </View>

      {/* White content area */}
      <View style={styles.contentArea}>
        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.star}>✦</Text>
            <View style={styles.line} />
          </View>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{currentSlide.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: width,
    height: height * 0.52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleTopRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e8f4ff',
    top: -60,
    right: -60,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#e8f4ff',
    bottom: -40,
    left: -40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#006CB5',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#e8f4ff',
    borderRadius: 20,
  },
  skipText: {
    color: '#006CB5',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  imageWrapper: {
    width: width,
    height: height * 0.52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingTop: 28,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cce3f5',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#006CB5',
    width: 24,
    borderRadius: 4,
  },
  textBlock: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    width: 200,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#006CB5',
  },
  star: {
    color: '#006CB5',
    fontSize: 12,
    marginHorizontal: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#006CB5',
    paddingHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#006CB5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
