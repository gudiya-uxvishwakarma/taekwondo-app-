import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, ActivityIndicator, Modal,
  ImageBackground, Image, Dimensions,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const { height: SH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round(SH * 0.55);

let Video = null;
try { Video = require('react-native-video').default; } catch (e) {}

// Try to import orientation locker, fallback if not available
let Orientation = null;
try {
  Orientation = require('react-native-orientation-locker').default;
} catch (e) {
  console.log('Orientation locker not available:', e.message);
}

const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');

const getVideoUri = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

const getImageSource = (image) => {
  if (!image) return null;
  if (image.startsWith && image.startsWith('http')) return { uri: image };
  if (image?.uri) return image;
  return { uri: `${BASE_URL}/${image}` };
};

const ProgramExerciseVideoPlayerScreen = ({ exercises: propExercises, onBack, customization }) => {
  const [exercises, setExercises] = useState(propExercises || []);
  const [loading, setLoading] = useState(!propExercises?.length);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [paused, setPaused] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const videoRef = useRef(null);
  const hideTimer = useRef(null);

  const selectedLevel = customization?.level || 'Easy';
  const selectedEquipment = customization?.equipment || 'With Chair';

  React.useEffect(() => {
    if (propExercises?.length) { setExercises(propExercises); return; }
    // If no exercises passed, fetch from API
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_CONFIG.BASE_URL}/programs/exercises/all`);
        const json = await res.json();
        const list = json?.data?.exercises || [];
        const filtered = list.filter(ex => {
          const levelMatch = !ex.level || ex.level === '' || ex.level === selectedLevel;
          const eq = ex.equipment || 'all';
          const eqMatch = selectedEquipment === 'With Chair'
            ? eq === 'chair' || eq === 'all'
            : eq === 'noChair' || eq === 'all';
          return levelMatch && eqMatch && ex.videoUrl;
        });
        
        // Sort filtered exercises by creation date (newest first)
        const sortedFiltered = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateB - dateA; // Newest first
        });
        
        const mapped = sortedFiltered.map((ex, i) => ({
          ...ex,
          id: ex._id || i,
          videoUrl: getVideoUri(ex.videoUrl),
          image: ex.image ? getImageSource(ex.image) : null,
        }));
        setExercises(mapped);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  const resetVideoState = () => {
    setVideoReady(false);
    setVideoError(false);
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const goTo = (idx) => { resetVideoState(); setCurrentIndex(idx); };

  const current = exercises[currentIndex];
  const videoUri = current?.videoUrl || null;
  const hasVideo = !!videoUri && Video !== null && !videoError;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const onTapVideo = () => {
    if (showControls) { if (hideTimer.current) clearTimeout(hideTimer.current); setShowControls(false); }
    else { setShowControls(true); if (!paused) scheduleHide(); }
  };

  const onPlayPause = () => {
    const next = !paused;
    setPaused(next);
    if (!next) scheduleHide();
    else { if (hideTimer.current) clearTimeout(hideTimer.current); setShowControls(true); }
  };

  const onSeek = (delta) => {
    const t = Math.max(0, Math.min(currentTime + delta, duration));
    videoRef.current?.seek(t);
    setCurrentTime(t);
    if (!paused) scheduleHide();
  };

  const onEnd = () => {
    if (currentIndex < exercises.length - 1) goTo(currentIndex + 1);
    else { setPaused(true); setShowControls(true); if (hideTimer.current) clearTimeout(hideTimer.current); }
  };

  // Cleanup orientation on component unmount
  React.useEffect(() => {
    return () => {
      if (Orientation) {
        try {
          Orientation.unlockAllOrientations();
          Orientation.lockToPortrait();
          console.log('Orientation cleanup completed');
        } catch (error) {
          console.log('Orientation cleanup failed:', error);
        }
      }
    };
  }, []);

  const onFullscreen = () => { 
    setFullscreen(true); 
    setShowControls(true); 
    if (!paused) scheduleHide();
    // Lock orientation to landscape when entering fullscreen
    if (Orientation) {
      try {
        console.log('Locking to landscape...');
        Orientation.lockToLandscape();
      } catch (error) {
        console.log('Failed to lock orientation:', error);
      }
    }
  };
  
  const onExitFullscreen = () => { 
    setFullscreen(false); 
    setShowControls(true); 
    if (!paused) scheduleHide();
    // Unlock orientation when exiting fullscreen
    if (Orientation) {
      try {
        console.log('Returning to portrait...');
        Orientation.unlockAllOrientations();
        // Return to portrait after a short delay
        setTimeout(() => {
          Orientation.lockToPortrait();
        }, 100);
      } catch (error) {
        console.log('Failed to unlock orientation:', error);
      }
    }
  };

  if (loading) return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    </View>
  );

  if (!exercises.length) return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.centered}>
        <Icon name="videocam-off" size={48} color="#9ca3af" type="MaterialIcons" />
        <Text style={styles.emptyText}>No videos available</Text>
        <Text style={styles.emptySubText}>Add exercises with videos in the admin panel</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* ── FULLSCREEN MODAL (landscape) ── */}
      <Modal 
        visible={fullscreen} 
        transparent={false} 
        animationType="fade" 
        statusBarTranslucent 
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right', 'portrait']}
        onRequestClose={onExitFullscreen}
      >
        <StatusBar hidden />
        <View style={styles.fsContainer}>
          {hasVideo && (
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.fillFullscreen}
              resizeMode="cover"
              paused={paused}
              bufferConfig={{ minBufferMs: 2500, maxBufferMs: 20000, bufferForPlaybackMs: 1500, bufferForPlaybackAfterRebufferMs: 2000 }}
              onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
              onProgress={(d) => setCurrentTime(d.currentTime)}
              onEnd={onEnd}
              onError={() => setVideoError(true)}
              repeat={false}
              ignoreSilentSwitch="ignore"
            />
          )}
          {buffering && <View style={styles.centerAbs} pointerEvents="none"><ActivityIndicator size="large" color="#fff" /></View>}
          <TouchableOpacity style={styles.fillFullscreen} activeOpacity={1} onPress={onTapVideo} />
          {showControls && (
            <View style={styles.ctrlOverlay} pointerEvents="box-none">
              <View style={styles.ctrlRow} pointerEvents="box-none">
                <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(-10)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                  <Icon name="replay-10" size={34} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playBtn} onPress={onPlayPause} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name={paused ? 'play-arrow' : 'pause'} size={50} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(10)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                  <Icon name="forward-10" size={34} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomRow} pointerEvents="box-none">
                <View style={styles.progressRow} pointerEvents="none">
                  <Text style={styles.timeTxt}>{fmt(currentTime)}</Text>
                  <View style={styles.bar}><View style={[styles.barFill, { width: `${progress}%` }]} /></View>
                  <Text style={styles.timeTxt}>{fmt(duration)}</Text>
                </View>
                <TouchableOpacity style={styles.fsBtn} onPress={onExitFullscreen} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="fullscreen-exit" size={26} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* ── VIDEO BLOCK ── */}
      <View style={styles.videoBox}>
        {hasVideo ? (
          <>
            {!videoReady && current?.image && (
              <Image source={getImageSource(current.image)} style={styles.fill} resizeMode="cover" />
            )}
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={[styles.fill, !videoReady && { opacity: 0 }]}
              resizeMode="cover"
              paused={paused}
              bufferConfig={{ minBufferMs: 2500, maxBufferMs: 20000, bufferForPlaybackMs: 1500, bufferForPlaybackAfterRebufferMs: 2000 }}
              onReadyForDisplay={() => setVideoReady(true)}
              onLoad={(d) => { setDuration(d.duration || 0); setVideoReady(true); setBuffering(false); }}
              onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
              onProgress={(d) => setCurrentTime(d.currentTime)}
              onEnd={onEnd}
              onError={() => { setVideoError(true); setBuffering(false); }}
              repeat={false}
              ignoreSilentSwitch="ignore"
            />
            {(buffering || !videoReady) && (
              <View style={styles.centerAbs} pointerEvents="none">
                <View style={styles.spinnerBg}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingTxt}>{videoReady ? 'Buffering…' : 'Loading…'}</Text>
                </View>
              </View>
            )}
            {videoReady && <TouchableOpacity style={styles.fill} activeOpacity={1} onPress={onTapVideo} />}
            {videoReady && showControls && (
              <View style={styles.ctrlOverlay} pointerEvents="box-none">
                <View style={styles.ctrlRow} pointerEvents="box-none">
                  <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(-10)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                    <Icon name="replay-10" size={34} color="#fff" type="MaterialIcons" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.playBtn} onPress={onPlayPause} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name={paused ? 'play-arrow' : 'pause'} size={50} color="#fff" type="MaterialIcons" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(10)} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
                    <Icon name="forward-10" size={34} color="#fff" type="MaterialIcons" />
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomRow} pointerEvents="box-none">
                  <View style={styles.progressRow} pointerEvents="none">
                    <Text style={styles.timeTxt}>{fmt(currentTime)}</Text>
                    <View style={styles.bar}><View style={[styles.barFill, { width: `${progress}%` }]} /></View>
                    <Text style={styles.timeTxt}>{fmt(duration)}</Text>
                  </View>
                  <TouchableOpacity style={styles.fsBtn} onPress={onFullscreen} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="fullscreen" size={26} color="#fff" type="MaterialIcons" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noVideoFallback}>
            <Icon name="videocam-off" size={48} color="rgba(255,255,255,0.5)" type="MaterialIcons" />
            <Text style={styles.errorTxt}>No video uploaded for this exercise</Text>
          </View>
        )}

        <View style={styles.infoBar}>
          <Text style={styles.exerciseName} numberOfLines={1}>{current?.name || 'Exercise'}</Text>
          <Text style={styles.exerciseCount}>{currentIndex + 1} / {exercises.length}</Text>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      {/* ── THUMBNAIL LIST ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbList} contentContainerStyle={styles.thumbContent}>
        {exercises.map((ex, idx) => (
          <TouchableOpacity key={ex._id || idx} onPress={() => goTo(idx)} style={[styles.thumb, currentIndex === idx && styles.thumbActive]} activeOpacity={0.7}>
            {ex.image ? (
              <ImageBackground source={getImageSource(ex.image)} style={styles.thumbImg} imageStyle={{ borderRadius: 8 }}>
                <View style={[styles.thumbOverlay, currentIndex === idx && styles.thumbOverlayActive]} />
                <Icon name="play-circle-outline" size={22} color="#fff" type="MaterialIcons" />
              </ImageBackground>
            ) : (
              <View style={[styles.thumbImg, styles.thumbImgEmpty]}>
                <Icon name="fitness-center" size={22} color="#9ca3af" type="MaterialIcons" />
              </View>
            )}
            <Text style={[styles.thumbLabel, currentIndex === idx && styles.thumbLabelActive]} numberOfLines={2}>{ex.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#9ca3af', fontSize: 14 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySubText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
  backBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#006CB5', borderRadius: 20 },
  backBtnText: { color: '#fff', fontWeight: '700' },
  videoBox: { width: '100%', height: VIDEO_HEIGHT, backgroundColor: '#000', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  noVideoFallback: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f2937', gap: 8 },
  errorTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', marginTop: 6 },
  centerAbs: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  spinnerBg: { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 18, alignItems: 'center', gap: 8 },
  loadingTxt: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 6 },
  ctrlOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, flex: 1 },
  navBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  seekBtn: { width: 58, height: 58, borderRadius: 29, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#006CB5', justifyContent: 'center', alignItems: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  bar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#006CB5', borderRadius: 2 },
  timeTxt: { color: '#fff', fontSize: 11, fontWeight: '600', minWidth: 36, textAlign: 'center' },
  closeBtn: { position: 'absolute', top: 44, left: 14, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  infoBar: { position: 'absolute', bottom: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  exerciseCount: { color: '#9ca3af', fontSize: 13 },
  thumbList: { backgroundColor: '#000', maxHeight: 110 },
  thumbContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 10 },
  thumb: { alignItems: 'center', width: 90, opacity: 0.6 },
  thumbActive: { opacity: 1 },
  thumbImg: { width: 90, height: 60, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  thumbImgEmpty: { backgroundColor: '#1f2937' },
  thumbOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8 },
  thumbOverlayActive: { borderColor: '#006CB5' },
  thumbLabel: { color: '#9ca3af', fontSize: 10, textAlign: 'center', marginTop: 4, width: 90 },
  thumbLabelActive: { color: '#fff' },
  fsContainer: { flex: 1, backgroundColor: '#000', width: '100%', height: '100%' },
  fillFullscreen: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  bottomRow: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingBottom: 8, gap: 8 },
  fsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
});

export default ProgramExerciseVideoPlayerScreen;
