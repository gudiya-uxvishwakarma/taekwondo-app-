import React from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SparringListScreen = ({ onBack, onSelectSparring }) => {
  const sparringTypes = [
    {
      id: 1,
      title: '3-Step',
      description: 'Three step sparring technique',
      iconName: 'sports-kabaddi',
      color: '#f97316',
      bgColor: '#fff7ed',
    },
    {
      id: 2,
      title: '2-Step',
      description: 'Two step sparring technique',
      iconName: 'sports-kabaddi',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      id: 3,
      title: 'Free Sparring',
      description: 'Unrestricted sparring',
      iconName: 'sports-kabaddi',
      color: '#dc2626',
      bgColor: '#fee2e2',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
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

        <View style={styles.container}>
          {sparringTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.sparringItem}
              onPress={() => onSelectSparring(type.title)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.bgColor }]}>
                <Icon name={type.iconName} size={32} color={type.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{type.title}</Text>
                <Text style={styles.description}>{type.description}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    padding: 8,
  },
  scroll: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
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
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
  },
});

export default SparringListScreen;
