import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import API_CONFIG from '../../config/api';

const KoreanRow = ({ korean, english }) => (
  <View style={styles.row}>
    <Text style={styles.korean}>{korean}</Text>
    <Text style={styles.english}>{english}</Text>
  </View>
);

const SectionHeader = ({ title, korean }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}{korean ? <Text> / <Text style={styles.green}>{korean}</Text></Text> : null}</Text>
  </View>
);

const KoreanScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/korean`)
      .then(r => r.json())
      .then(d => { 
        const data = d.data || [];
        // Sort by creation date (oldest first for consistent creation order)
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateA - dateB; // Oldest first (creation order)
        });
        setItems(sortedData); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  // Group by section preserving creation order of sections
  const sections = [];
  const seen = new Set();
  items.forEach(item => {
    if (!seen.has(item.section)) {
      seen.add(item.section);
      // Find the earliest creation date for this section to maintain section order
      const sectionItems = items.filter(i => i.section === item.section);
      const earliestDate = Math.min(...sectionItems.map(i => new Date(i.createdAt || i.created_at || 0)));
      sections.push({ 
        section: item.section, 
        sectionKorean: item.sectionKorean || '', 
        items: [],
        earliestDate: earliestDate
      });
    }
  });

  // Sort sections by their earliest creation date (first created section appears first)
  sections.sort((a, b) => a.earliestDate - b.earliestDate);

  // Add items to their respective sections, keeping newest items first within each section
  items.forEach(item => {
    sections.find(s => s.section === item.section).items.push(item);
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KOREAN</Text>
        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#006CB5" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No data added yet.</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {sections.map((sec) => (
            <View key={sec.section}>
              <SectionHeader title={sec.section} korean={sec.sectionKorean} />
              {sec.items.map((item) => (
                <KoreanRow key={item._id} korean={item.korean} english={item.english} />
              ))}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#006CB5', paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { padding: 8 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionHeader: { alignItems: 'center', paddingVertical: 16 },
  sectionHeaderText: { fontSize: 18, color: '#1f2937' },
  green: { color: '#006CB5', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  korean: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', flex: 1 },
  english: { fontSize: 14, color: '#374151', textAlign: 'right', flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6b7280', fontSize: 15 },
});

export default KoreanScreen;
