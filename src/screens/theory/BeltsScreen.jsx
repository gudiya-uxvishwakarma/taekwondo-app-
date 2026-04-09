import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');

// ── Belt colour mapping ───────────────────────────────────────────────────────
// Returns { colors: [...], flex: [...], roman: '' } based on belt name keywords
const getBeltColors = (name = '') => {
  const n = name.toLowerCase();

  // Black belts with roman numerals (1st Dan - 9th Dan)
  if (n.includes('1st dan') || n.includes('1 dan'))  return { colors: ['#1a1a1a'], roman: 'I' };
  if (n.includes('2nd dan') || n.includes('2 dan'))  return { colors: ['#1a1a1a'], roman: 'II' };
  if (n.includes('3rd dan') || n.includes('3 dan'))  return { colors: ['#1a1a1a'], roman: 'III' };
  if (n.includes('4th dan') || n.includes('4 dan'))  return { colors: ['#1a1a1a'], roman: 'IV' };
  if (n.includes('5th dan') || n.includes('5 dan'))  return { colors: ['#1a1a1a'], roman: 'V' };
  if (n.includes('6th dan') || n.includes('6 dan'))  return { colors: ['#1a1a1a'], roman: 'VI' };
  if (n.includes('7th dan') || n.includes('7 dan'))  return { colors: ['#1a1a1a'], roman: 'VII' };
  if (n.includes('8th dan') || n.includes('8 dan'))  return { colors: ['#1a1a1a'], roman: 'VIII' };
  if (n.includes('9th dan') || n.includes('9 dan'))  return { colors: ['#1a1a1a'], roman: 'IX' };
  if (n.includes('dan') || n.includes('black'))       return { colors: ['#1a1a1a'] };

  // Red/black stripe — 1st Kup
  if (n.includes('1st kup') || n.includes('1 kup'))
    return { colors: ['#c0392b', '#1a1a1a'], flex: [3, 1] };

  // Red — 2nd Kup
  if (n.includes('2nd kup') || n.includes('2 kup'))
    return { colors: ['#c0392b'] };

  // Blue/red stripe — 3rd Kup
  if (n.includes('3rd kup') || n.includes('3 kup'))
    return { colors: ['#3a5fc8', '#c0392b'], flex: [3, 1] };

  // Blue — 4th Kup
  if (n.includes('4th kup') || n.includes('4 kup'))
    return { colors: ['#3a5fc8'] };

  // Green/blue stripe — 5th Kup
  if (n.includes('5th kup') || n.includes('5 kup'))
    return { colors: ['#2e8b57', '#3a5fc8'], flex: [3, 1] };

  // Green — 6th Kup
  if (n.includes('6th kup') || n.includes('6 kup'))
    return { colors: ['#2e8b57'] };

  // Yellow/green stripe — 7th Kup
  if (n.includes('7th kup') || n.includes('7 kup'))
    return { colors: ['#f5c518', '#2e8b57'], flex: [3, 1] };

  // Yellow — 8th Kup
  if (n.includes('8th kup') || n.includes('8 kup'))
    return { colors: ['#f5c518'] };

  // White/yellow stripe — 9th Kup
  if (n.includes('9th kup') || n.includes('9 kup'))
    return { colors: ['#ffffff', '#f5c518'], flex: [3, 1] };

  // White — 10th Kup (default)
  if (n.includes('10th kup') || n.includes('10 kup'))
    return { colors: ['#ffffff'] };

  // Keyword fallbacks
  if (n.includes('red') && (n.includes('black') || n.includes('stripe')))
    return { colors: ['#c0392b', '#1a1a1a'], flex: [3, 1] };
  if (n.includes('blue') && (n.includes('red') || n.includes('stripe')))
    return { colors: ['#3a5fc8', '#c0392b'], flex: [3, 1] };
  if (n.includes('green') && (n.includes('blue') || n.includes('stripe')))
    return { colors: ['#2e8b57', '#3a5fc8'], flex: [3, 1] };
  if (n.includes('yellow') && (n.includes('green') || n.includes('stripe')))
    return { colors: ['#f5c518', '#2e8b57'], flex: [3, 1] };
  if (n.includes('white') && (n.includes('yellow') || n.includes('stripe')))
    return { colors: ['#ffffff', '#f5c518'], flex: [3, 1] };
  if (n.includes('white') && (n.includes('green') || n.includes('stripe')))
    return { colors: ['#ffffff', '#2e8b57'], flex: [3, 1] };
  if (n.includes('black')) return { colors: ['#1a1a1a'] };
  if (n.includes('red'))   return { colors: ['#c0392b'] };
  if (n.includes('blue'))  return { colors: ['#3a5fc8'] };
  if (n.includes('green')) return { colors: ['#2e8b57'] };
  if (n.includes('yellow'))return { colors: ['#f5c518'] };
  if (n.includes('white')) return { colors: ['#ffffff'] };

  return { colors: ['#cccccc'] }; // unknown
};

