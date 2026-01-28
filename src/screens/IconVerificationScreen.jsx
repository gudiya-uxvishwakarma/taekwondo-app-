import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';

const IconVerificationScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Icon Test</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>❌</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Available Emoji Icons:</Text>
        
        <View style={styles.iconGrid}>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>🏠</Text>
            <Text style={styles.iconName}>Home</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.iconName}>Attendance</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>💳</Text>
            <Text style={styles.iconName}>Fees</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.iconName}>Profile</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>🥋</Text>
            <Text style={styles.iconName}>Karate</Text>
          </View>
          <View style={styles.iconItem}>
            <Text style={styles.icon}>🏆</Text>
            <Text style={styles.iconName}>Trophy</Text>
          </View>
        </View>
        
        <Text style={styles.note}>
          All vector icons have been replaced with emoji icons for better compatibility.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  iconItem: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    minWidth: 80,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  iconName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  note: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default IconVerificationScreen;