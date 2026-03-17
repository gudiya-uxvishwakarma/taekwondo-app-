import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity, Modal,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

const bodyParts = [
  { name: 'Forefist', korean: 'Ap Joomuk', emoji: '✊', highlight: 'knuckles', color: '#ef4444' },
  { name: 'Knifehand', korean: 'Sonkal', emoji: '🖐', highlight: 'edge', color: '#ef4444' },
  { name: 'Palm', korean: 'Sonbadak', emoji: '🤚', highlight: 'palm', color: '#ef4444' },
  { name: 'Fingertips', korean: 'Sonkut', emoji: '🖐', highlight: 'tips', color: '#ef4444' },
  { name: 'Backfist', korean: 'Dung Joomuk', emoji: '✊', highlight: 'back', color: '#ef4444' },
  { name: 'Sidefist', korean: 'Yop Joomuk', emoji: '✊', highlight: 'side', color: '#ef4444' },
  { name: 'Reverse Knifehand', korean: 'Sonkal Dung', emoji: '🖐', highlight: 'reverse', color: '#ef4444' },
  { name: 'Elbow', korean: 'Palkup', emoji: '💪', highlight: 'elbow', color: '#ef4444' },
  { name: 'Outer Forearm', korean: 'Bakkat Palmok', emoji: '🦾', highlight: 'outer', color: '#ef4444' },
  { name: 'Inner Forearm', korean: 'An Palmok', emoji: '🦾', highlight: 'inner', color: '#ef4444' },
  { name: 'Ball of the Foot', korean: 'Ap Kumchi', emoji: '🦶', highlight: 'ball', color: '#ef4444' },
  { name: 'Toes', korean: 'Sonbadak Bal', emoji: '🦶', highlight: 'toes', color: '#ef4444' },
  { name: 'Heel', korean: 'Dwit Chook', emoji: '🦶', highlight: 'heel', color: '#ef4444' },
  { name: 'Footsword', korean: 'Balkal', emoji: '🦶', highlight: 'side', color: '#ef4444' },
  { name: 'Instep', korean: 'Baldung', emoji: '🦶', highlight: 'instep', color: '#ef4444' },
  { name: 'Knee', korean: 'Moorup', emoji: '🦵', highlight: 'knee', color: '#ef4444' },
];

// Simple illustrated body part card using shapes
const BodyPartCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardImageBox}>
      <Text style={styles.cardEmoji}>{item.emoji}</Text>
      <View style={[styles.redDot, getRedDotPosition(item.highlight)]} />
    </View>
    <Text style={styles.cardName}>{item.name}</Text>
    <Text style={styles.cardKorean}>{item.korean}</Text>
  </View>
);

const getRedDotPosition = (highlight) => {
  const positions = {
    knuckles: { top: 8, left: 12 },
    edge:     { top: 20, right: 8 },
    palm:     { top: 22, left: 18 },
    tips:     { top: 4, left: 20 },
    back:     { top: 10, right: 10 },
    side:     { top: 18, left: 6 },
    reverse:  { top: 20, left: 6 },
    elbow:    { top: 14, left: 14 },
    outer:    { top: 16, right: 8 },
    inner:    { top: 16, left: 8 },
    ball:     { top: 10, left: 14 },
    toes:     { top: 4, left: 16 },
    heel:     { bottom: 6, left: 16 },
    instep:   { top: 12, left: 18 },
    knee:     { top: 8, left: 14 },
  };
  return positions[highlight] || { top: 12, left: 12 };
};

const LevelsSection = () => (
  <View style={styles.levelsBox}>
    <Text style={styles.levelsTitle}>Levels and Lines</Text>
    <View style={styles.levelsContent}>
      {/* Body figure */}
      <View style={styles.bodyFigure}>
        <View style={styles.figureHead} />
        <View style={styles.figureBody}>
          <View style={styles.figureArms} />
          <View style={styles.figureTorso} />
        </View>
        <View style={styles.figureLegs} />
        {/* Level lines */}
        <View style={[styles.levelLine, { top: '18%', borderColor: '#3b82f6' }]} />
        <View style={[styles.levelLine, { top: '38%', borderColor: '#ef4444' }]} />
        <View style={[styles.levelLine, { top: '62%', borderColor: '#22c55e' }]} />
        {/* Labels */}
        <Text style={[styles.levelLabel, { top: '14%', color: '#3b82f6' }]}>Nopunde</Text>
        <Text style={[styles.levelLabel, { top: '34%', color: '#ef4444' }]}>Kaunde</Text>
        <Text style={[styles.levelLabel, { top: '58%', color: '#22c55e' }]}>Najunde</Text>
      </View>
    </View>
    <View style={styles.legendBox}>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#22c55e' }]}>Nopunde</Text><Text style={styles.legendDark}> – High Section</Text></Text>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#22c55e' }]}>Kaunde</Text><Text style={styles.legendDark}> – Middle Section</Text></Text>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#22c55e' }]}>Najunde</Text><Text style={styles.legendDark}> – Low Section</Text></Text>
    </View>
    <View style={styles.legendBox}>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#ef4444' }]}>Red Line</Text><Text style={styles.legendDark}> – Centre Line</Text></Text>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#22c55e' }]}>Green Line</Text><Text style={styles.legendDark}> – Chest Line</Text></Text>
      <Text style={styles.legendItem}><Text style={[styles.legendBold, { color: '#3b82f6' }]}>Blue Line</Text><Text style={styles.legendDark}> – Shoulder Line</Text></Text>
    </View>
  </View>
);

const vitalPoints = [
  {
    name: 'Arc Hand',
    points: [
      { n: 1, label: 'Upper neck' },
      { n: 2, label: 'Adams Apple' },
      { n: 3, label: 'Point of the chin' },
    ],
  },
  {
    name: 'Back Heel',
    points: [
      { n: 1, label: 'Chest' },
      { n: 2, label: 'Skull' },
      { n: 3, label: 'Temple' },
      { n: 4, label: 'Heart' },
      { n: 5, label: 'Liver / Floating Ribs' },
      { n: 6, label: 'Spleen' },
      { n: 7, label: 'Solar Plexus' },
      { n: 8, label: 'Bladder' },
      { n: 9, label: 'Stomach' },
      { n: 10, label: 'Groin' },
      { n: 11, label: 'Lower abdomen' },
      { n: 12, label: 'Knee joint' },
      { n: 13, label: 'Shin' },
    ],
  },
  {
    name: 'Back Fist',
    points: [
      { n: 1, label: 'Temple' },
      { n: 2, label: 'Bridge of the nose' },
      { n: 3, label: 'Philtrum (upper lip)' },
    ],
  },
  {
    name: 'Back Hand',
    points: [
      { n: 1, label: 'Back of the hand' },
      { n: 2, label: 'Wrist joint' },
    ],
  },
  {
    name: 'Ball of the Foot',
    points: [
      { n: 1, label: 'Solar Plexus' },
      { n: 2, label: 'Chin' },
      { n: 3, label: 'Groin' },
      { n: 4, label: 'Knee' },
    ],
  },
  {
    name: 'Base of Knifehand',
    points: [
      { n: 1, label: 'Neck / Carotid artery' },
      { n: 2, label: 'Collar bone' },
      { n: 3, label: 'Wrist' },
    ],
  },
  {
    name: 'Bear Hand',
    points: [
      { n: 1, label: 'Solar Plexus' },
      { n: 2, label: 'Throat' },
    ],
  },
  {
    name: 'Elbow',
    points: [
      { n: 1, label: 'Jaw / Chin' },
      { n: 2, label: 'Solar Plexus' },
      { n: 3, label: 'Ribs' },
      { n: 4, label: 'Spine' },
    ],
  },
  {
    name: 'Finger Pincers',
    points: [
      { n: 1, label: 'Throat / Windpipe' },
      { n: 2, label: 'Nose' },
    ],
  },
  {
    name: 'Finger Press',
    points: [
      { n: 1, label: 'Eyes' },
      { n: 2, label: 'Throat' },
      { n: 3, label: 'Pressure points on neck' },
    ],
  },
  {
    name: 'Finger Tips',
    points: [
      { n: 1, label: 'Eyes' },
      { n: 2, label: 'Throat' },
      { n: 3, label: 'Solar Plexus' },
    ],
  },
  {
    name: 'Foot Sword',
    points: [
      { n: 1, label: 'Knee joint (side)' },
      { n: 2, label: 'Ankle' },
      { n: 3, label: 'Shin' },
    ],
  },
  {
    name: 'Forefist',
    points: [
      { n: 1, label: 'Face / Nose' },
      { n: 2, label: 'Solar Plexus' },
      { n: 3, label: 'Jaw' },
      { n: 4, label: 'Ribs' },
    ],
  },
  {
    name: 'Forehead',
    points: [
      { n: 1, label: 'Nose (head butt)' },
      { n: 2, label: 'Chin' },
    ],
  },
];

const VitalPointsSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selected = vitalPoints[selectedIndex];

  return (
    <View style={styles.vitalBox}>
      <Text style={styles.vitalTitle}>Vital Points</Text>

      {/* Dropdown trigger */}
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setDropdownOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownBtnText}>{selected.name}</Text>
        <Icon name="arrow-drop-down" size={24} color="#fff" type="MaterialIcons" />
      </TouchableOpacity>

      {/* Body diagram placeholder with numbered points */}
      <View style={styles.diagramBox}>
        <View style={styles.diagramFigure}>
          {/* Simple stick figure */}
          <View style={styles.figHead} />
          <View style={styles.figTorso} />
          <View style={styles.figArms} />
          <View style={styles.figLegs} />
        </View>
        {/* Numbered points listed on diagram */}
        <View style={styles.diagramPoints}>
          {selected.points.map((p) => (
            <View key={p.n} style={styles.diagramPointRow}>
              <Text style={styles.diagramPointNum}>{p.n}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Points legend */}
      <View style={styles.pointsLegend}>
        {selected.points.map((p) => (
          <Text key={p.n} style={styles.pointLegendText}>
            <Text style={styles.pointLegendNum}>{p.n}: </Text>{p.label}
          </Text>
        ))}
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setDropdownOpen(false)}
        >
          <View style={styles.dropdownList}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {vitalPoints.map((item, index) => (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.dropdownItem, index === selectedIndex && styles.dropdownItemActive]}
                  onPress={() => { setSelectedIndex(index); setDropdownOpen(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownItemText, index === selectedIndex && styles.dropdownItemTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const blockingTools = [
  {
    name: 'Arch-Hand',
    direction: 'Rising',
    parts: [
      { part: 'Back Tibia', methods: [
        { method: 'Pick-shape Kick', tool: 'Back Heel' },
      ]},
      { part: 'Inner Tibia', methods: [
        { method: 'Pick-shape Kick', tool: 'Back Heel' },
      ]},
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Under Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
    ],
  },
  {
    name: 'Back Hand',
    direction: 'Outward',
    parts: [
      { part: 'Back Tibia', methods: [
        { method: 'Back Piercing Kick', tool: 'Footsword' },
        { method: 'Side Piercing Kick', tool: 'Footsword' },
        { method: 'Side Thrusting Kick', tool: 'Footsword' },
      ]},
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
    ],
  },
  {
    name: 'Back Sole',
    direction: 'Downward',
    parts: [
      { part: 'Shin', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Front Snap Kick', tool: 'Ball of the Foot' },
      ]},
      { part: 'Instep', methods: [
        { method: 'Kick', tool: 'Ball of the Foot' },
      ]},
      { part: 'Ankle', methods: [
        { method: 'Side Kick', tool: 'Footsword' },
        { method: 'Turning Kick', tool: 'Ball of the Foot' },
      ]},
    ],
  },
  {
    name: 'Ball of the Foot',
    direction: 'Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Rising Kick', tool: 'Ball of the Foot' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
      ]},
    ],
  },
  {
    name: 'Bow Wrist',
    direction: 'Inward',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
    ],
  },
  {
    name: 'Double Forearm',
    direction: 'Rising / Outward',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
    ],
  },
  {
    name: 'Footsword',
    direction: 'Downward / Inward',
    parts: [
      { part: 'Knee joint', methods: [
        { method: 'Side Kick', tool: 'Footsword' },
        { method: 'Side Piercing Kick', tool: 'Footsword' },
      ]},
      { part: 'Ankle', methods: [
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
      { part: 'Shin', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
    ],
  },
  {
    name: 'Forefist',
    direction: 'Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Rising Punch', tool: 'Forefist' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
    ],
  },
  {
    name: 'Inner Forearm',
    direction: 'Inward / Outward / Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Shin', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
    ],
  },
  {
    name: 'Knifehand',
    direction: 'Inward / Outward / Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
        { method: 'Reverse Strike', tool: 'Reverse Knifehand' },
      ]},
    ],
  },
  {
    name: 'Outer Forearm',
    direction: 'Inward / Outward / Rising / Downward',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Shin', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
      { part: 'Instep', methods: [
        { method: 'Turning Kick', tool: 'Ball of the Foot' },
        { method: 'Side Kick', tool: 'Footsword' },
      ]},
    ],
  },
  {
    name: 'Palm',
    direction: 'Inward / Outward / Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Strike', tool: 'Knifehand' },
      ]},
    ],
  },
  {
    name: 'Reverse Knifehand',
    direction: 'Inward / Outward',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
        { method: 'Strike', tool: 'Knifehand' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Punch', tool: 'Forefist' },
      ]},
      { part: 'Wrist', methods: [
        { method: 'Reverse Strike', tool: 'Reverse Knifehand' },
      ]},
    ],
  },
  {
    name: 'Toes',
    direction: 'Rising',
    parts: [
      { part: 'Outer Forearm', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
        { method: 'Rising Kick', tool: 'Ball of the Foot' },
      ]},
      { part: 'Inner Forearm', methods: [
        { method: 'Front Kick', tool: 'Ball of the Foot' },
      ]},
    ],
  },
];

