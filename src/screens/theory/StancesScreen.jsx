import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

// Foot diagram component — draws blue vertical + red horizontal lines with foot positions
const FootDiagram = ({ type }) => {
  const diagrams = {
    parallel: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 18, left: 22 }]}>🦶</Text>
        <Text style={[d.foot, { top: 18, right: 22, transform: [{ scaleX: -1 }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 14 }]}>50%</Text>
        <Text style={[d.pct, { bottom: 6, right: 8 }]}>50%</Text>
      </View>
    ),
    walking: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 10, left: 30 }]}>🦶</Text>
        <Text style={[d.pct, { top: 30, left: 14 }]}>50%</Text>
        <Text style={[d.foot, { bottom: 10, right: 18, transform: [{ rotate: '15deg' }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, right: 8 }]}>50%</Text>
      </View>
    ),
    attention: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 22, left: 16, transform: [{ rotate: '-20deg' }] }]}>🦶</Text>
        <Text style={[d.foot, { top: 22, right: 16, transform: [{ scaleX: -1 }, { rotate: '-20deg' }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 10 }]}>50%</Text>
        <Text style={[d.pct, { bottom: 6, right: 6 }]}>50%</Text>
      </View>
    ),
    sitting: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 20, left: 4 }]}>🦶</Text>
        <Text style={[d.foot, { top: 20, right: 4, transform: [{ scaleX: -1 }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 6 }]}>50%</Text>
        <Text style={[d.pct, { bottom: 6, right: 4 }]}>50%</Text>
      </View>
    ),
    lstance: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 10, left: 28 }]}>🦶</Text>
        <Text style={[d.pct, { top: 30, left: 14 }]}>30%</Text>
        <Text style={[d.foot, { bottom: 8, right: 14, transform: [{ rotate: '90deg' }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, right: 6 }]}>70%</Text>
      </View>
    ),
    fixed: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 12, left: 26 }]}>🦶</Text>
        <Text style={[d.pct, { top: 32, left: 14 }]}>50%</Text>
        <Text style={[d.foot, { bottom: 10, right: 16 }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, right: 8 }]}>50%</Text>
      </View>
    ),
    bending: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { bottom: 10, left: 28 }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 14 }]}>100%</Text>
        <Text style={[d.footRaised, { top: 8, right: 20 }]}>🦶</Text>
      </View>
    ),
    rearfoot: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 10, left: 28 }]}>🦶</Text>
        <Text style={[d.pct, { top: 30, left: 14 }]}>10%</Text>
        <Text style={[d.foot, { bottom: 8, right: 14 }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, right: 6 }]}>90%</Text>
      </View>
    ),
    low: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 8, left: 6 }]}>🦶</Text>
        <Text style={[d.foot, { bottom: 8, right: 6, transform: [{ scaleX: -1 }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 6 }]}>50%</Text>
        <Text style={[d.pct, { bottom: 6, right: 4 }]}>50%</Text>
      </View>
    ),
    oneleg: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { bottom: 10, left: 28 }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 10 }]}>100%</Text>
        <Text style={[d.footRaised, { top: 6, right: 22 }]}>🦶</Text>
      </View>
    ),
    diagonal: (
      <View style={d.box}>
        <View style={d.vLine} />
        <View style={d.hLine} />
        <Text style={[d.foot, { top: 18, left: 10, transform: [{ rotate: '-45deg' }] }]}>🦶</Text>
        <Text style={[d.foot, { top: 18, right: 10, transform: [{ scaleX: -1 }, { rotate: '-45deg' }] }]}>🦶</Text>
        <Text style={[d.pct, { bottom: 6, left: 10 }]}>50%</Text>
        <Text style={[d.pct, { bottom: 6, right: 6 }]}>50%</Text>
      </View>
    ),
  };
  return diagrams[type] || diagrams.parallel;
};

