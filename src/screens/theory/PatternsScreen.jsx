import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, Image, ActivityIndicator, Dimensions, FlatList,
} from 'react-native';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const BLUE = '#006CB5';
const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
const { width: W } = Dimensions.get('window');

const SLIDES = [
  { key: 'patterns',            label: 'Patterns' },
  { key: 'non-standard-desc',   label: 'Non-Standard Speeds-Description' },
  { key: 'non-standard-list',   label: 'Non-Standard Speeds-List' },
  { key: 'kicks-in-patterns',   label: 'Kicks in Patterns' },
  { key: 'number-of-movements', label: 'Number of Movements' },
];

// ── Tab item constants (for pattern detail) ───────────────────────────────────
const TABS = ['list-of-techniques', 'information', 'new-techniques', 'description', 'modified-techniques'];
const TAB_LABELS = {
  'list-of-techniques': 'List of Techniques',
  'information': 'Information',
  'new-techniques': 'New Techniques',
  'description': 'Description',
  'modified-techniques': 'Modified Techniques',
};

// ── Main screen ───────────────────────────────────────────────────────────────
const PatternsScreen = ({ onBack }) => {
  const [patterns, setPatterns] = useState([]);
  const [slideData, setSlideData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const pagerRef = useRef(null);
  const tabBarRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [pRes, nsDescRes, nsListRes, kicksRes, numRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/patterns`),
        fetch(`${API_CONFIG.BASE_URL}/pattern-slides?slide=non-standard-desc`),
        fetch(`${API_CONFIG.BASE_URL}/pattern-slides?slide=non-standard-list`),
        fetch(`${API_CONFIG.BASE_URL}/pattern-slides?slide=kicks-in-patterns`),
        fetch(`${API_CONFIG.BASE_URL}/pattern-slides?slide=number-of-movements`),
      ]);
      const [pd, nsd, nsl, kd, nd] = await Promise.all([
        pRes.json(), nsDescRes.json(), nsListRes.json(), kicksRes.json(), numRes.json(),
      ]);
      setPatterns((pd.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setSlideData({
        'non-standard-desc':   (nsd.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        'non-standard-list':   (nsl.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        'kicks-in-patterns':   (kd.data  || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        'number-of-movements': (nd.data  || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      });
    } catch (e) { console.log('PatternsScreen error:', e); }
    finally { setLoading(false); }
  };

  const [selectedDetail, setSelectedDetail] = useState(null); // for non-standard-list point detail

  // Navigate to technique detail
  if (selectedTechnique) {
    return <TechniqueDetailPage technique={selectedTechnique} onBack={() => setSelectedTechnique(null)} />;
  }
  if (selectedDetail) {
    return <SlidePointDetailPage detail={selectedDetail} onBack={() => setSelectedDetail(null)} />;
  }
  if (selectedPattern) {
    return <PatternDetailScreen pattern={selectedPattern} onBack={() => setSelectedPattern(null)} onSelectTechnique={setSelectedTechnique} />;
  }

  const goToTab = (index) => {
    setActiveIndex(index);
    pagerRef.current?.scrollTo({ x: index * W, animated: true });
    tabBarRef.current?.scrollTo({ x: index * 120, animated: true });
  };

  const onPageScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
      tabBarRef.current?.scrollTo({ x: index * 120, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patterns</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Tab bar */}
          <View style={styles.tabBarWrap}>
            <ScrollView ref={tabBarRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
              {SLIDES.map((s, i) => (
                <TouchableOpacity key={s.key} style={[styles.tab, activeIndex === i && styles.tabActive]} onPress={() => goToTab(i)} activeOpacity={0.7}>
                  <Text style={[styles.tabText, activeIndex === i && styles.tabTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Swipeable pages */}
          <ScrollView ref={pagerRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onPageScroll} scrollEventThrottle={16} style={{ flex: 1 }}>

            {/* Slide 0: Patterns list */}
            <ScrollView style={{ width: W }} showsVerticalScrollIndicator={false}>
             
              {patterns.map((item, i) => (
                <TouchableOpacity key={item._id} style={styles.row} onPress={() => setSelectedPattern(item)} activeOpacity={0.7}>
                  <View style={styles.rowLeft}>
                    {!!item.image && <Image 
                      source={{ uri: `${BASE_URL}${item.image}` }} 
                      style={styles.thumb} 
                      resizeMode="cover"
                      onError={(e) => console.log('Pattern image error:', `${BASE_URL}${item.image}`, e.nativeEvent.error)}
                    />}
                    <Text style={styles.patternName}>{item.name}</Text>
                  </View>
                  <Text style={styles.moves}>{item.moves} mov.</Text>
                </TouchableOpacity>
              ))}
              {patterns.length === 0 && <Text style={styles.emptyText}>No patterns yet.</Text>}
              <View style={{ height: 40 }} />
            </ScrollView>

            {/* Slide 1: Non-standard speeds - Description */}
            <RichSlide key="nsd" data={slideData['non-standard-desc'] || []} />

            {/* Slide 2: Non-standard speeds - List */}
            <NsListSlide key="nsl" data={slideData['non-standard-list'] || []} onSelectDetail={setSelectedDetail} />

            {/* Slide 3: Kicks in Patterns */}
            <KicksSlide key="kicks" data={slideData['kicks-in-patterns'] || []} onSelectKick={setSelectedDetail} />

            {/* Slide 4: Number of Movements */}
            <ListSlide key="num" data={slideData['number-of-movements'] || []} />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

// ── Rich content slide (title, subtitle, description, headings, points, images) ─
const RichSlide = ({ data }) => (
  <ScrollView style={{ width: W }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
    {data.map((item, i) => (
      <View key={i} style={styles.section}>
        {!!item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
        {!!item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        {!!item.description && <Text style={styles.description}>{item.description}</Text>}
        {(item.headings || []).map((h, hi) => <Text key={hi} style={styles.heading}>{h}</Text>)}
        {(item.points || []).map((pt, pi) => (
          <View key={pi}>
            <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{pt.text}</Text></View>
            {(pt.subPoints || []).map((sp, si) => (
              <View key={si} style={styles.subBulletRow}><Text style={styles.subBullet}>◦</Text><Text style={styles.subBulletText}>{sp.text}</Text></View>
            ))}
          </View>
        ))}
        {(item.images || []).map((img, ii) => (
          <Image key={ii} source={{ uri: `${BASE_URL}${img}` }} style={styles.slideImage} resizeMode="cover" />
        ))}
      </View>
    ))}
    {data.length === 0 && <Text style={styles.emptyText}>No content yet.</Text>}
    <View style={{ height: 40 }} />
  </ScrollView>
);

// ── Non-standard speeds list slide ───────────────────────────────────────────
const NsListSlide = ({ data, onSelectDetail }) => (
  <ScrollView style={{ width: W }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
    {data.map((item, i) => (
      <View key={i} style={styles.section}>
        {!!item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
        {(item.points || []).map((pt, pi) => {
          const hasEntries = (pt.kickEntries || []).length > 0;
          return hasEntries ? (
            <TouchableOpacity key={pi} style={styles.techRow} onPress={() => onSelectDetail({ ...pt, isKick: true })} activeOpacity={0.7}>
              <Text style={styles.techName}>{pt.text}</Text>
              <Icon name="chevron-right" size={18} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View key={pi} style={styles.techRowPlain}>
              <Text style={styles.techName}>{pt.text}</Text>
            </View>
          );
        })}
      </View>
    ))}
    {data.length === 0 && <Text style={styles.emptyText}>No content yet.</Text>}
    <View style={{ height: 40 }} />
  </ScrollView>
);

// ── Kicks in Patterns slide ───────────────────────────────────────────────────
const KicksSlide = ({ data, onSelectKick }) => (
  <ScrollView style={{ width: W }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
    {data.map((item, i) => (
      <View key={i} style={styles.section}>
        {!!item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
        {(item.points || []).map((pt, pi) => {
          const hasEntries = (pt.kickEntries || []).length > 0;
          return hasEntries ? (
            <TouchableOpacity key={pi} style={styles.techRow} onPress={() => onSelectKick({ ...pt, isKick: true })} activeOpacity={0.7}>
              <Text style={styles.techName}>{pt.text}</Text>
              <Icon name="chevron-right" size={18} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View key={pi} style={styles.techRowPlain}>
              <Text style={styles.techName}>{pt.text}</Text>
            </View>
          );
        })}
      </View>
    ))}
    {data.length === 0 && <Text style={styles.emptyText}>No content yet.</Text>}
    <View style={{ height: 40 }} />
  </ScrollView>
);

// ── Slide point detail page (handles both ns-list details and kick entries) ───
const SlidePointDetailPage = ({ detail, onBack }) => {
  const isKick = detail.isKick;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{detail.text}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        {isKick ? (
          /* Kick entries: grouped by patternName */
          (() => {
            const entries = detail.kickEntries || [];
            // Group by patternName
            const groups = [];
            entries.forEach(e => {
              const last = groups[groups.length - 1];
              if (last && last.patternName === e.patternName) {
                last.entries.push(e);
              } else {
                groups.push({ patternName: e.patternName, entries: [e] });
              }
            });
            return groups.map((g, gi) => (
              <View key={gi} style={gi > 0 ? styles.kickGroup : undefined}>
                {!!g.patternName && <Text style={styles.kickPatternName}>{g.patternName}</Text>}
                {g.entries.map((e, ei) => (
                  <View key={ei} style={styles.kickEntry}>
                    <View style={styles.kickLeft}>
                      {!!e.number && <Text style={styles.kickNumber}>{e.number}</Text>}
                    </View>
                    <View style={styles.kickRight}>
                      {(e.rows || []).map((row, ri) => (
                        <View key={ri} style={ri > 0 ? { marginTop: 8 } : undefined}>
                          {!!row.koreanTerm && <Text style={styles.kickKorean}>{row.koreanTerm}</Text>}
                          {!!row.description && <Text style={styles.kickDesc}>{row.description}</Text>}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ));
          })()
        ) : (
          /* Non-standard list details */
          (detail.details || []).map((det, i) => (
            <View key={i} style={i > 0 ? styles.detailSection : undefined}>
              {!!det.title && <Text style={styles.detailTitle}>{det.title}</Text>}
              {(det.points || []).map((pt, pi) => (
                <View key={pi} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{pt.text}</Text>
                </View>
              ))}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── List slide (number-of-movements: title, number, description) ─────────────
const ListSlide = ({ data }) => (
  <ScrollView style={{ width: W }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
    {data.map((item, i) => (
      <View key={i} style={[styles.section, { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          {!!item.number && (
            <View style={{ backgroundColor: BLUE, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{item.number}</Text>
            </View>
          )}
          {!!item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
        </View>
        {!!item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    ))}
    {data.length === 0 && <Text style={styles.emptyText}>No content yet.</Text>}
    <View style={{ height: 40 }} />
  </ScrollView>
);
const PatternDetailScreen = ({ pattern, onBack, onSelectTechnique }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef(null);
  const tabBarRef = useRef(null);
  const availableTabs = TABS.filter(t => (pattern.items || []).some(i => i.tab === t));

  const goToTab = (index) => {
    setActiveIndex(index);
    pagerRef.current?.scrollTo({ x: index * W, animated: true });
    tabBarRef.current?.scrollTo({ x: index * 120, animated: true });
  };

  const onPageScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    if (index !== activeIndex && index >= 0 && index < availableTabs.length) {
      setActiveIndex(index);
      tabBarRef.current?.scrollTo({ x: index * 120, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pattern.name}</Text>
        <View style={{ width: 40 }} />
      </View>
      {availableTabs.length === 0 ? (
        <View style={styles.emptyWrap}><Text style={styles.emptyText}>No content added yet.</Text></View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.tabBarWrap}>
            <ScrollView ref={tabBarRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
              {availableTabs.map((tab, i) => (
                <TouchableOpacity key={tab} style={[styles.tab, activeIndex === i && styles.tabActive]} onPress={() => goToTab(i)} activeOpacity={0.7}>
                  <Text style={[styles.tabText, activeIndex === i && styles.tabTextActive]}>{TAB_LABELS[tab]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <ScrollView ref={pagerRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onPageScroll} scrollEventThrottle={16} style={{ flex: 1 }}>
            {availableTabs.map(tab => {
              const tabItems = (pattern.items || []).filter(i => i.tab === tab);
              return (
                <ScrollView key={tab} style={{ width: W }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
                  {tabItems.map((item, idx) => <TabItem key={idx} item={item} tab={tab} onSelectTechnique={onSelectTechnique} />)}
                  {tabItems.length === 0 && <Text style={styles.emptyText}>No content yet.</Text>}
                  <View style={{ height: 40 }} />
                </ScrollView>
              );
            })}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

// ── Tab item renderer ─────────────────────────────────────────────────────────
const TabItem = ({ item, tab, onSelectTechnique }) => (
  <View style={styles.section}>
    {tab === 'list-of-techniques' && (
      <>
        {!!item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
        {(!!item.name || !!item.koreanName) && (
          <View style={styles.nameRow}>
            {!!item.name && <Text style={styles.itemName}>{item.name}</Text>}
            {!!item.koreanName && <Text style={styles.itemKorean}> ({item.koreanName})</Text>}
          </View>
        )}
        {(item.techPoints || []).map((tp, i) => {
          const hasDetails = (tp.details || []).length > 0;
          return hasDetails ? (
            <TouchableOpacity key={i} style={styles.techRow} onPress={() => onSelectTechnique(tp)} activeOpacity={0.7}>
              <Text style={styles.techName}>{tp.text}</Text>
              <Icon name="chevron-right" size={18} color="#9ca3af" type="MaterialIcons" />
            </TouchableOpacity>
          ) : (
            <View key={i} style={styles.techRowPlain}>
              <Text style={styles.techName}>{tp.text}</Text>
            </View>
          );
        })}
      </>
    )}
    {tab === 'information' && (
      <>
        {!!item.infoTitle && <Text style={styles.sectionTitle}>{item.infoTitle}</Text>}
        {!!item.diagram && <Image source={{ uri: `${BASE_URL}${item.diagram}` }} style={styles.diagram} resizeMode="cover" />}
        {(item.points || []).map((pt, i) => (
          <View key={i} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{pt.text}</Text></View>
        ))}
      </>
    )}
    {tab === 'description' && (
      <>
        {!!item.descHeading && <Text style={styles.descHeading}>{item.descHeading}</Text>}
        {!!item.descSubHeading && <Text style={styles.descSubHeading}>{item.descSubHeading}</Text>}
        {!!item.descDiagram && <Image source={{ uri: `${BASE_URL}${item.descDiagram}` }} style={styles.diagram} resizeMode="cover" />}
        {!!item.description && <Text style={styles.description}>{item.description}</Text>}
      </>
    )}
    {['new-techniques', 'modified-techniques'].includes(tab) && (
      <>
        {!!item.ntTitle && <Text style={styles.sectionTitle}>{item.ntTitle}</Text>}
        {(item.ntPoints || []).map((pt, i) => (
          <View key={i} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{pt.text}</Text></View>
        ))}
      </>
    )}
  </View>
);

// ── Technique detail page ─────────────────────────────────────────────────────
const TechniqueDetailPage = ({ technique, onBack }) => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor={BLUE} />
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{technique.text || technique.name}</Text>
      <View style={{ width: 40 }} />
    </View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
      {(technique.details || []).map((det, i) => (
        <View key={i} style={i > 0 ? styles.detailSection : undefined}>
          {!!det.title && <Text style={styles.detailTitle}>{det.title}</Text>}
          {!!det.subtitle && <Text style={styles.detailSubtitle}>{det.subtitle}</Text>}
          {!!det.description && <Text style={styles.description}>{det.description}</Text>}
          {!!det.heading && <Text style={styles.detailHeading}>{det.heading}</Text>}
          {(det.points || []).map((pt, pi) => (
            <View key={pi} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{pt.text}</Text></View>
          ))}
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  colHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  colText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 40, height: 40, borderRadius: 6, backgroundColor: '#f1f5f9' },
  patternName: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  moves: { fontSize: 13, color: '#6b7280', width: 80, textAlign: 'right' },
  tabBarWrap: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tabBarContent: { paddingHorizontal: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: BLUE },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: BLUE },
  pageContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 4 },
  description: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 8 },
  heading: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginTop: 8, marginBottom: 4 },
  descHeading: { fontSize: 18, fontWeight: '900', color: '#1f2937', marginBottom: 6 },
  descSubHeading: { fontSize: 15, fontWeight: '400', color: '#374151', marginBottom: 10 },
  techRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  techRowPlain: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  techName: { fontSize: 15, fontWeight: '600', color: '#1f2937', flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  itemKorean: { fontSize: 13, color: '#6b7280', fontStyle: 'italic' },
  bulletRow: { flexDirection: 'row', marginBottom: 5, paddingRight: 8 },
  bullet: { color: '#374151', fontSize: 14, marginRight: 8, marginTop: 2 },
  bulletText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 22 },
  subBulletRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 18, paddingRight: 8 },
  subBullet: { color: '#6b7280', fontSize: 12, marginRight: 8, marginTop: 2 },
  subBulletText: { flex: 1, fontSize: 12, color: '#6b7280', lineHeight: 20 },
  diagram: { width: W - 32, aspectRatio: 4/3, borderRadius: 8, marginVertical: 10 },
  slideImage: { width: W - 32, aspectRatio: 4/3, borderRadius: 8, marginVertical: 10 },
  detailTitle: { fontSize: 22, fontWeight: '900', color: '#1f2937', marginBottom: 6 },
  detailSubtitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  detailHeading: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginTop: 12, marginBottom: 6 },
  detailSection: { marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  kickGroup: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  kickPatternName: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 10 },
  kickEntry: { flexDirection: 'row', marginBottom: 12, gap: 12 },
  kickLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, width: 110 },
  kickNumber: { fontSize: 13, fontWeight: '700', color: '#1f2937', minWidth: 28 },
  kickKorean: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  kickLevel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  kickRight: { flex: 1 },
  kickDesc: { fontSize: 13, color: '#374151', lineHeight: 20 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 40, paddingHorizontal: 16 },
});

export default PatternsScreen;
