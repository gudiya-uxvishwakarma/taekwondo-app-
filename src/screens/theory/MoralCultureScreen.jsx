import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';
import { spacing } from '../../theme';

const BLUE = '#006CB5';
const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
const { width: W } = Dimensions.get('window');

const MoralCultureScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/moral-culture`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Derive unique ordered tabs from data
  const tabs = [...new Set(items.map(i => i.tab).filter(Boolean))];
  const hasTabs = tabs.length > 0;

  // Items for a given tab (or all if no tabs)
  const itemsForTab = (tab) => items.filter(i => i.tab === tab);

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({ x: index * W, animated: true });
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveTab(index);
  };

  const renderSection = (item, idx) => (
    <View key={item._id || idx} style={styles.section}>
      {item.title       ? <Text style={styles.title}>{item.title}</Text>             : null}
      {item.subtitle    ? <Text style={styles.subtitle}>{item.subtitle}</Text>       : null}
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      {(item.points || []).map((p, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{p}</Text>
        </View>
      ))}
      {(item.images || []).map((img, i) => (
        <Image key={i} source={{ uri: `${BASE_URL}${img}` }} style={styles.image} resizeMode="contain" />
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
        <Text style={styles.headerTitle}>Moral Culture</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
      ) : !hasTabs ? (
        // No tabs — render all items in a single scroll
        items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No content added yet.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {items.map((item, i) => renderSection(item, i))}
            <View style={{ height: 40 }} />
          </ScrollView>
        )
      ) : (
        <>
          {/* Tab bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabBar}
            contentContainerStyle={styles.tabBarContent}
          >
            {tabs.map((tab, i) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
                onPress={() => handleTabPress(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Swipeable pages */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            {tabs.map((tab) => {
              const tabItems = itemsForTab(tab);
              return (
                <View key={tab} style={{ width: W, flex: 1 }}>
                  {tabItems.length === 0 ? (
                    <View style={styles.emptyWrap}>
                      <Text style={styles.emptyText}>No content in this tab yet.</Text>
                    </View>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                      {tabItems.map((item, i) => renderSection(item, i))}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BLUE, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#0057a0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  // Tab bar
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexGrow: 0,
  },
  tabBarContent: { paddingHorizontal: spacing.sm },
  tabItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: BLUE },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  tabTextActive: { color: BLUE },

  // Content
  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  section: { marginBottom: spacing.lg },
  title: { fontSize: 22, fontWeight: '900', color: '#1f2937', marginBottom: spacing.xs },
  subtitle: { fontSize: 17, fontWeight: '700', color: '#1f2937', marginTop: spacing.md, marginBottom: spacing.xs },
  description: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: spacing.md },
  bulletRow: { flexDirection: 'row', marginBottom: spacing.sm, paddingRight: spacing.sm },
  bullet: { color: '#374151', fontSize: 15, marginRight: 8, marginTop: 2 },
  bulletText: { flex: 1, fontSize: 15, color: '#374151', lineHeight: 24 },
  image: { width: W - spacing.md * 2, height: 260, borderRadius: 8, marginVertical: spacing.md, backgroundColor: '#f1f5f9' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6b7280', fontSize: 15 },
});

export default MoralCultureScreen;
