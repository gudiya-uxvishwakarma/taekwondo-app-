import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '../../theme';

const TaekwondoLogo = ({ size = 120, showText = true }) => {
  const logoSize = size;
  const strokeWidth = size * 0.025;
  const centerRadius = size * 0.3;
  const outerRadius = size * 0.45;

  return (
    <View style={[styles.container, { width: logoSize, height: logoSize }]}>
      <Svg width={logoSize} height={logoSize} viewBox={`0 0 ${logoSize} ${logoSize}`}>
        <Defs>
          {/* Yellow gradient */}
          <LinearGradient id="yellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFC107" stopOpacity="1" />
          </LinearGradient>
          
          {/* Red gradient */}
          <LinearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#DC143C" stopOpacity="1" />
            <Stop offset="100%" stopColor="#B71C1C" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Outer black circle */}
        <Circle
          cx={logoSize / 2}
          cy={logoSize / 2}
          r={outerRadius}
          fill="none"
          stroke="#000000"
          strokeWidth={strokeWidth}
        />

        {/* Yellow top half */}
        <Path
          d={`M ${logoSize / 2 - outerRadius + strokeWidth} ${logoSize / 2} 
              A ${outerRadius - strokeWidth} ${outerRadius - strokeWidth} 0 0 1 ${logoSize / 2 + outerRadius - strokeWidth} ${logoSize / 2}
              Z`}
          fill="url(#yellowGrad)"
        />

        {/* Red bottom half */}
        <Path
          d={`M ${logoSize / 2 - outerRadius + strokeWidth} ${logoSize / 2} 
              A ${outerRadius - strokeWidth} ${outerRadius - strokeWidth} 0 0 0 ${logoSize / 2 + outerRadius - strokeWidth} ${logoSize / 2}
              Z`}
          fill="url(#redGrad)"
        />

        {/* White center circle */}
        <Circle
          cx={logoSize / 2}
          cy={logoSize / 2}
          r={centerRadius}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={strokeWidth * 0.8}
        />

        {/* Taekwondo silhouettes - simplified as paths */}
        <G transform={`translate(${logoSize / 2}, ${logoSize / 2 - centerRadius * 0.3})`}>
          {/* Left figure */}
          <Path
            d="M -15 -5 L -12 -8 L -10 -5 L -8 -2 L -12 0 L -15 -2 Z"
            fill="#000000"
            transform="scale(0.8)"
          />
          
          {/* Center figure */}
          <Path
            d="M -2 -8 L 2 -8 L 3 -5 L 1 -2 L -1 -2 L -3 -5 Z"
            fill="#000000"
            transform="scale(0.9)"
          />
          
          {/* Right figure */}
          <Path
            d="M 8 -2 L 12 0 L 10 -5 L 12 -8 L 15 -5 L 15 -2 Z"
            fill="#000000"
            transform="scale(0.8)"
          />
        </G>

        {/* TF Text */}
        <SvgText
          x={logoSize / 2}
          y={logoSize / 2 + 5}
          fontSize={size * 0.12}
          fontWeight="bold"
          textAnchor="middle"
          fill="#000000"
          fontFamily="Arial, sans-serif"
        >
          TF
        </SvgText>

        {/* Kannada text */}
        <SvgText
          x={logoSize / 2}
          y={logoSize / 2 + 18}
          fontSize={size * 0.06}
          fontWeight="600"
          textAnchor="middle"
          fill="#000000"
          fontFamily="Arial, sans-serif"
        >
          ಕಾರ್ಯಕ್ರಮ
        </SvgText>

        <SvgText
          x={logoSize / 2}
          y={logoSize / 2 + 28}
          fontSize={size * 0.05}
          fontWeight="500"
          textAnchor="middle"
          fill="#000000"
          fontFamily="Arial, sans-serif"
        >
          ಕರ್ನಾಟಕ
        </SvgText>

        {/* Circular text - top */}
        <Path
          id="topCircle"
          d={`M ${logoSize / 2 - outerRadius * 0.85} ${logoSize / 2} 
              A ${outerRadius * 0.85} ${outerRadius * 0.85} 0 0 1 ${logoSize / 2 + outerRadius * 0.85} ${logoSize / 2}`}
          fill="none"
        />
        
        <SvgText fontSize={size * 0.045} fontWeight="bold" fill="#000000">
          <SvgText textPath="#topCircle" startOffset="50%" textAnchor="middle">
            COMBAT WARRIOR TAEKWON-DO ASSOCIATION
          </SvgText>
        </SvgText>

        {/* Circular text - bottom */}
        <Path
          id="bottomCircle"
          d={`M ${logoSize / 2 + outerRadius * 0.85} ${logoSize / 2} 
              A ${outerRadius * 0.85} ${outerRadius * 0.85} 0 0 1 ${logoSize / 2 - outerRadius * 0.85} ${logoSize / 2}`}
          fill="none"
        />
        
        <SvgText fontSize={size * 0.045} fontWeight="bold" fill="#000000">
          <SvgText textPath="#bottomCircle" startOffset="50%" textAnchor="middle">
            OF KARNATAKA
          </SvgText>
        </SvgText>

        {/* Small decorative circles */}
        <Circle cx={logoSize / 2 - outerRadius * 0.9} cy={logoSize / 2} r={size * 0.02} fill="#FFD700" />
        <Circle cx={logoSize / 2 + outerRadius * 0.9} cy={logoSize / 2} r={size * 0.02} fill="#FFD700" />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize: size * 0.12 }]}>
            TAEKWON-DO ASSOCIATION
          </Text>
          <Text style={[styles.subtitle, { fontSize: size * 0.08 }]}>
            OF KARNATAKA
          </Text>
          <Text style={[styles.kannadaTitle, { fontSize: size * 0.07 }]}>
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

export default TaekwondoLogo;