// ── Belt Swatch component ─────────────────────────────────────────────────────
const BeltSwatch = ({ beltName, size = 64 }) => {
  const { colors, flex, roman } = getBeltColors(beltName);
  return (
    <View style={{
      width: size, height: size,
      borderRadius: 6, borderWidth: 2, borderColor: '#1a1a1a',
      overflow: 'hidden', marginRight: 16, flexShrink: 0,
    }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {colors.map((c, i) => (
          <View key={i} style={{ backgroundColor: c, flex: flex ? flex[i] : 1, height: '100%' }} />
        ))}
      </View>
      {roman ? (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              color: '#f5c518', fontWeight: '900',
              fontSize: roman.length > 3 ? size * 0.2 : size * 0.28,
              letterSpacing: 1,
            }}>{roman}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const PatternDetail = ({ pattern, onBack }) => {
  const moveLines = pattern.moves
    ? pattern.moves.split('\n').filter(l => l.trim())
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pattern.name}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.fundamentalTitle}>Moves</Text>
          {moveLines.length === 0 ? (
            <Text style={styles.bodyText}>No moves added yet.</Text>
          ) : (
            moveLines.map((line, i) => (
              <View key={i} style={styles.moveStepRow}>
                <Text style={styles.bodyText}>{line}</Text>
              </View>
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const renderTechniqueLines = (technique) =>
  technique.split('\n').map((line, i) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      return (
        <Text key={i} style={styles.bodyText}>
          <Text style={styles.bold}>{line.substring(0, colonIndex + 1)}</Text>
          {line.substring(colonIndex + 1)}
        </Text>
      );
    }
    return <Text key={i} style={styles.bodyText}>{line}</Text>;
  });

const BeltDetail = ({ belt, onBack }) => {
  const [selectedPattern, setSelectedPattern] = useState(null);

  if (selectedPattern) {
    return <PatternDetail pattern={selectedPattern} onBack={() => setSelectedPattern(null)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{belt.beltName}</Text>
        <BeltSwatch beltName={belt.beltName} size={36} />
      </View>
      <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
        {belt.recommendedDuration ? (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>Recommended Duration: </Text>
              {belt.recommendedDuration}
            </Text>
          </View>
        ) : null}

        {belt.colourMeaning ? (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>Belt Colour: </Text>
              {belt.colourMeaning}
            </Text>
          </View>
        ) : null}

        {(belt.patterns || []).map((p) => (
          <View key={p.number} style={styles.section}>
            <Text style={styles.patternTitle}>
              <Text style={styles.bold}>Pattern {p.number}: </Text>
              {p.name}
            </Text>
            {p.meaning ? (
              <Text style={styles.bodyText}>
                <Text style={styles.bold}>Meaning: </Text>{p.meaning}
              </Text>
            ) : null}
            {p.movements ? (
              <Text style={styles.bodyText}>
                <Text style={styles.bold}>Movements: </Text>{p.movements}
              </Text>
            ) : null}
            <View style={styles.patternMedia}>
              <View style={styles.patternLeft}>
                {p.youtubeUrl ? (
                  <TouchableOpacity
                    style={styles.youtubeBtn}
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL(p.youtubeUrl)}
                  >
                    <Icon name="play-arrow" size={36} color="#fff" type="MaterialIcons" />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.8} onPress={() => setSelectedPattern(p)}>
                  <Text style={styles.readMoreText}>READ MORE</Text>
                </TouchableOpacity>
              </View>
              {p.diagramImage ? (
                <Image
                  source={{ uri: `${BASE_URL}${p.diagramImage}` }}
                  style={styles.diagramImage}
                  resizeMode="contain"
                />
              ) : null}
            </View>
            {p.technique ? (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.bodyText, { marginBottom: 4 }]}>
                  <Text style={styles.bold}>Technique</Text>
                </Text>
                {renderTechniqueLines(p.technique)}
              </View>
            ) : null}
          </View>
        ))}

        {belt.sparring ? (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              <Text style={styles.bold}>New Step Sparring: </Text>
              {belt.sparring}
            </Text>
          </View>
        ) : null}

        {(belt.fundamentalMoves || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.fundamentalTitle}>Fundamental Moves:</Text>
            {belt.fundamentalMoves.map((move, i) => (
              <View key={i} style={styles.moveRow}>
                <Text style={styles.bodyText}>
                  {i + 1}){' '}
                  <Text style={styles.koreanName}>{move.korean}</Text>
                </Text>
                <Text style={styles.englishName}>{move.english}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {(belt.extraSections || []).map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.fundamentalTitle}>{sec.heading}</Text>
            {(sec.points || []).map((pt, j) => (
              <View key={j} style={styles.moveRow}>
                <Text style={styles.bodyText}>
                  <Text style={styles.bold}>{j + 1}{')'} </Text>{pt}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────

const BeltsScreen = ({ onBack }) => {
  const [belts, setBelts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/belt-syllabus`)
      .then(r => r.json())
      .then(data => setBelts(data.data || []))
      .catch(() => setBelts([]))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return <BeltDetail belt={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Belts</Text>
        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006CB5" />
        </View>
      ) : belts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No belt levels added yet.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {belts.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => setSelected(item)}
            >
              <BeltSwatch beltName={item.beltName} size={SWATCH_SIZE} />
              <Text style={[styles.rowLabel, { flex: 1 }]}>{item.beltName}</Text>
              <Icon name="chevron-right" size={22} color="#ccc" type="MaterialIcons" />
            </TouchableOpacity>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const SWATCH_SIZE = 64;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006CB5',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  flagBox: {
    width: 40, height: 28, borderRadius: 4,
    backgroundColor: '#0058a0', justifyContent: 'center', alignItems: 'center',
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
  beltIconBox: {
    width: SWATCH_SIZE, height: SWATCH_SIZE,
    borderRadius: 6,
    backgroundColor: '#006CB5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  beltIconSmall: {
    width: 36, height: 36,
    borderRadius: 6,
    backgroundColor: '#006CB5',
    justifyContent: 'center', alignItems: 'center',
  },
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
  patternLeft: { alignItems: 'flex-start', gap: 8 },
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
    borderColor: '#006CB5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  readMoreText: { color: '#006CB5', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  fundamentalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  moveRow: { marginBottom: 10 },
  koreanName: { color: '#006CB5', fontWeight: '700', fontSize: 15 },
  englishName: { fontSize: 14, color: '#444', marginLeft: 18 },
  moveStepRow: { marginBottom: 8 },
  highlightText: { color: '#1a3fc4', fontWeight: '700', fontSize: 15 },
  techniqueRow: { marginBottom: 10 },
  techniqueLabel: { fontWeight: '700', color: '#1a1a1a', fontSize: 15, marginBottom: 2 },
  techniqueValue: { fontSize: 14, color: '#444', lineHeight: 20, marginLeft: 8 },
  diagramImage: {
    width: 140, height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default BeltsScreen;
