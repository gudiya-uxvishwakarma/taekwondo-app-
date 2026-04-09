import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import API_CONFIG from '../../config/api';

const TYPE_COLORS = {
  '3-step':  { color: '#f97316', bgColor: '#fff7ed' },
  '2-step':  { color: '#f59e0b', bgColor: '#fffbeb' },
  '1-step':  { color: '#8b5cf6', bgColor: '#f5f3ff' },
  'free':    { color: '#dc2626', bgColor: '#fee2e2' },
};

const SparringListScreen = ({ onBack, onSelectSparring }) => {
  const [sparringTypes, setSparringTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSparring();
  }, []);

  const fetchSparring = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/sparring`);
      const data = await res.json();
      if (data.status === 'success' && data.data?.length > 0) {
        setSparringTypes(data.data);
      }
    } catch (err) {
      console.log('Sparring fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sparring</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Select Sparring Type</Text>
          <Text style={styles.subtitle}>Choose a sparring technique to learn</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#006CB5" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.container}>
            {sparringTypes.map((type) => {
              const colors = TYPE_COLORS[type.type] || { color: '#006CB5', bgColor: '#eff6ff' };
              return (
                <TouchableOpacity
                  key={type._id}
                  style={styles.sparringItem}
                  onPress={() => onSelectSparring(type.type, type)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.bgColor }]}>
                    <Icon name="sports-kabaddi" size={32} color={colors.color} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{type.title}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#d1d5db" />
                </TouchableOpacity>
              );
            })}
            {sparringTypes.length === 0 && (
              <Text style={styles.emptyText}>No sparring types available.</Text>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006CB5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { padding: 8 },
  scroll: { flex: 1 },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280' },
  container: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  sparringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  description: { fontSize: 13, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 14 },
});

export default SparringListScreen;
