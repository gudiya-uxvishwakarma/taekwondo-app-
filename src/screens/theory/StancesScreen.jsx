import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity, Modal, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_BASE = API_CONFIG.BASE_URL;
const BASE_URL = API_BASE.replace('/api', '');

// ─── Foot diagram ─────────────────────────────────────────────────────────────
const FootDiagram = ({ type, dark = false }) => {
  const lineV = dark ? '#60a5fa' : '#3b82f6';
  const lineH = dark ? '#f87171' : '#ef4444';
  const bg    = dark ? '#1e293b' : '#f8fafc';
  const border= dark ? '#334155' : '#e2e8f0';
  const pctColor = dark ? '#cbd5e1' : '#374151';

  const box = {
    width: dark ? 160 : 110,
    height: dark ? 120 : 90,
    backgroundColor: bg,
    borderWidth: 1, borderColor: border,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  };
  const vLine = { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: lineV, marginLeft: -1 };
  const hLine = { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: lineH, marginTop: -1 };
  const fs = dark ? 30 : 22;
  const fsR = dark ? 24 : 18;
  const fsPct = dark ? 11 : 9;

  const diagrams = {
    parallel: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position: 'absolute', fontSize: fs, top: dark?24:18, left: dark?30:22 }}>🦶</Text>
        <Text style={{ position: 'absolute', fontSize: fs, top: dark?24:18, right: dark?30:22, transform:[{scaleX:-1}] }}>🦶</Text>
        <Text style={{ position: 'absolute', fontSize: fsPct, color: pctColor, fontWeight:'700', bottom:6, left:dark?18:14 }}>50%</Text>
        <Text style={{ position: 'absolute', fontSize: fsPct, color: pctColor, fontWeight:'700', bottom:6, right:dark?12:8 }}>50%</Text>
      </View>
    ),
    walking: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?40:30 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?14:10, right:dark?24:18, transform:[{rotate:'15deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?12:8 }}>50%</Text>
      </View>
    ),
    attention: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?28:22, left:dark?22:16, transform:[{rotate:'-20deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, top:dark?28:22, right:dark?22:16, transform:[{scaleX:-1},{rotate:'-20deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?14:10 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?10:6 }}>50%</Text>
      </View>
    ),
    sitting: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?26:20, left:dark?6:4 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, top:dark?26:20, right:dark?6:4, transform:[{scaleX:-1}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?8:6 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?6:4 }}>50%</Text>
      </View>
    ),
    lstance: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>30%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?12:8, right:dark?20:14, transform:[{rotate:'90deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>70%</Text>
      </View>
    ),
    fixed: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?16:12, left:dark?36:26 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?44:32, left:dark?18:14 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?14:10, right:dark?22:16 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?10:8 }}>50%</Text>
      </View>
    ),
    bending: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?18:14 }}>100%</Text>
        <Text style={{ position:'absolute', fontSize:fsR, opacity:0.4, top:dark?10:8, right:dark?28:20 }}>🦶</Text>
      </View>
    ),
    rearfoot: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>10%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?12:8, right:dark?20:14 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>90%</Text>
      </View>
    ),
    low: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?10:8, left:dark?8:6 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?10:8, right:dark?8:6, transform:[{scaleX:-1}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?8:6 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?6:4 }}>50%</Text>
      </View>
    ),
    oneleg: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?14:10 }}>100%</Text>
        <Text style={{ position:'absolute', fontSize:fsR, opacity:0.4, top:dark?8:6, right:dark?30:22 }}>🦶</Text>
      </View>
    ),
    diagonal: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?24:18, left:dark?14:10, transform:[{rotate:'-45deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, top:dark?24:18, right:dark?14:10, transform:[{scaleX:-1},{rotate:'-45deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?14:10 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>50%</Text>
      </View>
    ),
    close: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?26:20, left:dark?38:28, transform:[{rotate:'-10deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, top:dark?26:20, right:dark?38:28, transform:[{scaleX:-1},{rotate:'-10deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?14:10 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?10:6 }}>50%</Text>
      </View>
    ),
    open: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?24:18, left:dark?10:8, transform:[{rotate:'30deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, top:dark?24:18, right:dark?10:8, transform:[{scaleX:-1},{rotate:'30deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?8:6 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?6:4 }}>50%</Text>
      </View>
    ),
    crouched: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?12:8, right:dark?20:14, transform:[{rotate:'45deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>50%</Text>
      </View>
    ),
    xstance: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?18:14, left:dark?28:20, transform:[{rotate:'-30deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?18:14, right:dark?28:20, transform:[{scaleX:-1},{rotate:'-30deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, left:dark?8:6 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?6:4 }}>50%</Text>
      </View>
    ),
    vertical: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?12:8, right:dark?20:14 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>50%</Text>
      </View>
    ),
    warrior: (
      <View style={box}>
        <View style={vLine} /><View style={hLine} />
        <Text style={{ position:'absolute', fontSize:fs, top:dark?14:10, left:dark?38:28 }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', top:dark?42:30, left:dark?18:14 }}>50%</Text>
        <Text style={{ position:'absolute', fontSize:fs, bottom:dark?12:8, right:dark?20:14, transform:[{rotate:'90deg'}] }}>🦶</Text>
        <Text style={{ position:'absolute', fontSize:fsPct, color:pctColor, fontWeight:'700', bottom:6, right:dark?8:6 }}>50%</Text>
      </View>
    ),
  };
  return diagrams[type] || diagrams.parallel;
};

// ─── SECTIONS DATA ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: null,
    color: '#dc2626',
    stances: [
      { key: 'close',    name: 'Close Stance',    korean: 'Moa Sogi',         weight: '50/50', width: 'Feet together',                    length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Stand with the feet together. It can be either full facing or side facing.' },
      { key: 'parallel', name: 'Parallel Stance', korean: 'Narani Sogi',      weight: '50/50', width: '1 shoulder width between insteps', length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Feet parallel, shoulder-width apart. Natural, relaxed standing position.' },
      { key: 'open',     name: 'Open Stance',     korean: 'Beon Sogi',        weight: '50/50', width: '1 shoulder width',                 length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Toes turned outward at approximately 30°. Relaxed, open posture.' },
      { key: 'walking',  name: 'Walking Stance',  korean: 'Gunnun Sogi',      weight: '50/50', width: '1 shoulder width between insteps', length: '1½ shoulder width between big toes', facing: 'Full or Half', lr: 'Leading foot',  extra: 'Rear foot pointed about 15° outwards. Most common offensive stance.' },
      { key: 'lstance',  name: 'L-Stance',        korean: 'Niunja Sogi',      weight: 'Rear 70 / Front 30', width: '1 shoulder width between insteps', length: '1½ shoulder width (front to back)', facing: 'Half', lr: 'Rear foot', extra: 'Front foot points forward, rear foot points 90° to the side. Primary defensive stance.' },
      { key: 'fixed',    name: 'Fixed Stance',    korean: 'Gojung Sogi',      weight: '50/50', width: '1 shoulder width between insteps', length: '1 shoulder width (front to back)', facing: 'Full',        lr: 'N/A',           extra: 'Both feet flat on the ground, shorter than walking stance. Stable for powerful techniques.' },
      { key: 'sitting',  name: 'Sitting Stance',  korean: 'Annun Sogi',       weight: '50/50', width: '1½ shoulder width between insteps', length: null,                             facing: 'Full or Side', lr: 'N/A',           extra: 'Toes point forward, knees bent directly over toes. Strong lateral stance.' },
      { key: 'diagonal', name: 'Diagonal Stance', korean: 'Sasun Sogi',       weight: '50/50', width: '1 shoulder width between insteps', length: null,                              facing: 'Half',         lr: 'N/A',           extra: 'Feet at 45° angle, presents smaller target to opponent.' },
      { key: 'crouched', name: 'Crouched Stance', korean: 'Oguryo Sogi',      weight: '50/50', width: '1 shoulder width',                 length: '1 shoulder width (front to back)', facing: 'Half',        lr: 'Leading foot',  extra: 'Body lowered with knees deeply bent. Used for low attacks and evasion.' },
      { key: 'xstance',  name: 'X-Stance',        korean: 'Kyocha Sogi',      weight: '50/50', width: 'Feet crossed',                     length: null,                              facing: 'Full or Half', lr: 'N/A',           extra: 'One foot crossed behind the other. Transitional stance before jumping or spinning techniques.' },
      { key: 'oneleg',   name: 'One-Leg Stance',  korean: 'Waebal Sogi',      weight: '100% on standing leg', width: null,               length: null,                              facing: 'Full or Half', lr: 'Standing foot', extra: 'Other knee raised to hip height. Used before kicking techniques.' },
      { key: 'bending',  name: 'Bending Stance',  korean: 'Guburyo Sogi',     weight: '100% on standing leg', width: null,               length: null,                              facing: 'Full or Half', lr: 'Standing foot', extra: 'Raised foot tucked behind the standing knee. Transitional stance for hooking kicks.' },
      { key: 'vertical', name: 'Vertical Stance', korean: 'Soojik Sogi',      weight: '50/50', width: '½ shoulder width',                length: '1 shoulder width (front to back)', facing: 'Half',        lr: 'Leading foot',  extra: 'Narrow front-to-back stance, feet in line. Used for quick forward/backward movement.' },
      { key: 'rearfoot', name: 'Rear Foot Stance',korean: 'Dwit Bal Sogi',    weight: 'Rear 90 / Front 10', width: '1 shoulder width between insteps', length: '1 shoulder width (front to back)', facing: 'Half', lr: 'Rear foot', extra: 'Front heel raised, barely touching the ground. Allows rapid front leg kick.' },
      { key: 'low',      name: 'Low Stance',      korean: 'Nachuo Sogi',      weight: '50/50', width: '2 shoulder widths between insteps', length: null,                             facing: 'Full or Half', lr: 'Leading foot',  extra: 'Very low, wide stance with knees deeply bent. Maximum stability.' },
    ],
  },
  {
    title: null,
    color: '#006CB5',
    stances: [
      { key: 'attention', name: 'Attention Stance',       korean: 'Charyot Sogi',       weight: '50/50',              width: null,                  length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Heels touching, toes point out at 45°. Used for formal commands and bowing.' },
      { key: 'parallel',  name: 'Parallel Ready Stance',  korean: 'Narani Junbi Sogi',  weight: '50/50',              width: '1 shoulder width',    length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Feet parallel, fists held at belt level in front. Standard ready position.' },
      { key: 'open',      name: 'Open Ready Stance',      korean: 'Beon Junbi Sogi',    weight: '50/50',              width: '1 shoulder width',    length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Toes turned outward, open hands held in front at waist height.' },
      { key: 'sitting',   name: 'Sitting Ready Stance',   korean: 'Annun Junbi Sogi',   weight: '50/50',              width: '1½ shoulder width',   length: null,                              facing: 'Full or Side', lr: 'N/A',           extra: 'Sitting stance with fists at belt level. Used at the start of some patterns.' },
      { key: 'close',     name: 'Close Ready Stance',     korean: 'Moa Junbi Sogi',     weight: '50/50',              width: 'Feet together',       length: null,                              facing: 'Full',         lr: 'N/A',           extra: 'Feet together with hands in a specific guard position. Several variations (A, B, C) exist.' },
      { key: 'walking',   name: 'Walking Ready Stance',   korean: 'Gunnun Junbi Sogi',  weight: '50/50',              width: '1 shoulder width',    length: '1½ shoulder width',               facing: 'Full or Half', lr: 'Leading foot',  extra: 'Walking stance with arms in a guarding position. Prepares for pattern execution.' },
      { key: 'bending',   name: 'Bending Ready Stance',   korean: 'Guburyo Junbi Sogi', weight: '100% on standing leg', width: null,               length: null,                              facing: 'Full or Half', lr: 'Standing foot', extra: 'One knee raised, arms in guard. Prepares for kicking or jumping techniques.' },
      { key: 'warrior',   name: 'Warrior Ready Stance',   korean: 'Saja Junbi Sogi',    weight: '50/50',              width: '1 shoulder width',    length: '1 shoulder width (front to back)', facing: 'Half',        lr: 'Leading foot',  extra: 'Aggressive forward-leaning ready position. Arms extended in a guarding posture.' },
      { key: 'lstance',   name: 'L-Ready Stance',         korean: 'Niunja Junbi Sogi',  weight: 'Rear 70 / Front 30', width: '1 shoulder width',    length: '1½ shoulder width',               facing: 'Half',         lr: 'Rear foot',     extra: 'L-stance with arms in a defensive guard. Used at the start of defensive patterns.' },
      { key: 'xstance',   name: 'X-Ready Stance',         korean: 'Kyocha Junbi Sogi',  weight: '50/50',              width: 'Feet crossed',        length: null,                              facing: 'Full or Half', lr: 'N/A',           extra: 'Crossed feet with arms crossed in front of the body. Transitional ready position.' },
    ],
  },
];

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const StanceDetailModal = ({ stance, visible, onClose }) => {
  if (!stance) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={m.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        {/* Header */}
        <View style={m.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={m.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={m.headerTitle} numberOfLines={1}>Stance</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={m.body}>
          {/* Name */}
          <Text style={m.name}>{stance.name} ({stance.korean})</Text>

          {/* Foot diagram image - only show if uploaded */}
          {stance.diagramImage ? (
            <View style={m.diagramWrap}>
              <Image source={{ uri: `${BASE_URL}${stance.diagramImage}` }} style={m.diagramImage} resizeMode="contain" />
            </View>
          ) : null}

          {/* Description */}
          <Text style={m.description}>{stance.description || stance.extra}</Text>

          {/* Person images - only show if available */}
          {stance.personImages?.length > 0
            ? stance.personImages.map((img, i) => (
                <Image key={i} source={{ uri: `${BASE_URL}${img}` }} style={m.personImage} resizeMode="contain" />
              ))
            : stance.personImage
              ? <Image source={{ uri: `${BASE_URL}${stance.personImage}` }} style={m.personImage} resizeMode="contain" />
              : null
          }
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StancesScreen = ({ onBack }) => {
  const [selectedStance, setSelectedStance] = useState(null);
  const [stances, setStances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/stances`)
      .then(r => r.json())
      .then(d => setStances(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Use API data if available, otherwise fall back to all hardcoded stances
  const allHardcoded = [...SECTIONS[0].stances, ...SECTIONS[1].stances];
  const displayList  = stances.length > 0 ? stances : allHardcoded;

  const renderStance = (stance, index, arr) => (
    <TouchableOpacity
      key={stance._id || `${stance.key}-${index}`}
      style={[styles.stanceRow, index < arr.length - 1 && styles.stanceDivider]}
      onPress={() => setSelectedStance(stance)}
      activeOpacity={0.7}
    >
      <View style={styles.stanceLeft}>
        <Text style={styles.stanceName}>{stance.name}</Text>
        <Text style={styles.stanceKorean}>{stance.korean}</Text>
        {stance.weight      ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Weight: </Text>{stance.weight}</Text>      : null}
        {stance.width       ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Width: </Text>{stance.width}</Text>         : null}
        {(stance.length || stance.stanceLength) ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Length: </Text>{stance.length || stance.stanceLength}</Text> : null}
        {stance.facing      ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>Facing: </Text>{stance.facing}</Text>       : null}
        {stance.lr          ? <Text style={styles.stanceDetail}><Text style={styles.stanceBold}>L/R: </Text>{stance.lr}</Text>              : null}
        {stance.title       ? <Text style={styles.stanceTitle}>{stance.title}</Text> : null}
      </View>
      {/* Diagram image - only show if uploaded */}
      {stance.diagramImage
        ? <Image source={{ uri: `${BASE_URL}${stance.diagramImage}` }} style={styles.diagramThumb} resizeMode="contain" />
        : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stances</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#006CB5" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {displayList.map((s, i) => renderStance(s, i, displayList))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <StanceDetailModal
        stance={selectedStance}
        visible={!!selectedStance}
        onClose={() => setSelectedStance(null)}
      />
    </SafeAreaView>
  );
};

// ─── List styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#0057a0', backgroundColor: '#006CB5',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: spacing.md },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderLeftWidth: 4, borderLeftColor: '#006CB5', paddingLeft: spacing.sm,
    marginTop: spacing.xl, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#006CB5', letterSpacing: 0.5 },
  sectionCount: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  sectionSpacer: { height: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: spacing.sm },
  stanceRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.lg },
  stanceDivider: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  stanceLeft: { flex: 1, paddingRight: spacing.sm },
  stanceName: { fontSize: 18, fontWeight: '800', color: '#1f2937', marginBottom: 4, lineHeight: 24 },
  stanceKorean: { fontSize: 14, fontWeight: '700', color: '#006CB5', marginBottom: 8 },
  stanceDetail: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 2 },
  stanceBold: { fontWeight: '700', color: '#1f2937' },
  stanceExtra: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginTop: 4 },
  stanceTitle: { fontSize: 14, fontWeight: '700', color: '#6b7280', lineHeight: 20, marginTop: 6 },
  diagramThumb: { width: 110, height: 90, borderRadius: 8, backgroundColor: '#f8fafc' },
});

// ─── Modal styles ─────────────────────────────────────────────────────────────
const m = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#0057a0', backgroundColor: '#006CB5',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  body: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  name: {
    fontSize: 26, fontWeight: '900', color: '#1f2937',
    marginTop: spacing.xl, marginBottom: spacing.lg, lineHeight: 34,
  },
  diagramWrap: {
    alignItems: 'center', marginBottom: spacing.xl,
  },
  description: {
    fontSize: 16, color: '#374151', lineHeight: 26,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 17, fontWeight: '700', color: '#006CB5',
    marginBottom: spacing.sm,
  },
  diagramImage: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  personImage: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginBottom: spacing.xl,
  },
});

export default StancesScreen;
