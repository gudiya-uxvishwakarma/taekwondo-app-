import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';

// Multiple logo loading strategies for maximum compatibility
const getLogoSource = () => {
  try {
    // Primary: Try to load from assets folder
    return require('../../assets/logo.png');
  } catch (error) {
    console.log('Failed to load logo from assets, using fallback');
    // Fallback: Use drawable resource (Android) or bundled asset
    return { uri: 'logo' };
  }
};

const Logo = ({ 
  size = 'medium', 
  showText = true, 
  style = {},
  containerStyle = {},
  variant = 'default' // 'default', 'navbar', 'certificate', 'login'
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSource = getLogoSource();
  
  const sizes = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 70, height: 70, fontSize: 24 },
    large: { width: 100, height: 100, fontSize: 32 },
    xlarge: { width: 120, height: 120, fontSize: 36 }
  };
  
  const currentSize = sizes[size] || sizes.medium;
  
  const handleImageError = () => {
    console.log('Logo image failed to load, using text fallback');
    setImageError(true);
  };
  
  // Different variants for different screens
  const getVariantStyles = () => {
    switch (variant) {
      case 'navbar':
        return {
          container: { backgroundColor: '#ffffff', borderColor: '#ffd700', borderWidth: 2 },
          fallbackBg: '#FFD700',
          fallbackText: '#8B4513'
        };
      case 'certificate':
        return {
          container: { backgroundColor: '#FFD700', borderColor: '#8B4513', borderWidth: 4 },
          fallbackBg: '#FFD700',
          fallbackText: '#8B4513'
        };
      case 'login':
        return {
          container: { backgroundColor: '#ffffff', borderColor: '#ffffff', borderWidth: 4 },
          fallbackBg: '#FFD700',
          fallbackText: '#8B4513'
        };
      default:
        return {
          container: { backgroundColor: '#FFD700', borderColor: '#8B4513', borderWidth: 3 },
          fallbackBg: '#FFD700',
          fallbackText: '#8B4513'
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[
        styles.logoContainer, 
        { 
          width: currentSize.width + 10, 
          height: currentSize.height + 10,
          borderRadius: (currentSize.width + 10) / 2,
          backgroundColor: variantStyles.container.backgroundColor,
          borderColor: variantStyles.container.borderColor,
          borderWidth: variantStyles.container.borderWidth
        },
        style
      ]}>
        {!imageError ? (
          <Image 
            source={logoSource}
            style={[
              styles.logoImage, 
              { 
                width: currentSize.width, 
                height: currentSize.height,
                borderRadius: currentSize.width / 2
              }
            ]}
            resizeMode="contain"
            onError={handleImageError}
            defaultSource={Platform.OS === 'android' ? { uri: 'logo' } : undefined}
          />
        ) : (
          <View style={[
            styles.logoFallback,
            {
              width: currentSize.width,
              height: currentSize.height,
              borderRadius: currentSize.width / 2,
              backgroundColor: variantStyles.fallbackBg
            }
          ]}>
            <Text style={[
              styles.logoText, 
              { 
                fontSize: currentSize.fontSize,
                color: variantStyles.fallbackText
              }
            ]}>
              TKD
            </Text>
          </View>
        )}
      </View>
      {showText && (
        <Text style={styles.logoTextBelow}>
          TAEKWONDO
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  logoImage: {
    // Image styles are set dynamically
  },
  logoFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoTextBelow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B4513',
    marginTop: 4,
    letterSpacing: 1,
  },
});

export default Logo;