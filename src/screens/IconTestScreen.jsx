import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from '../components/common/Icon';

const IconTestScreen = () => {
  const iconTests = [
    { name: 'dashboard', type: 'MaterialIcons', label: 'Dashboard' },
    { name: 'email', type: 'MaterialIcons', label: 'Email' },
    { name: 'lock', type: 'MaterialIcons', label: 'Lock' },
    { name: 'person', type: 'MaterialIcons', label: 'Person' },
    { name: 'event', type: 'MaterialIcons', label: 'Event' },
    { name: 'home', type: 'Ionicons', label: 'Home' },
    { name: 'heart', type: 'Ionicons', label: 'Heart' },
    { name: 'star', type: 'Ionicons', label: 'Star' },
    { name: 'user', type: 'FontAwesome', label: 'User' },
    { name: 'calendar', type: 'FontAwesome', label: 'Calendar' },
    { name: 'account', type: 'MaterialCommunityIcons', label: 'Account' },
    { name: 'home-outline', type: 'MaterialCommunityIcons', label: 'Home Outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Icon Test - Debug Mode</Text>
        <Text style={styles.subtitle}>Testing react-native-vector-icons</Text>
        
        <View style={styles.iconGrid}>
          {iconTests.map((iconTest, index) => (
            <View key={index} style={styles.iconItem}>
              <View style={styles.iconContainer}>
                <Icon 
                  name={iconTest.name} 
                  type={iconTest.type} 
                  size={32} 
                  color="#ff6b6b" 
                />
              </View>
              <Text style={styles.iconLabel}>{iconTest.label}</Text>
              <Text style={styles.iconType}>{iconTest.type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            ✓ If you can see all icons above, vector icons are working correctly!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconItem: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  iconType: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statusBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: '500',
  },
});

export default IconTestScreen;
