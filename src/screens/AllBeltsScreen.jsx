import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { spacing } from '../theme';
import Icon from '../components/common/Icon';
import BeltDetailScreen from './BeltDetailScreen';

// Belt swatch renderer — mirrors the TKD Study visual style
const BeltSwatch = ({ colors: swatchColors, stripes }) => (
  <View style={styles.swatch}>
    {swatchColors.map((col, i) => (
      <View key={i} style={[styles.swatchSegment, { backgroundColor: col, flex: stripes?.[i] ?? 1 }]} />
    ))}
  </View>
);

const BELTS = [
  // Kups (10 → 1)
  {
    id: 1, label: '10th Kup',
    swatch: { colors: ['#ffffff'], stripes: [1] },
    belt: 'White Belt', lessons: '30', duration: '20 min', progress: 0,
  },
  {
    id: 2, label: '9th Kup',
    swatch: { colors: ['#ffffff', '#f5c518'], stripes: [3, 1] },
    belt: 'White/Yellow Belt', lessons: '30', duration: '20 min', progress: 0,
  },
  {
    id: 3, label: '8th Kup',
    swatch: { colors: ['#f5c518'], stripes: [1] },
    belt: 'Yellow Belt', lessons: '30', duration: '20 min', progress: 0,
  },
  {
    id: 4, label: '7th Kup',
    swatch: { colors: ['#f5c518', '#2e8b57'], stripes: [3, 1] },
    belt: 'Yellow/Green Belt', lessons: '30', duration: '20 min', progress: 0,
  },
  {
    id: 5, label: '6th Kup',
    swatch: { colors: ['#2e8b57'], stripes: [1] },
    belt: 'Green Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  {
    id: 6, label: '5th Kup',
    swatch: { colors: ['#2e8b57', '#3a5fc8'], stripes: [3, 1] },
    belt: 'Green/Blue Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  {
    id: 7, label: '4th Kup',
    swatch: { colors: ['#3a5fc8'], stripes: [1] },
    belt: 'Blue Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  {
    id: 8, label: '3rd Kup',
    swatch: { colors: ['#3a5fc8', '#c0392b'], stripes: [3, 1] },
    belt: 'Blue/Red Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  {
    id: 9, label: '2nd Kup',
    swatch: { colors: ['#c0392b'], stripes: [1] },
    belt: 'Red Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  {
    id: 10, label: '1st Kup',
    swatch: { colors: ['#c0392b', '#1a1a1a'], stripes: [3, 1] },
    belt: 'Red/Black Belt', lessons: '30', duration: '25 min', progress: 0,
  },
  // Dans (1 → 6)
  {
    id: 11, label: '1st Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'I' },
    belt: '1st Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
  {
    id: 12, label: '2nd Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'II' },
    belt: '2nd Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
  {
    id: 13, label: '3rd Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'III' },
    belt: '3rd Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
  {
    id: 14, label: '4th Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'IV' },
    belt: '4th Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
  {
    id: 15, label: '5th Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'V' },
    belt: '5th Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
  {
    id: 16, label: '6th Dan',
    swatch: { colors: ['#1a1a1a'], stripes: [1], roman: 'VI' },
    belt: '6th Dan Black Belt', lessons: '30', duration: '30 min', progress: 0,
  },
];

const AllBeltsScreen = ({ onBack, onVideoWatch }) => {
  const [selectedBelt, setSelectedBelt] = React.useState(null);

  const handlePress = (item) => {
    if (onVideoWatch) {
      onVideoWatch({
        id: item.id,
        title: item.belt,
        duration: item.duration,
        lesson: `1/${item.lessons}`,
        progress: item.progress,
        bgColor: '#2d3748',
      });
    }
    setSelectedBelt(item);
  };

  if (selectedBelt) {
    return (
      <BeltDetailScreen
        belt={selectedBelt}
        onBack={() => setSelectedBelt(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TKD STUDY</Text>
        <View style={styles.flagBox}>
          <Text style={styles.flagEmoji}>🇬🇧</Text>
        </View>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {BELTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >
            {/* Belt swatch */}
            <View style={styles.swatchWrapper}>
              <BeltSwatch colors={item.swatch.colors} stripes={item.swatch.stripes} />
              {item.swatch.roman ? (
                <View style={styles.romanOverlay}>
                  <Text style={styles.romanText}>{item.swatch.roman}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.beltLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SWATCH_SIZE = 64;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  flagBox: {
    width: 40,
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  flagEmoji: {
    fontSize: 22,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c8c8',
    backgroundColor: '#f0f0f0',
  },
  swatchWrapper: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    marginRight: 20,
  },
  swatch: {
    flex: 1,
    flexDirection: 'row',
  },
  swatchSegment: {
    height: '100%',
  },
  romanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  romanText: {
    color: '#f5c518',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  beltLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
  },
});

export default AllBeltsScreen;
