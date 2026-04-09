import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import API_CONFIG from '../../config/api';

const TechniqueScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/technique-divisions`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (e) {
      console.log('TechniqueScreen fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    return (
      <TechniqueDetailScreen
        item={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Division of techniques</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#006CB5" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {Object.entries(grouped).map(([category, catItems]) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {catItems.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.subItem}
                  onPress={() => setSelected(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {items.length === 0 && (
            <Text style={styles.emptyText}>No content available.</Text>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ── Detail Screen ─────────────────────────────────────────────────────────────
const TechniqueDetailScreen = ({ item, onBack }) => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{item.title}</Text>
      <View style={{ width: 40 }} />
    </View>
    <View style={styles.divider} />

    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.detailTitle}>{item.title}</Text>

      {/* Subtitle */}
      {!!item.subtitle && (
        <Text style={styles.detailSubtitle}>{item.subtitle}</Text>
      )}

      {/* Description */}
      {!!item.description && (
        <Text style={styles.detailDescription}>{item.description}</Text>
      )}

      {/* Headings */}
      {(item.headings || []).length > 0 && (
        <View style={styles.headingBlock}>
          {item.headings.map((h, i) => (
            <Text key={i} style={styles.headingText}>{h}</Text>
          ))}
        </View>
      )}

      {/* Points */}
      {(item.points || []).map((pt, pi) => (
        <View key={pi}>
          <Text style={styles.point}>• {pt.text}</Text>
          {(pt.subPoints || []).map((sp, si) => (
            <View key={si}>
              <Text style={styles.subPoint}>◦ {sp.text}</Text>
              {(sp.subPoints || []).map((ssp, ssi) => (
                <Text key={ssi} style={styles.subSubPoint}>▸ {ssp.text}</Text>
              ))}
            </View>
          ))}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006CB5',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 8, width: 40 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  divider: { height: 2, backgroundColor: '#006CB5' },
  scroll: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  categoryTitle: {
    fontSize: 15, fontWeight: 'bold', color: '#000',
    marginBottom: 4, marginTop: 20,
  },
  subItem: { paddingVertical: 10, paddingLeft: 20 },
  subItemText: { fontSize: 15, fontWeight: '600', color: '#333' },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 14 },

  // Detail screen
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 6 },
  detailSubtitle: { fontSize: 15, color: '#555', marginBottom: 8, fontStyle: 'italic' },
  detailDescription: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 16 },
  headingBlock: { marginBottom: 16 },
  headingText: { fontSize: 15, fontWeight: 'bold', color: '#000', marginBottom: 6 },
  point: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 4, paddingLeft: 4 },
  subPoint: { fontSize: 13, lineHeight: 20, color: '#555', marginBottom: 3, paddingLeft: 20 },
  subSubPoint: { fontSize: 12, lineHeight: 18, color: '#777', marginBottom: 2, paddingLeft: 36 },
});

export default TechniqueScreen;
