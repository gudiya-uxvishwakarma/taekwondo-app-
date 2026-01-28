import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * LinearGradient component using CSS-like gradients
 * Since we're avoiding external libraries, we'll use overlapping views with opacity
 */
const LinearGradient = ({ colors, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }, style, children }) => {
  // For simplicity, we'll create a two-color gradient effect
  const [color1, color2] = colors;
  
  return (
    <View style={[styles.container, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color1 }]} />
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: color2,
            opacity: 0.7,
          }
        ]} 
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default LinearGradient;
