import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../theme';

const Card = ({ 
  children, 
  style, 
  onPress, 
  variant = 'default',
  padding = 'medium',
  shadow = true 
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Padding styles
    if (padding === 'small') {
      baseStyle.push(styles.paddingSmall);
    } else if (padding === 'large') {
      baseStyle.push(styles.paddingLarge);
    } else {
      baseStyle.push(styles.paddingMedium);
    }
    
    // Variant styles
    if (variant === 'primary') {
      baseStyle.push(styles.cardPrimary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.cardSecondary);
    }
    
    // Shadow
    if (shadow) {
      baseStyle.push(styles.cardShadow);
    }
    
    return baseStyle;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[...getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Padding styles
  paddingSmall: {
    padding: spacing.md,
  },
  paddingMedium: {
    padding: spacing.lg,
  },
  paddingLarge: {
    padding: spacing.xl,
  },
  
  // Variant styles
  cardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cardSecondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  
  // Shadow
  cardShadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default Card;