const BlockingToolsSection = () => {
  const [invertOrder, setInvertOrder] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false);
  const [partDropdownOpen, setPartDropdownOpen] = useState(false);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);

  const tools = invertOrder ? [...blockingTools].reverse() : blockingTools;
  const selected = tools[selectedToolIndex];
  const parts = selected.parts;
  const currentPart = parts[selectedPartIndex];
  const methods = currentPart.methods;
  const currentMethod = methods[selectedMethodIndex];

  const handleToolSelect = (index) => {
    setSelectedToolIndex(index);
    setSelectedPartIndex(0);
    setSelectedMethodIndex(0);
    setToolDropdownOpen(false);
  };

  const handlePartSelect = (index) => {
    setSelectedPartIndex(index);
    setSelectedMethodIndex(0);
    setPartDropdownOpen(false);
  };

  return (
    <View style={styles.blockingBox}>
      <Text style={styles.blockingTitle}>Blocking Tools</Text>

      {/* Invert Branch Order checkbox */}
      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => { setInvertOrder(!invertOrder); setSelectedToolIndex(0); setSelectedPartIndex(0); }}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, invertOrder && styles.checkboxChecked]}>
          {invertOrder && <Icon name="check" size={14} color="#fff" type="MaterialIcons" />}
        </View>
        <Text style={styles.checkLabel}>Invert Branch Order</Text>
      </TouchableOpacity>

      {/* Blocking Tool row */}
      <View style={styles.blockRow}>
        <Text style={styles.blockLabel}>Blocking Tool</Text>
        <TouchableOpacity style={styles.blockValueBtn} onPress={() => setToolDropdownOpen(true)} activeOpacity={0.8}>
          <Text style={styles.blockValueText}>{selected.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Direction row */}
      <View style={styles.blockRow}>
        <Text style={styles.blockLabel}>Direction</Text>
        <View style={styles.blockValueBtn}>
          <Text style={styles.blockValueText}>{selected.direction}</Text>
        </View>
      </View>

      {/* Part Blocked row */}
      <View style={styles.blockRow}>
        <Text style={styles.blockLabel}>Part Blocked</Text>
        {parts.length > 1 ? (
          <TouchableOpacity style={styles.blockValueBtn} onPress={() => setPartDropdownOpen(true)} activeOpacity={0.8}>
            <Text style={styles.blockValueText}>{currentPart.part}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.blockValueBtn}>
            <Text style={styles.blockValueText}>{currentPart.part}</Text>
          </View>
        )}
      </View>

      {/* Attacking Method row */}
      <View style={styles.blockRow}>
        <Text style={styles.blockLabel}>Attacking Method</Text>
        {methods.length > 1 ? (
          <TouchableOpacity style={styles.blockValueBtn} onPress={() => setMethodDropdownOpen(true)} activeOpacity={0.8}>
            <Text style={styles.blockValueText}>{currentMethod.method}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.blockValueBtn}>
            <Text style={styles.blockValueText}>{currentMethod.method}</Text>
          </View>
        )}
      </View>

      {/* Attacking Tool row */}
      <View style={styles.blockRow}>
        <Text style={styles.blockLabel}>Attacking Tool</Text>
        <View style={styles.blockValueBtn}>
          <Text style={styles.blockValueText}>{currentMethod.tool}</Text>
        </View>
      </View>

      {/* Blocking Tool Dropdown */}
      <Modal visible={toolDropdownOpen} transparent animationType="fade" onRequestClose={() => setToolDropdownOpen(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setToolDropdownOpen(false)}>
          <View style={styles.dropdownList}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {tools.map((item, index) => (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.dropdownItem, index === selectedToolIndex && styles.dropdownItemActive]}
                  onPress={() => handleToolSelect(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownItemText, index === selectedToolIndex && styles.dropdownItemTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {parts.length > 1 && (
        <Modal visible={partDropdownOpen} transparent animationType="fade" onRequestClose={() => setPartDropdownOpen(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setPartDropdownOpen(false)}>
            <View style={styles.dropdownList}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {parts.map((p, index) => (
                  <TouchableOpacity
                    key={p.part}
                    style={[styles.dropdownItem, index === selectedPartIndex && styles.dropdownItemActive]}
                    onPress={() => handlePartSelect(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownItemText, index === selectedPartIndex && styles.dropdownItemTextActive]}>
                      {p.part}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Attacking Method Dropdown */}
      {methods.length > 1 && (
        <Modal visible={methodDropdownOpen} transparent animationType="fade" onRequestClose={() => setMethodDropdownOpen(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setMethodDropdownOpen(false)}>
            <View style={styles.dropdownList}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {methods.map((m, index) => (
                  <TouchableOpacity
                    key={m.method}
                    style={[styles.dropdownItem, index === selectedMethodIndex && styles.dropdownItemActive]}
                    onPress={() => { setSelectedMethodIndex(index); setMethodDropdownOpen(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownItemText, index === selectedMethodIndex && styles.dropdownItemTextActive]}>
                      {m.method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const BodyPartsScreen = ({ onBack }) => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Body Parts</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
    

      {/* 2-column grid */}
      <View style={styles.grid}>
        {bodyParts.map((item) => (
          <BodyPartCard key={item.name} item={item} />
        ))}
      </View>

      <LevelsSection />
      <VitalPointsSection />
      <BlockingToolsSection />
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
    fontSize: 26, fontWeight: '900', color: '#1f2937',
    textAlign: 'center', marginTop: spacing.lg, marginBottom: spacing.md, letterSpacing: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.xl, marginTop: spacing.md },
  card: {
    width: '48%',
  },
  cardImageBox: {
    backgroundColor: '#f8fafc', borderRadius: 12, height: 110,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0', position: 'relative', overflow: 'hidden',
  },
  cardEmoji: { fontSize: 52 },
  redDot: {
    position: 'absolute', width: 22, height: 22,
    borderRadius: 11, backgroundColor: 'rgba(239,68,68,0.75)',
  },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginTop: 6, textAlign: 'center' },
  cardKorean: { fontSize: 12, color: '#16a34a', fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  // Levels section
  levelsBox: {
    marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: spacing.lg,
  },
  levelsTitle: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: spacing.md, textAlign: 'center' },
  levelsContent: { alignItems: 'center', marginBottom: spacing.md },
  bodyFigure: {
    width: 120, height: 260, position: 'relative', alignItems: 'center',
  },
  figureHead: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#f9fafb',
    marginBottom: 4,
  },
  figureBody: { alignItems: 'center' },
  figureArms: {
    width: 100, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#f9fafb', marginBottom: 2,
  },
  figureTorso: {
    width: 44, height: 70, borderRadius: 8,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#f9fafb',
  },
  figureLegs: {
    width: 44, height: 80, borderTopWidth: 0,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#f9fafb', borderRadius: 4,
  },
  levelLine: {
    position: 'absolute', left: -30, right: -30,
    borderTopWidth: 2, borderStyle: 'dashed',
  },
  levelLabel: {
    position: 'absolute', right: -70, fontSize: 12, fontWeight: '700',
  },
  legendBox: { marginBottom: spacing.sm, alignItems: 'center' },
  legendItem: { fontSize: 16, lineHeight: 28, textAlign: 'center' },
  legendBold: { fontWeight: '800' },
  legendDark: { color: '#1f2937', fontWeight: '400' },
  // Vital Points
  vitalBox: {
    marginTop: spacing.xl, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: spacing.lg,
  },
  vitalTitle: {
    fontSize: 20, fontWeight: '800', color: '#1f2937',
    textAlign: 'center', marginBottom: spacing.md,
  },
  dropdownBtn: {
    backgroundColor: '#9ca3af', borderRadius: 6, paddingHorizontal: spacing.md,
    paddingVertical: 12, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.lg,
  },
  dropdownBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  diagramBox: {
    borderWidth: 2, borderColor: '#1f2937', borderRadius: 8,
    minHeight: 220, padding: spacing.md, marginBottom: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  diagramFigure: { alignItems: 'center', marginRight: spacing.lg },
  figHead: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#e5e7eb', marginBottom: 4,
  },
  figTorso: {
    width: 40, height: 70, borderRadius: 6,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#e5e7eb', marginBottom: 2,
  },
  figArms: {
    position: 'absolute', top: 44, width: 90, height: 10,
    borderRadius: 5, borderWidth: 2, borderColor: '#374151', backgroundColor: '#e5e7eb',
  },
  figLegs: {
    width: 40, height: 60, borderRadius: 4,
    borderWidth: 2, borderColor: '#374151', backgroundColor: '#e5e7eb',
  },
  diagramPoints: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  diagramPointRow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center',
  },
  diagramPointNum: { color: '#fff', fontWeight: '800', fontSize: 13 },
  pointsLegend: { marginBottom: spacing.md },
  pointLegendText: { fontSize: 15, color: '#374151', lineHeight: 26 },
  pointLegendNum: { fontWeight: '800', color: '#1f2937' },
  // Dropdown modal
  dropdownOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dropdownList: {
    backgroundColor: '#9ca3af', borderRadius: 8, maxHeight: 400, overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  dropdownItemActive: { backgroundColor: 'rgba(0,0,0,0.15)' },
  dropdownItemText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  dropdownItemTextActive: { fontWeight: '800' },
  // Blocking Tools
  blockingBox: {
    marginTop: spacing.xl, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: spacing.lg,
  },
  blockingTitle: {
    fontSize: 20, fontWeight: '800', color: '#1f2937',
    textAlign: 'center', marginBottom: spacing.lg,
  },
  checkRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg,
  },
  checkbox: {
    width: 22, height: 22, borderWidth: 2, borderColor: '#9ca3af',
    borderRadius: 4, marginRight: spacing.md,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  checkLabel: { fontSize: 16, color: '#1f2937', fontWeight: '600' },
  blockRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.md,
  },
  blockLabel: { fontSize: 15, color: '#374151', flex: 1 },
  blockValueBtn: {
    backgroundColor: '#9ca3af', borderRadius: 6,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    minWidth: 160, alignItems: 'flex-start',
  },
  blockValueText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default BodyPartsScreen;
