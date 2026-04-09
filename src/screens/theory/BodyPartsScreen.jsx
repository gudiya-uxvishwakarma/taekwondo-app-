import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity, Modal, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const BLUE = '#006CB5';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');

const CATEGORIES = [
  { key: 'attacking', label: 'Attacking Tools' },
  { key: 'blocking',  label: 'Blocking Tools' },
  { key: 'vital',     label: 'Vital Points' },
  { key: 'levels',    label: 'Levels and Lines' },
];

const EmptyState = ({ message = 'No data added yet.' }) => (
  <View style={s.emptyWrap}>
    <Icon name="inbox" size={48} color="#d1d5db" type="MaterialIcons" />
    <Text style={s.emptyText}>{message}</Text>
  </View>
);

// ─── ATTACKING TOOLS ─────────────────────────────────────────────────────────
const AttackingToolsScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/body-parts?category=attacking`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Attacking Tools</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {loading ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} /> :
          items.length === 0 ? <EmptyState /> : (
            <View style={s.grid}>
              {items.map((item) => (
                <TouchableOpacity key={item._id} style={s.card} onPress={() => setSelected(item)} activeOpacity={0.7}>
                  <View style={s.cardBox}>
                    {item.image
                      ? <Image source={{ uri: `${BASE_URL}${item.image}` }} style={s.cardImage} resizeMode="cover" />
                      : <Icon name="sports-martial-arts" size={48} color="#d1d5db" type="MaterialIcons" />}
                  </View>
                  <Text style={s.cardName}>{item.name}</Text>
                  {item.korean ? <Text style={s.cardKorean}>{item.korean}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          )
        }
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={s.safe}>
          <StatusBar barStyle="light-content" backgroundColor={BLUE} />
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => setSelected(null)} activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{selected?.name}</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
            <Text style={s.tabPageTitle}>{selected?.name}</Text>
            {selected?.korean ? <Text style={s.cardKorean}>{selected.korean}</Text> : null}
            {selected?.image
              ? <Image source={{ uri: `${BASE_URL}${selected.image}` }} style={s.attackImage} resizeMode="contain" />
              : null}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// ─── BLOCKING TOOLS ──────────────────────────────────────────────────────────
const BlockingToolsScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [selectedDirIndex, setSelectedDirIndex] = useState(0);
  const [selectedAttackToolIndex, setSelectedAttackToolIndex] = useState(0);
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false);
  const [partDropdownOpen, setPartDropdownOpen] = useState(false);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [dirDropdownOpen, setDirDropdownOpen] = useState(false);
  const [attackToolDropdownOpen, setAttackToolDropdownOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/body-parts?category=blocking`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selected = items[selectedToolIndex];
  const parts = selected?.parts || [];
  const currentPart = parts[selectedPartIndex] || { part: '', methods: [] };
  const methods = currentPart.methods || [];
  const currentMethod = methods[selectedMethodIndex] || { method: '', tools: [] };
  const directions = selected?.directions || [];
  const attackTools = currentMethod.tools || [];

  const handleToolSelect = (i) => { setSelectedToolIndex(i); setSelectedPartIndex(0); setSelectedMethodIndex(0); setSelectedDirIndex(0); setSelectedAttackToolIndex(0); setToolDropdownOpen(false); };
  const handlePartSelect = (i) => { setSelectedPartIndex(i); setSelectedMethodIndex(0); setSelectedAttackToolIndex(0); setPartDropdownOpen(false); };
  const handleMethodSelect = (i) => { setSelectedMethodIndex(i); setSelectedAttackToolIndex(0); setMethodDropdownOpen(false); };

  const rows = selected ? [
    { label: 'Blocking Tool',    value: selected.name,                       tappable: items.length > 1,      onPress: () => setToolDropdownOpen(true) },
    { label: 'Direction',        value: directions[selectedDirIndex] || '—', tappable: directions.length > 1, onPress: () => setDirDropdownOpen(true) },
    { label: 'Part Blocked',     value: currentPart.part || '—',             tappable: parts.length > 1,      onPress: () => setPartDropdownOpen(true) },
    { label: 'Attacking Method', value: currentMethod.method || '—',         tappable: methods.length > 1,    onPress: () => setMethodDropdownOpen(true) },
    { label: 'Attacking Tool',   value: attackTools[selectedAttackToolIndex] || '—', tappable: attackTools.length > 1, onPress: () => setAttackToolDropdownOpen(true) },
  ] : [];

  const dropdowns = [
    { open: toolDropdownOpen,       items: items.map(t => t.name),  selected: selectedToolIndex,       onSelect: handleToolSelect,   onClose: () => setToolDropdownOpen(false) },
    { open: dirDropdownOpen,        items: directions,               selected: selectedDirIndex,        onSelect: (i) => { setSelectedDirIndex(i); setDirDropdownOpen(false); }, onClose: () => setDirDropdownOpen(false) },
    { open: partDropdownOpen,       items: parts.map(p => p.part),  selected: selectedPartIndex,       onSelect: handlePartSelect,   onClose: () => setPartDropdownOpen(false) },
    { open: methodDropdownOpen,     items: methods.map(m => m.method), selected: selectedMethodIndex,  onSelect: handleMethodSelect, onClose: () => setMethodDropdownOpen(false) },
    { open: attackToolDropdownOpen, items: attackTools,              selected: selectedAttackToolIndex, onSelect: (i) => { setSelectedAttackToolIndex(i); setAttackToolDropdownOpen(false); }, onClose: () => setAttackToolDropdownOpen(false) },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Blocking Tools</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {loading ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} /> :
          items.length === 0 ? <EmptyState /> : (
            <>
              {rows.map((row) => (
                <View key={row.label} style={s.blockRow}>
                  <Text style={s.blockLabel}>{row.label}</Text>
                  <TouchableOpacity
                    style={[s.blockValueBtn, !row.tappable && { backgroundColor: '#e5e7eb' }]}
                    onPress={row.tappable ? row.onPress : undefined}
                    activeOpacity={row.tappable ? 0.8 : 1}
                  >
                    <Text style={[s.blockValueText, !row.tappable && { color: '#374151' }]}>{row.value}</Text>
                    {row.tappable && <Icon name="arrow-drop-down" size={20} color="#fff" type="MaterialIcons" />}
                  </TouchableOpacity>
                </View>
              ))}
              {dropdowns.map((dd, di) => (
                <Modal key={di} visible={dd.open} transparent animationType="fade" onRequestClose={dd.onClose}>
                  <TouchableOpacity style={s.dropdownOverlay} activeOpacity={1} onPress={dd.onClose}>
                    <View style={s.dropdownList}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {dd.items.map((item, index) => (
                          <TouchableOpacity key={`${item}-${index}`} style={[s.dropdownItem, index === dd.selected && s.dropdownItemActive]} onPress={() => dd.onSelect(index)} activeOpacity={0.7}>
                            <Text style={[s.dropdownItemText, index === dd.selected && s.dropdownItemTextActive]}>{item}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </Modal>
              ))}
            </>
          )
        }
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── VITAL POINTS ────────────────────────────────────────────────────────────
const VitalPointsScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/body-parts?category=vital`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selected = items[selectedIndex];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Vital Points</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {loading ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} /> :
          items.length === 0 ? <EmptyState /> : (
            <>
              <TouchableOpacity style={s.dropdownBtn} onPress={() => setDropdownOpen(true)} activeOpacity={0.8}>
                <Text style={s.dropdownBtnText}>{selected?.name}</Text>
                <Icon name="arrow-drop-down" size={24} color="#fff" type="MaterialIcons" />
              </TouchableOpacity>
              {selected?.image
                ? <Image source={{ uri: `${BASE_URL}${selected.image}` }} style={s.vitalImage} resizeMode="contain" />
                : null}
              <View style={s.pointsLegend}>
                {(selected?.points || []).map((p, i) => (
                  <Text key={i} style={s.pointLegendText}>
                    <Text style={s.pointLegendNum}>{p.n}: </Text>{p.label}
                  </Text>
                ))}
              </View>
              <Modal visible={dropdownOpen} transparent animationType="fade" onRequestClose={() => setDropdownOpen(false)}>
                <TouchableOpacity style={s.dropdownOverlay} activeOpacity={1} onPress={() => setDropdownOpen(false)}>
                  <View style={s.dropdownList}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {items.map((item, index) => (
                        <TouchableOpacity key={item._id} style={[s.dropdownItem, index === selectedIndex && s.dropdownItemActive]}
                          onPress={() => { setSelectedIndex(index); setDropdownOpen(false); }} activeOpacity={0.7}>
                          <Text style={[s.dropdownItemText, index === selectedIndex && s.dropdownItemTextActive]}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          )
        }
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── LEVELS AND LINES ────────────────────────────────────────────────────────
const TABS = ['Vertical', 'Horizontal', 'By Rotation'];

const LevelTabContent = ({ items, tabName }) => {
  const tabItems = items.filter(i => i.tab === tabName);
  if (tabItems.length === 0) return <EmptyState message="No content added for this tab yet." />;
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
      {tabItems.map((item, idx) => (
        <View key={item._id || idx} style={{ marginBottom: spacing.lg }}>
          {item.title      ? <Text style={s.tabPageTitle}>{item.title}</Text> : null}
          {item.subtitle   ? <Text style={s.sectionName}>{item.subtitle}</Text> : null}
          {(item.points || []).map((p, i) => (
            <Text key={i} style={s.sectionBody}>• {p.label || p}</Text>
          ))}
          {item.description ? <Text style={[s.sectionBody, { marginTop: spacing.sm }]}>{item.description}</Text> : null}
          {(item.images || []).map((img, i) => (
            <Image key={i} source={{ uri: `${BASE_URL}${img}` }} style={s.rotImage} resizeMode="contain" />
          ))}
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const LevelsScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);
  const W = SCREEN_WIDTH;

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/body-parts?category=levels`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const goToTab = (i) => { scrollRef.current?.scrollTo({ x: i * W, animated: true }); setActiveTab(i); };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Levels and Lines</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={s.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={tab} style={[s.tab, activeTab === i && s.tabActive]} onPress={() => goToTab(i)} activeOpacity={0.7}>
            <Text style={[s.tabText, activeTab === i && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} /> : (
        <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => setActiveTab(Math.round(e.nativeEvent.contentOffset.x / W))} style={{ flex: 1 }}>
          <View style={{ width: W }}><LevelTabContent items={items} tabName="Vertical" /></View>
          <View style={{ width: W }}><LevelTabContent items={items} tabName="Horizontal" /></View>
          <View style={{ width: W }}><LevelTabContent items={items} tabName="By Rotation" /></View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ─── MAIN MENU ────────────────────────────────────────────────────────────────
const BodyPartsScreen = ({ onBack }) => {
  const [activeScreen, setActiveScreen] = useState(null);

  if (activeScreen === 'attacking') return <AttackingToolsScreen onBack={() => setActiveScreen(null)} />;
  if (activeScreen === 'blocking')  return <BlockingToolsScreen  onBack={() => setActiveScreen(null)} />;
  if (activeScreen === 'vital')     return <VitalPointsScreen    onBack={() => setActiveScreen(null)} />;
  if (activeScreen === 'levels')    return <LevelsScreen         onBack={() => setActiveScreen(null)} />;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Body Parts</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.menuScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.key} style={s.menuItem} onPress={() => setActiveScreen(cat.key)} activeOpacity={0.7}>
            <Text style={s.menuLabel}>{cat.label}</Text>
            <Icon name="chevron-right" size={22} color="#9ca3af" type="MaterialIcons" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BodyPartsScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BLUE, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  menuScroll: { padding: spacing.md },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: spacing.md, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  menuLabel: { flex: 1, fontSize: 17, fontWeight: '700', color: '#1f2937' },
  scroll: { padding: spacing.md },
  emptyWrap: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#9ca3af', fontSize: 15, marginTop: 12 },
  // Attacking
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '48%' },
  cardBox: { backgroundColor: '#f8fafc', borderRadius: 12, height: 110, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', borderRadius: 12 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginTop: 6, textAlign: 'center' },
  cardKorean: { fontSize: 12, color: BLUE, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  attackImage: { width: SCREEN_WIDTH - spacing.md * 2, height: 400, borderRadius: 12, backgroundColor: '#f1f5f9' },
  tabPageTitle: { fontSize: 22, fontWeight: '900', color: '#1f2937', marginBottom: spacing.xs, lineHeight: 30 },
  sectionName: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginTop: 4, marginBottom: 4 },
  sectionBody: { fontSize: 14, color: '#374151', lineHeight: 22 },
  rotImage: { width: SCREEN_WIDTH - spacing.md * 2, height: 500, borderRadius: 12, marginTop: spacing.lg, backgroundColor: '#f1f5f9' },
  // Tabs
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#fff' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: BLUE },
  tabText: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  tabTextActive: { color: BLUE },
  // Vital
  dropdownBtn: { backgroundColor: '#9ca3af', borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  dropdownBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pointsLegend: { backgroundColor: '#f9fafb', borderRadius: 10, padding: spacing.md },
  pointLegendText: { fontSize: 15, color: '#374151', lineHeight: 26 },
  pointLegendNum: { fontWeight: '800', color: BLUE },
  vitalImage: { width: SCREEN_WIDTH - spacing.md * 2, height: 450, borderRadius: 12, backgroundColor: '#f1f5f9', marginBottom: spacing.md },
  // Blocking
  blockRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  blockLabel: { width: 130, fontSize: 14, fontWeight: '700', color: '#374151' },
  blockValueBtn: { flex: 1, backgroundColor: BLUE, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  blockValueText: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  // Dropdown
  dropdownOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: spacing.xl },
  dropdownList: { backgroundColor: '#fff', borderRadius: 12, maxHeight: 320, overflow: 'hidden' },
  dropdownItem: { paddingHorizontal: spacing.md, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dropdownItemActive: { backgroundColor: '#e0f0ff' },
  dropdownItemText: { fontSize: 15, color: '#374151' },
  dropdownItemTextActive: { color: BLUE, fontWeight: '700' },
});
