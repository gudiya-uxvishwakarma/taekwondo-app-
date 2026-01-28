import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const Logo = ({ size = 'large', showText = true }) => {
  const logoSize = size === 'large' ? 120 : size === 'medium' ? 80 : 50;
  const textSize = size === 'large' ? typography.fontSize.xl : size === 'medium' ? typography.fontSize.lg : typography.fontSize.md;

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
        <Image
          source={require('../../assets/taekwondo-logo.png')}
          style={[styles.logoImage, { width: logoSize - 10, height: logoSize - 10, borderRadius: (logoSize - 10) / 2 }]}
          resizeMode="cover"
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.white,
  },
  logoImage: {
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  title: {
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 1.5,
  },
});

export default Logo;