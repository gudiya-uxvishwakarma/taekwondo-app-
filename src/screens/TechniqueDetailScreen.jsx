import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { colors, spacing } from '../theme';
import Icon from '../components/common/Icon';

const TechniqueDetailScreen = ({ technique, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = technique?.steps || [
    'Quickly lift your left knee, bending your leg towards your chest.',
    'Extend your foot forward, striking with the ball of your foot.',
    'Retract your leg immediately after impact.',
    'Return to your guard position.',
  ];

  const tips = technique?.tips || [
    'Keep your body relaxed to maximize speed and power.',
    'Engage your core for better balance and control.',
    'Snap your kick back quickly to avoid getting caught.',
    'Maintain a steady rhythm to improve fluidity.',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* Video Player Section */}
      <View style={styles.videoContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <ImageBackground
          source={technique?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
          style={styles.videoPlayer}
          imageStyle={styles.videoPlayerImage}
        >
          <View style={styles.videoOverlay} />
          {!isPlaying && (
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => setIsPlaying(true)}
              activeOpacity={0.7}
            >
              <Icon name="play-arrow" size={60} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.difficulty}>Easy</Text>
          <Text style={styles.techniqueName}>{technique?.name || 'Front Kick - Left'}</Text>
        </View>

        {/* Steps Section */}
        <View style={styles.stepsSection}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips to succeed</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#1f2937',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerImage: {
    borderRadius: 0,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  difficulty: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  techniqueName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  stepsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  stepText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  tipsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  tipText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  footerSpace: {
    height: 24,
  },
});

export default TechniqueDetailScreen;
