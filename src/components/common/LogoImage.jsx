import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const LogoImage = ({ size = 'large', showText = true }) => {
  const logoSize = size === 'large' ? 120 : size === 'medium' ? 80 : 60;
  const textSize = size === 'large' ? typography.fontSize.xl : size === 'medium' ? typography.fontSize.lg : typography.fontSize.md;

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize }]}>
        <Image
          source={require('../../assets/taekwondo-logo.png')}
          style={[styles.logoImage, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
      </View>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize: textSize }]}>
            TAEKWON-DO ASSOCIATION
          </Text>
          <Text style={[styles.subtitle, { fontSize: textSize * 0.7 }]}>
            OF KARNATAKA
          </Text>
          <Text style={[styles.kannadaTitle, { fontSize: textSize * 0.6 }]}>
            ಕರ್ನಾಟಕ
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 60,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoImage: {
    borderRadius: 57, // Slightly smaller than container for border effect
  },
  textContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  title: {
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  kannadaTitle: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default LogoImage;