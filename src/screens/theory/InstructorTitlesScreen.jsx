import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, Image, ActivityIndicator, Dimensions,
} from 'react-native';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const BLUE = '#006CB5';
const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
const { width: W } = Dimensions.get('window');

const InstructorTitlesScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const pagerRef = useRef(null);
  const tabBarRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, tabsRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/instructor-titles`),
        fetch(`${API_CONFIG.BASE_URL}/instructor-titles/tabs`),
      ]);
      const itemsData = await itemsRes.json();
      const tabsData = await tabsRes.json();
      setItems((itemsData.data || []).sort((a, b) => (Number(a.order) ?? 0) - (Number(b.order) ?? 0)));
      setTabs(tabsData.data || []);
    } catch (e) {
      console.log('InstructorTitlesScreen error:', e);
    } finally {
      setLoading(false);
    }
  };

  const goToTab = (index) => {
    setActiveIndex(index);
    pagerRef.current?.scrollTo({ x: index * W, animated: true });
    // Scroll tab bar to keep active tab visible
    tabBarRef.current?.scrollTo({ x: index * 100, animated: true });
  };

  const onPageScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    if (index !== activeIndex && index >= 0 && index < tabs.length) {
      setActiveIndex(index);
      tabBarRef.current?.scrollTo({ x: index * 100, animated: true });
    }
  };

  const renderSection = (item) => (
    <View key={item._id} style={styles.section}>
      {!!item.title && <Text style={styles.title}>{item.title}</Text>}
      {!!item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      {!!item.description && <Text style={styles.description}>{item.description}</Text>}
      {(item.headings || []).map((h, i) => (
        <Text key={i} style={styles.heading}>{h}</Text>
      ))}
      {(item.points || []).map((pt, i) => (
        <View key={i}>
          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{pt.text}</Text>
          </View>
          {(pt.subPoints || []).map((sp, si) => (
            <View key={si} style={styles.subBulletRow}>
              <Text style={styles.subBullet}>◦</Text>
              <Text style={styles.subBulletText}>{sp.text}</Text>
            </View>
          ))}
        </View>
      ))}
      {(item.images || []).map((img, i) => (
        <View key={i}>
          {!!img.name && <Text style={styles.imageName}>{img.name}</Text>}
          <Image
            source={{ uri: `${BASE_URL}${img.path || img}` }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instructor Titles & Stripes</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
      ) : tabs.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No content added yet.</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Tab bar */}
          <View style={styles.tabBarWrap}>
            <ScrollView
              ref={tabBarRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBarContent}
            >
              {tabs.map((tab, i) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeIndex === i && styles.tabActive]}
                  onPress={() => goToTab(i)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, activeIndex === i && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Swipeable pages */}
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onPageScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            {tabs.map((tab) => {
              const tabItems = items.filter(i => i.tab === tab);
              return (
                <ScrollView
                  key={tab}
                  style={{ width: W }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageContent}
                >
                  {tabItems.length === 0 ? (
                    <Text style={styles.emptyText}>No content for this tab yet.</Text>
                  ) : (
                    tabItems.map(item => renderSection(item))
                  )}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  // Tab bar
  tabBarWrap: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabBarContent: { paddingHorizontal: 8 },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: BLUE },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: BLUE },

  // Pages
  pageContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 28 },
  title: { fontSize: 20, fontWeight: '900', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 6 },
  description: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: 10 },
  heading: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginTop: 10, marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 6, paddingRight: 8 },
  bullet: { color: '#374151', fontSize: 15, marginRight: 8, marginTop: 2 },
  bulletText: { flex: 1, fontSize: 15, color: '#374151', lineHeight: 24 },
  subBulletRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 20, paddingRight: 8 },
  subBullet: { color: '#6b7280', fontSize: 13, marginRight: 8, marginTop: 2 },
  subBulletText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 20 },
  imageName: { fontSize: 13, fontWeight: '600', color: BLUE, marginTop: 10, marginBottom: 6 },
  image: { width: W - 32, height: 220, borderRadius: 8, marginBottom: 10, backgroundColor: '#f1f5f9' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6b7280', fontSize: 15, textAlign: 'center', marginTop: 40 },
});

export default InstructorTitlesScreen;
