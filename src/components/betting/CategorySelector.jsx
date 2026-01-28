import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const categories = [
  { id: '1', name: 'All', icon: '🔥' },
  { id: '2', name: 'Football', icon: '⚽' },
  { id: '3', name: 'Tennis', icon: '🎾' },
  { id: '4', name: 'Basketball', icon: '🏀' },
  { id: '5', name: 'Cricket', icon: '🏏' },
  { id: '6', name: 'Esports', icon: '🎮' },
  { id: '7', name: 'Hockey', icon: '🏒' },
];

const CategorySelector = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.item,
                isSelected && styles.itemSelected
              ]}
              onPress={() => onSelect(cat.id)}
            >
              <View style={[
                styles.iconContainer,
                isSelected && styles.iconContainerSelected
              ]}>
                <Text style={styles.icon}>{cat.icon}</Text>
              </View>
              <Text style={[
                styles.label,
                isSelected && styles.labelSelected
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  item: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  itemSelected: {
    // scale effect handled via formatting
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  labelSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});

export default CategorySelector;