const stances = [
  {
    key: 'parallel',
    name: 'Parallel Ready Stance',
    korean: 'Narani Junbi Sogi',
    weight: '50/50',
    width: '1 shoulder width',
    length: null,
    facing: 'Full or Half',
    lr: 'N/A',
    extra: null,
  },
  {
    key: 'walking',
    name: 'Walking Stance',
    korean: 'Gunnun Sogi',
    weight: '50/50',
    width: '1 shoulder width between insteps',
    length: '1½ shoulder width between big toes',
    facing: 'Full or Half',
    lr: 'Leading foot',
    extra: 'Rear foot is pointed about 15° outwards',
  },
  {
    key: 'attention',
    name: 'Attention Stance',
    korean: 'Charyot Sogi',
    weight: '50/50',
    width: null,
    length: null,
    facing: 'Full',
    lr: 'N/A',
    extra: 'The heels are touching and the toes point out at 45°',
  },
  {
    key: 'sitting',
    name: 'Sitting Stance',
    korean: 'Annun Sogi',
    weight: '50/50',
    width: '1½ shoulder width between insteps',
    length: null,
    facing: 'Full or Side',
    lr: 'N/A',
    extra: 'Toes point forward, knees bent directly over toes',
  },
  {
    key: 'lstance',
    name: 'L-Stance',
    korean: 'Niunja Sogi',
    weight: 'Rear 70 / Front 30',
    width: '1 shoulder width between insteps',
    length: '1½ shoulder width (front to back)',
    facing: 'Half',
    lr: 'Rear foot',
    extra: 'Front foot points forward, rear foot points 90° to the side',
  },
  {
    key: 'fixed',
    name: 'Fixed Stance',
    korean: 'Gojung Sogi',
    weight: '50/50',
    width: '1 shoulder width between insteps',
    length: '1 shoulder width (front to back)',
    facing: 'Full',
    lr: 'N/A',
    extra: 'Both feet flat on the ground, shorter than walking stance',
  },
  {
    key: 'bending',
    name: 'Bending Ready Stance',
    korean: 'Guburyo Junbi Sogi',
    weight: '100% on standing leg',
    width: null,
    length: null,
    facing: 'Full or Half',
    lr: 'Standing foot',
    extra: 'Other foot raised with knee lifted to hip height',
  },
  {
    key: 'rearfoot',
    name: 'Rear Foot Stance',
    korean: 'Dwit Bal Sogi',
    weight: 'Rear 90 / Front 10',
    width: '1 shoulder width between insteps',
    length: '1 shoulder width (front to back)',
    facing: 'Half',
    lr: 'Rear foot',
    extra: 'Front heel raised, barely touching the ground',
  },
  {
    key: 'low',
    name: 'Low Stance',
    korean: 'Nachuo Sogi',
    weight: '50/50',
    width: '2 shoulder widths between insteps',
    length: null,
    facing: 'Full or Half',
    lr: 'Leading foot',
    extra: 'Very low, wide stance with knees deeply bent',
  },
  {
    key: 'oneleg',
    name: 'One-Leg Stance',
    korean: 'Waebal Sogi',
    weight: '100% on standing leg',
    width: null,
    length: null,
    facing: 'Full or Half',
    lr: 'Standing foot',
    extra: 'Other knee raised to hip height, used before kicking',
  },
  {
    key: 'diagonal',
    name: 'Diagonal Stance',
    korean: 'Sasun Sogi',
    weight: '50/50',
    width: '1 shoulder width between insteps',
    length: null,
    facing: 'Half',
    lr: 'N/A',
    extra: 'Feet at 45° angle, presents smaller target to opponent',
  },
];

const StancesScreen = ({ onBack }) => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Stances</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
    

      {stances.map((stance, index) => (
        <View key={stance.key} style={[styles.stanceRow, index < stances.length - 1 && styles.stanceDivider]}>
          {/* Left: text info */}
          <View style={styles.stanceLeft}>
            <Text style={styles.stanceName}>{stance.name}</Text>
            <Text style={styles.stanceKorean}>{stance.korean}</Text>
            <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Weight: </Text>{stance.weight}</Text>
            {stance.width ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Width: </Text>{stance.width}</Text> : null}
            {stance.length ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Length: </Text>{stance.length}</Text> : null}
            <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Facing: </Text>{stance.facing}</Text>
            <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>L/R: </Text>{stance.lr}</Text>
            {stance.extra ? <Text style={styles.stanceExtra}>{stance.extra}</Text> : null}
          </View>

          {/* Right: foot diagram */}
          <FootDiagram type={stance.key} />
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: spacing.md },
  pageTitle: {
    fontSize: 28, fontWeight: '900', color: '#1f2937',
    textAlign: 'center', marginVertical: spacing.lg, letterSpacing: 2,
  },
  stanceRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: spacing.lg,
  },
  stanceDivider: {
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  stanceLeft: { flex: 1, paddingRight: spacing.sm },
  stanceName: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 4, lineHeight: 26 },
  stanceKorean: { fontSize: 15, fontWeight: '700', color: '#16a34a', marginBottom: 8 },
  stanceDetail: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 2 },
  stanceBold: { fontWeight: '700', color: '#1f2937' },
  stanceExtra: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginTop: 4 },
});

// Diagram styles
const d = StyleSheet.create({
  box: {
    width: 110, height: 90,
    backgroundColor: '#f8fafc',
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  vLine: {
    position: 'absolute', left: '50%', top: 0, bottom: 0,
    width: 2, backgroundColor: '#3b82f6', marginLeft: -1,
  },
  hLine: {
    position: 'absolute', top: '50%', left: 0, right: 0,
    height: 2, backgroundColor: '#ef4444', marginTop: -1,
  },
  foot: { position: 'absolute', fontSize: 22 },
  footRaised: { position: 'absolute', fontSize: 18, opacity: 0.4 },
  pct: { position: 'absolute', fontSize: 9, color: '#374151', fontWeight: '700' },
});

export default StancesScreen;
