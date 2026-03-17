import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, StatusBar, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const FlashcardScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true })
        .start(() => { if (onFinish) onFinish(); });
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Decorative circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
      <View style={styles.circleTopRight} />

      {/* Top blue bar */}
      <View style={styles.topBar} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>TAEKWON-DO</Text>
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.star}>✦</Text>
            <View style={styles.line} />
          </View>
          <Text style={styles.subtitle}>Theory & Practice</Text>
          <Text style={styles.tagline}>TRAIN  ·  LEARN  ·  EXCEL</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom blue bar */}
      <View style={styles.bottomBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 8,
    backgroundColor: '#006CB5',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 8,
    backgroundColor: '#006CB5',
  },
  circleTopLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#e8f4ff',
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#e8f4ff',
    bottom: -100,
    right: -100,
  },
  circleTopRight: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#d0eaff',
    top: 60,
    right: -40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#006CB5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#006CB5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: 220,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#006CB5',
  },
  star: {
    color: '#006CB5',
    fontSize: 14,
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 11,
    color: '#006CB5',
    letterSpacing: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default FlashcardScreen;
