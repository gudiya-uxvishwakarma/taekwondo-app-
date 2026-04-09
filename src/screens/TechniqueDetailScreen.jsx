import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image,
  ActivityIndicator, Dimensions, Modal,
} from 'react-native';
import Icon from '../components/common/Icon';

const { width: SW, height: SH } = Dimensions.get('window');
// Video takes 55% of screen height — feels full and immersive
const VIDEO_HEIGHT = Math.round(SH * 0.55);

let Video = null;
try { Video = require('react-native-video').default; } catch (e) {}

function optimizeVideoUrl(url) {
  if (!url) return url;
  return url;
}

function getVideoPoster(url) {
  if (!url) return null;
  return null;
}

const FALLBACK_STEPS = [
  'Quickly lift your knee, bending your leg towards your chest.',
  'Extend your foot forward, striking with the ball of your foot.',
  'Retract your leg immediately after impact.',
  'Return to your guard position.',
];
const FALLBACK_TIPS = [
  'Keep your body relaxed to maximize speed and power.',
  'Engage your core for better balance and control.',
  'Snap your kick back quickly to avoid getting caught.',
  'Maintain a steady rhythm to improve fluidity.',
];

export default function TechniqueDetailScreen({ technique, onBack, onVideoWatch }) {
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

  const steps = technique?.steps?.filter(s => s?.trim()).length
    ? technique.steps.filter(s => s?.trim()) : FALLBACK_STEPS;
  const tips = technique?.tips?.filter(t => t?.trim()).length
    ? technique.tips.filter(t => t?.trim()) : FALLBACK_TIPS;

  const hasVideo = !!technique?.videoUrl && Video !== null && !videoError;
  const videoUrl = optimizeVideoUrl(technique?.videoUrl);
  const posterUrl = getVideoPoster(technique?.videoUrl) || technique?.image;
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
      // Track video watch when user starts playing
      if (onVideoWatch && technique) {
        onVideoWatch({
          title: technique.name || 'Technique',
          subtitle: `${technique.category || 'Technique'} • ${technique.difficulty || 'Easy'}`,
          type: 'kicks',
          bgColor: '#1f2937',
          image: technique.image ? { uri: technique.image } : null,
          techniqueId: technique._id,
        });
      }
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

  // Shared video controls UI — used in both normal and fullscreen
  const renderControls = (isFS) => (
    <View style={[s.ctrlOverlay, isFS && s.ctrlOverlayFS]} pointerEvents="box-none">
      <View style={s.ctrlRow} pointerEvents="box-none">
        <TouchableOpacity style={s.seekBtn} onPress={() => onSeek(-10)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
          <Icon name="replay-10" size={34} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={s.playBtn} onPress={onPlayPause}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name={paused ? 'play-arrow' : 'pause'} size={50} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>

        <TouchableOpacity style={s.seekBtn} onPress={() => onSeek(10)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
          <Icon name="forward-10" size={34} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      <View style={s.bottomRow} pointerEvents="box-none">
        <View style={s.progressRow} pointerEvents="none">
          <Text style={s.timeTxt}>{fmt(currentTime)}</Text>
          <View style={s.bar}>
            <View style={[s.barFill, { width: `${progress}%` }]} />
          </View>
          <Text style={s.timeTxt}>{fmt(duration)}</Text>
        </View>
        {/* Fullscreen toggle */}
        <TouchableOpacity
          style={s.fsBtn}
          onPress={isFS ? onExitFullscreen : onFullscreen}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon
            name={isFS ? 'fullscreen-exit' : 'fullscreen'}
            size={26} color="#fff" type="MaterialIcons"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* ── FULLSCREEN MODAL ── */}
      <Modal visible={fullscreen} transparent={false} animationType="fade" statusBarTranslucent supportedOrientations={['landscape']}>
        <StatusBar hidden />
        <View style={s.fsContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={s.fill}
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
            <View style={s.centerAbs} pointerEvents="none">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <TouchableOpacity style={s.fill} activeOpacity={1} onPress={onTapVideo} />
          {showControls && renderControls(true)}
        </View>
      </Modal>

      {/* ── FULL-WIDTH VIDEO BLOCK ── */}
      <View style={s.videoBox}>

        {hasVideo ? (
          <>
            {!videoReady && posterUrl && (
              <Image source={{ uri: posterUrl }} style={s.fill} resizeMode="cover" />
            )}

            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={[s.fill, !videoReady && { opacity: 0 }]}
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
              <View style={s.centerAbs} pointerEvents="none">
                <View style={s.spinnerBg}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={s.loadingTxt}>{videoReady ? 'Buffering…' : 'Loading…'}</Text>
                </View>
              </View>
            )}

            {videoReady && (
              <TouchableOpacity style={s.fill} activeOpacity={1} onPress={onTapVideo} />
            )}

            {videoReady && showControls && renderControls(false)}
          </>
        ) : (
          technique?.image
            ? <Image source={{ uri: technique.image }} style={s.fill} resizeMode="cover" />
            : <View style={[s.fill, s.noVideoFallback]}>
                <Text style={{ fontSize: 64 }}>🥋</Text>
              </View>
        )}

        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Icon name="arrow-back" size={22} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      {/* ── INFO + STEPS PANEL ── */}
      <ScrollView style={s.panel} showsVerticalScrollIndicator={false}>
        {/* Title row */}
        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[s.diffBadge,
              technique?.difficulty === 'Medium' ? s.diffM :
              technique?.difficulty === 'Hard'   ? s.diffH : s.diffE]}>
              {technique?.difficulty || 'Easy'}
            </Text>
            <Text style={s.techName}>{technique?.name || 'Technique'}</Text>
            {technique?.category && <Text style={s.catTxt}>{technique.category}</Text>}
          </View>
        </View>

        {/* Steps */}
        <View style={s.section}>
          <Text style={s.secTitle}>Steps</Text>
          {steps.map((step, i) => (
            <View key={i} style={s.item}>
              <View style={s.num}><Text style={s.numTxt}>{i + 1}</Text></View>
              <Text style={s.itemTxt}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={s.section}>
          <Text style={s.secTitle}>Tips to succeed</Text>
          {tips.map((tip, i) => (
            <View key={i} style={s.item}>
              <View style={[s.num, s.numDark]}><Text style={s.numTxt}>{i + 1}</Text></View>
              <Text style={s.itemTxt}>{tip}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  /* Video block */
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
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f2937',
  },

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

  /* Controls overlay */
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

  /* Fullscreen container */
  fsContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* Back button */
  backBtn: {
    position: 'absolute', top: 44, left: 14, zIndex: 50,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center',
  },

  /* Info panel */
  panel: { flex: 1, backgroundColor: '#f9fafb' },
  titleRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  diffBadge: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3 },
  diffE: { color: '#16a34a' }, diffM: { color: '#ca8a04' }, diffH: { color: '#dc2626' },
  techName: { fontSize: 20, fontWeight: '800', color: '#1f2937' },
  catTxt: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

  section: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', marginTop: 8,
  },
  secTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 10 },
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
});
