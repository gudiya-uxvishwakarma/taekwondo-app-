import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';

const ExerciseVideoPlayerScreen = ({ exercises, onBack }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const dimensions = useWindowDimensions();
  
  const isLandscape = dimensions.width > dimensions.height;
  const currentExercise = exercises[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  const handleSelectExercise = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  if (isLandscape) {
    return (
      <SafeAreaView style={styles.safeAreaLandscape}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.landscapeFullContainer}>
          <TouchableOpacity 
            style={styles.landscapeQuitButtonFull} 
            onPress={onBack} 
            activeOpacity={0.7}
          >
            <Icon name="close" size={28} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>

          <View style={styles.videoPlaceholderFull}>
            <ImageBackground
              source={currentExercise?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop' }}
              style={styles.videoBackground}
              imageStyle={styles.videoBackgroundImage}
            >
              <View style={styles.videoOverlay} />
              {!isPlaying && (
                <TouchableOpacity 
                  style={styles.largePlayButton}
                  onPress={() => setIsPlaying(true)}
                  activeOpacity={0.7}
                >
                  <Icon name="play-arrow" size={80} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
              )}
            </ImageBackground>
          </View>

          <View style={styles.landscapeCenterControlsFull}>
            <TouchableOpacity onPress={handlePrevious} activeOpacity={0.7}>
              <Icon name="skip-previous" size={60} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.landscapePlayButtonFull}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.7}
            >
              <Icon 
                name={isPlaying ? "pause" : "play-arrow"} 
                size={70} 
                color="#fff" 
                type="MaterialIcons" 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
              <Icon name="skip-next" size={60} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
          </View>

          <View style={styles.landscapeExerciseInfoFull}>
            <Text style={styles.landscapeExerciseNameFull}>{currentExercise?.name || 'Exercise'}</Text>
            <View style={styles.landscapeTimeInfoFull}>
              <Text style={styles.landscapeTimeFull}>00:00</Text>
              <Text style={styles.landscapeDurationFull}>24:30</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.videoContainer}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.quitButton} onPress={onBack} activeOpacity={0.7}>
            <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        <View style={styles.videoPlaceholder}>
          <ImageBackground
            source={currentExercise?.image || { uri: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=300&fit=crop' }}
            style={styles.videoBackground}
            imageStyle={styles.videoBackgroundImage}
          >
            <View style={styles.videoOverlay} />
            {!isPlaying && (
              <TouchableOpacity 
                style={styles.largePlayButton}
                onPress={() => setIsPlaying(true)}
                activeOpacity={0.7}
              >
                <Icon name="play-arrow" size={80} color="#fff" type="MaterialIcons" />
              </TouchableOpacity>
            )}
          </ImageBackground>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity onPress={handlePrevious} activeOpacity={0.7}>
            <Icon name="skip-previous" size={50} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
            activeOpacity={0.7}
          >
            <Icon 
              name={isPlaying ? "pause" : "play-arrow"} 
              size={60} 
              color="#fff" 
              type="MaterialIcons" 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
            <Icon name="skip-next" size={50} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{currentExercise?.name || 'Exercise'}</Text>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>00:00</Text>
            <Text style={styles.duration}>24:30</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailsContainer}
        contentContainerStyle={styles.thumbnailsContent}
      >
        {exercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.thumbnail,
              currentIndex === index && styles.thumbnailActive,
            ]}
            onPress={() => handleSelectExercise(index)}
            activeOpacity={0.7}
          >
            <ImageBackground
              source={exercise.image}
              style={styles.thumbnailImage}
              imageStyle={styles.thumbnailImageStyle}
            >
              <View style={styles.thumbnailOverlay} />
              <Icon name="play-circle-outline" size={24} color="#fff" type="MaterialIcons" />
            </ImageBackground>
            <Text style={styles.thumbnailLabel}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeAreaLandscape: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  quitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  videoBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBackgroundImage: {
    borderRadius: 12,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  largePlayButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginVertical: spacing.lg,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  timeInfo: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  time: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    backgroundColor: '#000',
    paddingVertical: spacing.md,
  },
  thumbnailsContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  thumbnail: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  thumbnailActive: {
    opacity: 1,
  },
  thumbnailImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailImageStyle: {
    borderRadius: 8,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  thumbnailLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    width: 100,
    textAlign: 'center',
  },
  landscapeFullContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    position: 'relative',
  },
  landscapeQuitButtonFull: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  videoPlaceholderFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: spacing.lg,
  },
  landscapeCenterControlsFull: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginVertical: spacing.lg,
  },
  landscapePlayButtonFull: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeExerciseInfoFull: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  landscapeExerciseNameFull: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  landscapeTimeInfoFull: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  landscapeTimeFull: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  landscapeDurationFull: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExerciseVideoPlayerScreen;
