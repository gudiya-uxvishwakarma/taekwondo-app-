import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const CreateAccountCard = ({ onCreateAccount, onFacebookLogin, onAppleLogin, onGoogleLogin }) => {
  return (
    <View style={styles.container}>
      {/* Create Account Section */}
      <TouchableOpacity 
        style={styles.createAccountButton}
        onPress={onCreateAccount}
        activeOpacity={0.8}
      >
        <Text style={styles.createAccountText}>Create An Account</Text>
      </TouchableOpacity>
      
      {/* Or Divider */}
      <View style={styles.orSection}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>
      
      {/* Social Login Options */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={onFacebookLogin}
          activeOpacity={0.8}
        >
          <View style={[styles.socialIcon, styles.facebookIcon]}>
            <Text style={styles.socialIconText}>f</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={onAppleLogin}
          activeOpacity={0.8}
        >
          <View style={[styles.socialIcon, styles.appleIcon]}>
            <Text style={styles.socialIconText}>🍎</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={onGoogleLogin}
          activeOpacity={0.8}
        >
          <View style={[styles.socialIcon, styles.googleIcon]}>
            <Text style={styles.socialIconText}>G</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  
  // Create Account Button
  createAccountButton: {
    backgroundColor: colors.primary, // Red background
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  createAccountText: {
    color: colors.black, // Black text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Or Section
  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginHorizontal: spacing.md,
    fontWeight: '500',
  },
  
  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookIcon: {
    backgroundColor: '#1877F2',
  },
  appleIcon: {
    backgroundColor: colors.black,
  },
  googleIcon: {
    backgroundColor: '#4285F4',
  },
  socialIconText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CreateAccountCard;