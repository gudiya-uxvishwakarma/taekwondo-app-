import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
  ActivityIndicator, Image, Dimensions, Linking, Modal,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import API_CONFIG from '../config/api';

const { width: SW, height: SH } = Dimensions.get('window');
const VIDEO_HEIGHT = Math.round(SH * 0.55);

let Video = null;
try { Video = require('react-native-video').default; } catch (e) {}

const serverBase = API_CONFIG.BASE_URL.replace('/api', '');

const getVideoUri = (videoUrl) => {
  if (!videoUrl) return null;
  if (videoUrl.startsWith('http')) return videoUrl;
  return `${serverBase}/${videoUrl}`;
};

const ExerciseDetailScreen = ({ exercise, onBack, customization, onVideoCompleted }) => {
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

  const videoUri = getVideoUri(exercise?.videoUrl);
  const hasVideo = !!videoUri && Video !== null && !videoError;
  const posterUrl = exercise?.image?.uri || exercise?.image;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const steps = exercise?.steps?.filter(s => s?.trim()) || [];
  const tips = exercise?.tips?.filter(t => t?.trim()) || [];

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
    if (showControls) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setShowControls(false);
    } else {
      setShowControls(true);
      if (!paused) scheduleHide();
    }
  };

  const onPlayPause = () => {
    const next = !paused;
    setPaused(next);
    if (!next) {
      scheduleHide();
    } else {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setShowControls(true);
    }
  };

  const onSeek = (delta) => {
    const t = Math.max(0, Math.min(currentTime + delta, duration));
    videoRef.current?.seek(t);
    setCurrentTime(t);
    if (!paused) scheduleHide();
  };

  const onEnd = () => {
    setPaused(true);
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    onVideoCompleted && onVideoCompleted();
  };

  const onFullscreen = () => {
    setFullscreen(true);
    setShowControls(true);
    if (!paused) scheduleHide();
  };

  const onExitFullscreen = () => {
    setFullscreen(false);
    setShowControls(true);
    if (!paused) scheduleHide();
  };

  const renderControls = (isFS) => (
    <View style={[styles.ctrlOverlay, isFS && styles.ctrlOverlayFS]} pointerEvents="box-none">
      <View style={styles.ctrlRow} pointerEvents="box-none">
        <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(-10)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
          <Icon name="replay-10" size={34} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={onPlayPause}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name={paused ? 'play-arrow' : 'pause'} size={50} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.seekBtn} onPress={() => onSeek(10)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
          <Icon name="forward-10" size={34} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow} pointerEvents="box-none">
        <View style={styles.progressRow} pointerEvents="none">
          <Text style={styles.timeTxt}>{fmt(currentTime)}</Text>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.timeTxt}>{fmt(duration)}</Text>
        </View>
        <TouchableOpacity
          style={styles.fsBtn}
          onPress={isFS ? onExitFullscreen : onFullscreen}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name={isFS ? 'fullscreen-exit' : 'fullscreen'} size={26} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* ── FULLSCREEN MODAL ── */}
      <Modal visible={fullscreen} transparent={false} animationType="fade" statusBarTranslucent supportedOrientations={['landscape']}>
        <StatusBar hidden />
        <View style={styles.fsContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.fill}
            resizeMode="cover"
            paused={paused}
            bufferConfig={{
              minBufferMs: 2500, maxBufferMs: 20000,
              bufferForPlaybackMs: 1500, bufferForPlaybackAfterRebufferMs: 2000,
            }}
            onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
            onProgress={(d) => setCurrentTime(d.currentTime)}
            onEnd={onEnd}
            onError={() => setVideoError(true)}
            repeat={false}
            ignoreSilentSwitch="ignore"
          />
          {buffering && (
            <View style={styles.centerAbs} pointerEvents="none">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <TouchableOpacity style={styles.fill} activeOpacity={1} onPress={onTapVideo} />
          {showControls && renderControls(true)}
        </View>
      </Modal>

      {/* ── VIDEO BLOCK ── */}
      <View style={styles.videoBox}>
        {hasVideo ? (
          <>
            {!videoReady && posterUrl && (
              <Image
                source={typeof posterUrl === 'string' ? { uri: posterUrl } : posterUrl}
                style={styles.fill}
                resizeMode="cover"
              />
            )}

            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={[styles.fill, !videoReady && { opacity: 0 }]}
              resizeMode="cover"
              paused={paused || fullscreen}
              bufferConfig={{
                minBufferMs: 2500,
                maxBufferMs: 20000,
                bufferForPlaybackMs: 1500,
                bufferForPlaybackAfterRebufferMs: 2000,
              }}
              onReadyForDisplay={() => setVideoReady(true)}
              onLoad={(d) => { setDuration(d.duration || 0); setVideoReady(true); setBuffering(false); }}
              onBuffer={({ isBuffering }) => setBuffering(isBuffering)}
              onProgress={(d) => { if (!fullscreen) setCurrentTime(d.currentTime); }}
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

            {videoReady && (
              <TouchableOpacity style={styles.fill} activeOpacity={1} onPress={onTapVideo} />
            )}

            {videoReady && showControls && renderControls(false)}
          </>
        ) : videoUri ? (
          <TouchableOpacity style={styles.noVideoFallback} onPress={() => Linking.openURL(videoUri)} activeOpacity={0.8}>
            <Icon name="play-circle-filled" size={64} color="rgba(255,255,255,0.9)" type="MaterialIcons" />
            <Text style={styles.tapTxt}>Tap to open video</Text>
            {videoError && <Text style={styles.errorTxt}>Playback error — tap to open in browser</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.noVideoFallback}>
            <Icon name="videocam-off" size={48} color="rgba(255,255,255,0.5)" type="MaterialIcons" />
            <Text style={styles.errorTxt}>No video uploaded</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      {/* ── INFO PANEL ── */}
      <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.exerciseName}>{exercise?.name || 'Exercise'}</Text>
          <Text style={styles.difficulty}>{customization?.level || exercise?.level || 'Easy'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {steps.length > 0 ? steps.map((instruction, index) => (
            <View key={index} style={styles.item}>
              <View style={styles.num}><Text style={styles.numTxt}>{index + 1}</Text></View>
              <Text style={styles.itemTxt}>{instruction}</Text>
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Icon name="format-list-numbered" size={28} color="#d1d5db" type="MaterialIcons" />
              <Text style={styles.emptyText}>No steps added yet</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips to succeed</Text>
          {tips.length > 0 ? tips.map((tip, index) => (
            <View key={index} style={styles.item}>
              <View style={[styles.num, styles.numDark]}><Text style={styles.numTxt}>{index + 1}</Text></View>
              <Text style={styles.itemTxt}>{tip}</Text>
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Icon name="lightbulb-outline" size={28} color="#d1d5db" type="MaterialIcons" />
              <Text style={styles.emptyText}>No tips added yet</Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },

  videoBox: {
    width: SW,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  noVideoFallback: {
    flex: 1,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#1f2937', gap: 8,
  },
  tapTxt: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 8 },
  errorTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', marginTop: 6 },

  centerAbs: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  spinnerBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14, paddingHorizontal: 28, paddingVertical: 18,
    alignItems: 'center', gap: 8,
  },
  loadingTxt: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 6 },

  ctrlOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 12,
  },
  ctrlOverlayFS: {
    paddingHorizontal: 32,
  },
  ctrlRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 28, flex: 1,
  },
  seekBtn: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  playBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#006CB5',
    justifyContent: 'center', alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', paddingBottom: 8, gap: 8,
  },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    flex: 1, gap: 8,
  },
  bar: {
    flex: 1, height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2, overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#006CB5', borderRadius: 2 },
  timeTxt: { color: '#fff', fontSize: 11, fontWeight: '600', minWidth: 36, textAlign: 'center' },
  fsBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  fsContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  backBtn: {
    position: 'absolute', top: 44, left: 14, zIndex: 50,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center',
  },

  panel: { flex: 1, backgroundColor: '#f9fafb' },
  titleRow: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  exerciseName: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  difficulty: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },

  section: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', marginTop: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 10 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginBottom: 8, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10,
  },
  num: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#006CB5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10, flexShrink: 0,
  },
  numDark: { backgroundColor: '#1f2937' },
  numTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  itemTxt: { fontSize: 13, color: '#4b5563', fontWeight: '500', lineHeight: 20, flex: 1 },

  emptyState: { alignItems: 'center', paddingVertical: spacing.md, gap: 6 },
  emptyText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
});

export default ExerciseDetailScreen;
