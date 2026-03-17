import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import PATTERN_MOVES from './patternMoves';

const BELT_DATA = {
  1: {
    label: '10th Kup',
    colourMeaning: 'White signifies innocence as that of a beginning student who has no previous knowledge of Taekwon-Do.',
    patterns: [
      { number: 1, name: 'Saju Jirugi', meaning: 'Four Directional Punch', movements: 14, youtubeUrl: 'https://www.youtube.com/watch?v=example1', horizontal: true, vertical: true },
      { number: 2, name: 'Saju Makgi', meaning: 'Four Directional Block', movements: 16, youtubeUrl: 'https://www.youtube.com/watch?v=example2', horizontal: true, vertical: true },
    ],
    fundamentalMoves: [
      { korean: 'Bakat Palmok Najunde Makgi', english: 'Outer Forearm Low Block' },
      { korean: 'Ap Joomuk Kaunde Ap Jirugi', english: 'Front Fist Front Punch' },
      { korean: 'Sonkal Najunde Makgi', english: 'Knifehand Low Block' },
      { korean: 'An Palmok Kaunde Makgi', english: 'Inner Forearm Middle Block' },
      { korean: 'Bakat Palmok Chookyo Makgi', english: 'Outer Forearm Rising Block' },
      { korean: 'Ap Cha Busigi', english: 'Front Snap Kick' },
      { korean: 'Ap Cha Olligi', english: 'Front Rising Kick' },
    ],
  },
  2: {
    label: '9th Kup',
    colourMeaning: 'Yellow signifies the earth from which a plant sprouts and takes root as the foundation of Taekwon-Do is being laid.',
    patterns: [
      { number: 1, name: 'Chon-Ji', meaning: 'Heaven and Earth', movements: 19, youtubeUrl: 'https://www.youtube.com/watch?v=example3', horizontal: true, vertical: false },
    ],
    sparring: '3-step: 1, 2, 3',
    fundamentalMoves: [
      { korean: 'Narani Sogi', english: 'Parallel Stance' },
      { korean: 'Gunnun Sogi', english: 'Walking Stance' },
      { korean: 'Ap Joomuk Kaunde Ap Jirugi', english: 'Front Fist Middle Punch' },
      { korean: 'Bakat Palmok Najunde Makgi', english: 'Outer Forearm Low Block' },
    ],
  },
  3: {
    label: '8th Kup',
    colourMeaning: 'Yellow belt — the student is developing their foundation in Taekwon-Do.',
    patterns: [
      { number: 1, name: 'Dan-Gun', meaning: 'Holy Dan-Gun, founder of Korea', movements: 21, youtubeUrl: 'https://www.youtube.com/watch?v=example4', horizontal: false, vertical: true },
    ],
    sparring: '3-step: 4, 5, 6',
    technique: 'Continuous Motion: Movement 13 and 14',
    fundamentalMoves: [
      { korean: 'Nopunde Jirugi', english: 'High Punch' },
      { korean: 'Sonkal Kaunde Yop Taerigi', english: 'Knifehand Middle Side Strike' },
      { korean: 'Doo Palmok Makgi', english: 'Double Forearm Block' },
    ],
  },
  4: {
    label: '7th Kup',
    colourMeaning: "Green signifies the plant's growth as Taekwon-Do skills begin to develop.",
    patterns: [
      { number: 1, name: 'Do-San', meaning: 'Patriot Ahn Chang-Ho', movements: 24, youtubeUrl: 'https://www.youtube.com/watch?v=example5', horizontal: true, vertical: true },
    ],
    sparring: '3-step: 7, 8, 9',
    technique: 'Fast Motion: Movement 15 & 16 and 19 & 20\nStep Turn: Movement 2 to 3 and 10 to 11\nReleasing Movement: Movement 7',
    fundamentalMoves: [
      { korean: 'Ap Cha Busigi', english: 'Front Snap Kick' },
      { korean: 'Dollyo Chagi', english: 'Turning Kick' },
      { korean: 'Sonkal Makgi', english: 'Knifehand Block' },
    ],
  },
  5: {
    label: '6th Kup',
    colourMeaning: "Green belt — the student's skills are developing further.",
    patterns: [
      { number: 1, name: 'Won-Hyo', meaning: 'Monk Won-Hyo who introduced Buddhism to Silla dynasty', movements: 28, youtubeUrl: 'https://www.youtube.com/watch?v=example6', horizontal: true, vertical: false },
    ],
    sparring: '2-step: 1, 2, 3, 4',
    technique: 'Slipping the Foot: Movement 3, 6, 15 & 18',
    fundamentalMoves: [
      { korean: 'Niunja Sogi', english: 'L-Stance' },
      { korean: 'Sonkal Kaunde Makgi', english: 'Knifehand Middle Block' },
      { korean: 'Bandal Chagi', english: 'Semi-Circular Kick' },
    ],
  },
  6: {
    label: '5th Kup',
    colourMeaning: 'Blue signifies the sky towards which the plant matures into a towering tree.',
    patterns: [
      { number: 1, name: 'Yul-Gok', meaning: 'Philosopher Yul-Gok', movements: 38, youtubeUrl: 'https://www.youtube.com/watch?v=example7', horizontal: true, vertical: true },
    ],
    sparring: '2-step: 5, 6, 7',
    technique: 'Natural Movement: Movement 1, 4, 15 & 18\nFast Motion: Movement 2 & 3, 5 & 6, 9 & 10 and 13 & 14\nConnection Motion: Movement 16 & 17 and 19 & 20',
    fundamentalMoves: [
      { korean: 'Gojung Sogi', english: 'Fixed Stance' },
      { korean: 'Dwijibo Jirugi', english: 'Upset Punch' },
      { korean: 'Yop Chagi', english: 'Side Kick' },
    ],
  },
  7: {
    label: '4th Kup',
    colourMeaning: 'Blue belt — the student is reaching towards greater heights in Taekwon-Do.',
    patterns: [
      { number: 1, name: 'Joong-Gun', meaning: 'Patriot Ahn Joong-Gun', movements: 32, youtubeUrl: 'https://www.youtube.com/watch?v=example8', horizontal: false, vertical: true },
    ],
    sparring: '1-step: One step focuses on defending and counterattacking single punches in a walking stance. It starts from a parallel ready stance, with attacks initiated from both right and left sides.\n\nDefenders use blocking or evading techniques and respond with combinations of strikes or take-downs. Correct technique, targeting distance, and control are crucial, showcasing the exponents proficiency and expected grade level.',
    technique: 'Slipping the Foot: Movement 8 and 10\nReleasing & Fast Motion: Movement 16 and 19\nPulling the Foot: Movement 21 and 24\nSlow Motion: Movement 27, 29 and 30',
    fundamentalMoves: [
      { korean: 'Kyocha Joomuk Nopunde Makgi', english: 'X-Fist High Block' },
      { korean: 'Doo Palmok Makgi', english: 'Double Forearm Block' },
      { korean: 'Twimyo Ap Chagi', english: 'Flying Front Kick' },
    ],
  },
  8: {
    label: '3rd Kup',
    colourMeaning: 'Red signifies danger, cautioning the student to exercise control.',
    patterns: [
      { number: 1, name: 'Toi-Gye', meaning: 'Scholar Toi-Gye', movements: 37, youtubeUrl: 'https://www.youtube.com/watch?v=example9', horizontal: true, vertical: true },
    ],
    sparring: 'Free sparring',
    technique: 'Slipping the Foot: Movement 2 and 5\nPulling the Foot in a Slow Motion: Movement 3 and 6\nContinuous Motion: Movement 7 and 8\nSlow Motion: Movement 12\nStamping Movement: Movement 13 through 18',
    fundamentalMoves: [
      { korean: 'Sonkal Nopunde Makgi', english: 'Knifehand High Block' },
      { korean: 'Kaunde Dollyo Chagi', english: 'Middle Turning Kick' },
      { korean: 'Twimyo Yop Chagi', english: 'Flying Side Kick' },
    ],
  },
  9: {
    label: '2nd Kup',
    colourMeaning: 'Red belt — the student must exercise great care and control.',
    patterns: [
      { number: 1, name: 'Hwa-Rang', meaning: 'Hwa-Rang youth group', movements: 29, youtubeUrl: 'https://www.youtube.com/watch?v=example10', horizontal: true, vertical: false },
    ],
    sparring: 'Free sparring',
    technique: 'Sliding: Movement 6 and 25\nPulling the Foot: Movement 7, 11 and 21\nStep Turn: Movement 17\nFast Motion: Movement 18 & 19\nSlipping the Foot: Movement 25',
    fundamentalMoves: [
      { korean: 'Twimyo Dollyo Chagi', english: 'Flying Turning Kick' },
      { korean: 'Moorup Chagi', english: 'Knee Kick' },
      { korean: 'Dung Joomuk Nopunde Yop Taerigi', english: 'Back Fist High Side Strike' },
    ],
  },
  10: {
    label: '1st Kup',
    colourMeaning: 'Red/Black — the student is near black belt level, combining danger and maturity.',
    patterns: [
      { number: 1, name: 'Choong-Moo', meaning: 'Admiral Yi Soon-Sin', movements: 30, youtubeUrl: 'https://www.youtube.com/watch?v=example11', horizontal: true, vertical: true },
    ],
    sparring: 'Free sparring',
    technique: 'Slipping the Foot: Movement 1\nPulling the Foot: Movement 21\nStep Turn: Movement 29',
    fundamentalMoves: [
      { korean: 'Twimyo Nopunde Ap Chagi', english: 'Flying High Front Kick' },
      { korean: 'Bandae Dollyo Goro Chagi', english: 'Reverse Turning Hook Kick' },
      { korean: 'Sonkal Dung Kaunde Makgi', english: 'Knifehand Back Middle Block' },
    ],
  },
  11: {
    label: '1st Dan',
    colourMeaning: 'Black is the opposite of white, therefore signifying the maturity and proficiency in Taekwon-Do. It also indicates the wearer\'s imperviousness to darkness and fear.',
    patterns: [
      { number: 1, name: 'Kwang-Gae', meaning: 'Famous King Kwang-Gae-Toh-Wang', movements: 39, youtubeUrl: 'https://www.youtube.com/watch?v=dan1p1', horizontal: true, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 10, 11, 21 and 22\nDouble Stepping: Movement 4 and 6\nSlipping the Foot in a Slow Motion: Movement 26 and 30\nContinuous Motion: Movement 13, 14, 17 and 18\nPulling the Foot: Movement 16 and 20\nStamping Movement: Movement 23, 27, 31, 32 and 36' },
      { number: 2, name: 'Po-Eun', meaning: 'Loyal subject Chong Mong-Chu', movements: 36, youtubeUrl: 'https://www.youtube.com/watch?v=dan1p2', horizontal: true, vertical: false, technique: 'Continuous Motion: Movement 6 through 12 and 24 through 30\nSlow Motion: Movement 15 and 33' },
      { number: 3, name: 'Ge-Baek', meaning: 'General Ge-Baek of Baekje dynasty', movements: 44, youtubeUrl: 'https://www.youtube.com/watch?v=dan1p3', horizontal: false, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43 and 44\nContinuous Motion: Movement 5 through 8 and 17 through 20\nPulling the Foot: Movement 9 and 25\nStamping Movement: Movement 13, 14, 29 and 30' },
    ],
    fundamentalMoves: [
      { korean: 'Bakat Palmok Najunde Makgi', english: 'Outer Forearm Low Block' },
      { korean: 'Ap Joomuk Kaunde Ap Jirugi', english: 'Front Fist Front Punch' },
      { korean: 'Sonkal Najunde Makgi', english: 'Knifehand Low Block' },
      { korean: 'An Palmok Kaunde Makgi', english: 'Inner Forearm Middle Block' },
      { korean: 'Bakat Palmok Chookyo Makgi', english: 'Outer Forearm Rising Block' },
      { korean: 'Ap Cha Busigi', english: 'Front Snap Kick' },
      { korean: 'Ap Cha Olligi', english: 'Front Rising Kick' },
    ],
  },
  12: {
    label: '2nd Dan',
    colourMeaning: 'Black belt — the student has achieved a high level of proficiency and continues to grow.',
    patterns: [
      { number: 1, name: 'Eui-Am', meaning: 'Son Byong Hi, leader of Korean independence movement', movements: 45, youtubeUrl: 'https://www.youtube.com/watch?v=dan2p1', horizontal: true, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44 and 45\nContinuous Motion: Movement 6 through 10 and 18 through 22\nPulling the Foot: Movement 11 and 27\nStamping Movement: Movement 15, 16, 31 and 32' },
      { number: 2, name: 'Choong-Jang', meaning: 'General Kim Duk Ryang', movements: 52, youtubeUrl: 'https://www.youtube.com/watch?v=dan2p2', horizontal: true, vertical: false, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51 and 52\nContinuous Motion: Movement 7 through 12 and 20 through 25\nPulling the Foot: Movement 13 and 30\nStamping Movement: Movement 17, 18, 34 and 35' },
      { number: 3, name: 'Juche', meaning: 'The philosophical idea that man is the master of everything', movements: 45, youtubeUrl: 'https://www.youtube.com/watch?v=dan2p3', horizontal: false, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44 and 45\nContinuous Motion: Movement 5 through 9 and 17 through 21\nPulling the Foot: Movement 10 and 26\nStamping Movement: Movement 14, 15, 30 and 31' },
    ],
    fundamentalMoves: [
      { korean: 'Twimyo Ap Chagi', english: 'Flying Front Kick' },
      { korean: 'Twimyo Yop Chagi', english: 'Flying Side Kick' },
      { korean: 'Twimyo Dollyo Chagi', english: 'Flying Turning Kick' },
      { korean: 'Bandae Dollyo Chagi', english: 'Reverse Turning Kick' },
      { korean: 'Moorup Chagi', english: 'Knee Kick' },
    ],
  },
  13: {
    label: '3rd Dan',
    colourMeaning: 'Black belt — mastery of the previous techniques and beginning of advanced study.',
    patterns: [
      { number: 1, name: 'Sam-Il', meaning: 'The March 1st Movement of 1919', movements: 33, youtubeUrl: 'https://www.youtube.com/watch?v=dan3p1', horizontal: true, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 and 33\nContinuous Motion: Movement 4 through 7 and 14 through 17\nPulling the Foot: Movement 8 and 22\nStamping Movement: Movement 11, 12, 26 and 27' },
      { number: 2, name: 'Yoo-Sin', meaning: 'General Kim Yoo Sin', movements: 68, youtubeUrl: 'https://www.youtube.com/watch?v=dan3p2', horizontal: true, vertical: false, technique: 'Slow Motion: Movement 1 through 68\nContinuous Motion: Movement 8 through 13 and 22 through 27\nPulling the Foot: Movement 14 and 32\nStamping Movement: Movement 18, 19, 35 and 36' },
      { number: 3, name: 'Choi-Yong', meaning: 'General Choi Yong', movements: 46, youtubeUrl: 'https://www.youtube.com/watch?v=dan3p3', horizontal: false, vertical: true, technique: 'Slow Motion: Movement 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 and 46\nContinuous Motion: Movement 6 through 11 and 19 through 24\nPulling the Foot: Movement 12 and 28\nStamping Movement: Movement 16, 17, 32 and 33' },
    ],
    fundamentalMoves: [
      { korean: 'Twimyo Nopunde Dollyo Chagi', english: 'Flying High Turning Kick' },
      { korean: 'Twimyo Bandae Dollyo Chagi', english: 'Flying Reverse Turning Kick' },
      { korean: 'Sonkal Dung Kaunde Makgi', english: 'Knifehand Back Middle Block' },
    ],
  },
 
};

const BELTS = [
  { id: 1,  label: '10th Kup', colors: ['#ffffff'] },
  { id: 2,  label: '9th Kup',  colors: ['#ffffff', '#f5c518'], flex: [3, 1] },
  { id: 3,  label: '8th Kup',  colors: ['#f5c518'] },
  { id: 4,  label: '7th Kup',  colors: ['#f5c518', '#2e8b57'], flex: [3, 1] },
  { id: 5,  label: '6th Kup',  colors: ['#2e8b57'] },
  { id: 6,  label: '5th Kup',  colors: ['#2e8b57', '#3a5fc8'], flex: [3, 1] },
  { id: 7,  label: '4th Kup',  colors: ['#3a5fc8'] },
  { id: 8,  label: '3rd Kup',  colors: ['#3a5fc8', '#c0392b'], flex: [3, 1] },
  { id: 9,  label: '2nd Kup',  colors: ['#c0392b'] },
  { id: 10, label: '1st Kup',  colors: ['#c0392b', '#1a1a1a'], flex: [3, 1] },
  { id: 11, label: '1st Dan',  colors: ['#1a1a1a'], roman: 'I' },
  { id: 12, label: '2nd Dan',  colors: ['#1a1a1a'], roman: 'II' },
  { id: 13, label: '3rd Dan',  colors: ['#1a1a1a'], roman: 'III' },
  ,
];

const Swatch = ({ colors: cols, flex, roman }) => (
  <View style={styles.swatch}>
    <View style={styles.swatchInner}>
      {cols.map((col, i) => (
        <View key={i} style={[styles.swatchSegment, { backgroundColor: col, flex: flex ? flex[i] : 1 }]} />
      ))}
    </View>
    {roman ? (
      <View style={[StyleSheet.absoluteFill, styles.romanWrap]}>
        <Text style={styles.romanText}>{roman}</Text>
      </View>
    ) : null}
  </View>
);

const CrossDiagram = ({ horizontal, vertical }) => (
  <View style={styles.diagram}>
    <Text style={[styles.diagramLabel, { top: 2, alignSelf: 'center' }]}>D</Text>
    {vertical ? <View style={styles.diagramVertical} /> : null}
    {horizontal ? <View style={styles.diagramHorizontal} /> : null}
    <View style={styles.diagramCenter} />
    <Text style={[styles.diagramLabel, { top: '42%', left: 4 }]}>B</Text>
    <Text style={[styles.diagramLabel, { top: '42%', right: 4 }]}>A</Text>
    <Text style={[styles.diagramLabel, { bottom: 2 }]}>C</Text>
  </View>
);

const PatternDetail = ({ pattern, onBack }) => {
  const moves = PATTERN_MOVES[pattern.name] || [];
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pattern.name}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.fundamentalTitle}>Moves:</Text>
          {moves.length === 0 ? (
            <Text style={styles.bodyText}>Detailed moves coming soon.</Text>
          ) : (
            moves.map((move) => (
              <View key={move.num} style={styles.moveStepRow}>
                <Text style={styles.bodyText}>
                  <Text style={styles.bold}>{move.num}: </Text>
                  {move.parts.map((part, i) =>
                    part.highlight
                      ? <Text key={i} style={styles.highlightText}>{part.text}</Text>
                      : <Text key={i}>{part.text}</Text>
                  )}
                </Text>
              </View>
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const BeltDetail = ({ belt, onBack }) => {
  const data = BELT_DATA[belt.id];
  const [selectedPattern, setSelectedPattern] = useState(null);

  if (selectedPattern) {
    return <PatternDetail pattern={selectedPattern} onBack={() => setSelectedPattern(null)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{belt.label}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.bodyText}>
            <Text style={styles.bold}>Belt Colour: </Text>
            {data ? data.colourMeaning : 'Details coming soon.'}
          </Text>
        </View>
        {data && data.patterns.map((p) => (
          <View key={p.number} style={styles.section}>
            <Text style={styles.patternTitle}>
              <Text style={styles.bold}>Pattern {p.number}: </Text>
              {p.name}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>Meaning: </Text>
              {p.meaning}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>Movements: </Text>
              {p.movements}
            </Text>
            <View style={styles.patternMedia}>
              <View style={styles.patternLeft}>
                <TouchableOpacity
                  style={styles.youtubeBtn}
                  activeOpacity={0.8}
                  onPress={() => Linking.openURL(p.youtubeUrl)}
                >
                  <Icon name="play-arrow" size={36} color="#fff" type="MaterialIcons" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.8} onPress={() => setSelectedPattern(p)}>
                  <Text style={styles.readMoreText}>READ MORE</Text>
                </TouchableOpacity>
              </View>
              <CrossDiagram horizontal={p.horizontal} vertical={p.vertical} />
            </View>
            {p.technique && (
              <View style={styles.section}>
                <Text style={styles.bodyText}>
                  <Text style={styles.bold}>Technique</Text>
                </Text>
                {p.technique.split('\n').map((line, i) => {
                  const colonIndex = line.indexOf(':');
                  if (colonIndex > -1) {
                    const label = line.substring(0, colonIndex + 1);
                    const value = line.substring(colonIndex + 1);
                    return (
                      <Text key={i} style={styles.bodyText}>
                        <Text style={styles.bold}>{label}</Text>
                        {value}
                      </Text>
                    );
                  }
                  return <Text key={i} style={styles.bodyText}>{line}</Text>;
                })}
              </View>
            )}
          </View>
        ))}
        {data && data.sparring && (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>New Step Sparring: </Text>
              {data.sparring}
            </Text>
          </View>
        )}
        {data && data.technique && (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>Technique</Text>
            </Text>
            {data.technique.split('\n').map((line, i) => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > -1) {
                const label = line.substring(0, colonIndex + 1);
                const value = line.substring(colonIndex + 1);
                return (
                  <Text key={i} style={styles.bodyText}>
                    <Text style={styles.bold}>{label}</Text>
                    {value}
                  </Text>
                );
              }
              return <Text key={i} style={styles.bodyText}>{line}</Text>;
            })}
          </View>
        )}
        {data && (
          <View style={styles.section}>
            <Text style={styles.fundamentalTitle}>Fundamental Moves:</Text>
            {data.fundamentalMoves.map((move, i) => (
              <View key={i} style={styles.moveRow}>
                <Text style={styles.bodyText}>
                  {i + 1}){' '}
                  <Text style={styles.koreanName}>{move.korean}</Text>
                </Text>
                <Text style={styles.englishName}>{move.english}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const BeltsScreen = ({ onBack }) => {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <BeltDetail belt={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TKD STUDY</Text>
        <View style={styles.flagBox}>
          <Text style={styles.flagEmoji}>🇬🇧</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {BELTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => setSelected(item)}
          >
            <Swatch colors={item.colors} flex={item.flex} roman={item.roman} />
            <Text style={styles.rowLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SWATCH_SIZE = 64;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  flagBox: {
    width: 40, height: 28, borderRadius: 4,
    backgroundColor: '#222', justifyContent: 'center', alignItems: 'center',
  },
  flagEmoji: { fontSize: 22 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c8c8',
    backgroundColor: '#f0f0f0',
  },
  swatch: {
    width: SWATCH_SIZE, height: SWATCH_SIZE,
    borderRadius: 6, borderWidth: 2, borderColor: '#1a1a1a',
    overflow: 'hidden', marginRight: 20,
  },
  swatchInner: { flex: 1, flexDirection: 'row' },
  swatchSegment: { height: '100%' },
  romanWrap: { justifyContent: 'center', alignItems: 'center' },
  romanText: { color: '#f5c518', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  rowLabel: { fontSize: 18, fontWeight: '500', color: '#1a1a1a' },
  detailScroll: { flex: 1, backgroundColor: '#f5f5f5' },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  bold: { fontWeight: '700', color: '#1a1a1a' },
  bodyText: { fontSize: 15, color: '#1a1a1a', lineHeight: 22, marginBottom: 4 },
  patternTitle: { fontSize: 20, color: '#1a1a1a', marginBottom: 6 },
  patternMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 16,
  },
  patternLeft: {
    alignItems: 'flex-start',
    gap: 8,
  },
  youtubeBtn: {
    width: 64, height: 64,
    backgroundColor: '#e00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#2e8b57',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 0,
  },
  readMoreText: { color: '#2e8b57', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  fundamentalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  moveRow: { marginBottom: 10 },
  koreanName: { color: '#2e8b57', fontWeight: '700', fontSize: 15 },
  englishName: { fontSize: 14, color: '#444', marginLeft: 18 },
  moveStepRow: { marginBottom: 8 },
  highlightText: { color: '#1a3fc4', fontWeight: '700', fontSize: 15 },
  diagram: {
    width: 140, height: 140,
    borderWidth: 1, borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramVertical: {
    position: 'absolute',
    width: 3, height: '80%',
    backgroundColor: '#3a5fc8',
  },
  diagramHorizontal: {
    position: 'absolute',
    height: 3, width: '80%',
    backgroundColor: '#c0392b',
  },
  diagramCenter: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
    position: 'absolute',
  },
  diagramLabel: {
    position: 'absolute',
    fontSize: 11, fontWeight: '700', color: '#333',
  },
});

export default BeltsScreen;
