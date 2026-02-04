import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from './common/Icon';

const IconTest = () => {
  const iconTests = [
    // MaterialIcons
    { name: 'dashboard', type: 'MaterialIcons', label: 'Dashboard' },
    { name: 'email', type: 'MaterialIcons', label: 'Email' },
    { name: 'lock', type: 'MaterialIcons', label: 'Lock' },
    { name: 'visibility', type: 'MaterialIcons', label: 'Visibility' },
    { name: 'login', type: 'MaterialIcons', label: 'Login' },
    { name: 'person', type: 'MaterialIcons', label: 'Person' },
    { name: 'event', type: 'MaterialIcons', label: 'Event' },
    { name: 'account-balance-wallet', type: 'MaterialIcons', label: 'Wallet' },
    
    // Ionicons
    { name: 'home', type: 'Ionicons', label: 'Home (Ionicons)' },
    { name: 'heart', type: 'Ionicons', label: 'Heart (Ionicons)' },
    { name: 'star', type: 'Ionicons', label: 'Star (Ionicons)' },
    
    // FontAwesome
    { name: 'user', type: 'FontAwesome', label: 'User (FA)' },
    { name: 'calendar', type: 'FontAwesome', label: 'Calendar (FA)' },
    
    // MaterialCommunityIcons
    { name: 'account', type: 'MaterialCommunityIcons', label: 'Account (MCI)' },
    { name: 'home-outline', type: 'MaterialCommunityIcons', label: 'Home (MCI)' },
  ];

  return (
    <ScrollView style={styles.container}>
      
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
});

export default IconTest;