import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OfflineIndicator = ({ message = 'Using offline data', visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <MaterialIcons name="cloud-off" size={16} color="#666" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    gap: 8,
  },
  text: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
    flex: 1,
  },
});

export default OfflineIndicator;