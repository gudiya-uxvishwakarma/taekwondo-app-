import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';
import { spacing } from '../../theme';

const BLUE = '#006CB5';
const BASE_URL = API_CONFIG.BASE_URL.replace('/api', '');
const { width: W } = Dimensions.get('window');

const DoJangScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/do-jang`)
      .then(r => r.json())
      .then(d => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const renderItem = (item, idx) => (
    <View key={item._id || idx} style={styles.section}>
      {item.title       ? <Text style={styles.title}>{item.title}</Text>           : null}
      {item.subtitle    ? <Text style={styles.subtitle}>{item.subtitle}</Text>     : null}
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
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Do Jang</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={BLUE} style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No content added yet.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {items.map((item, i) => renderItem(item, i))}
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
    backgroundColor: BLUE, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#0057a0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
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

export default DoJangScreen;
