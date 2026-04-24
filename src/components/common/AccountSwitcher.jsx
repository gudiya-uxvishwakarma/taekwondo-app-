import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from './Icon';
import { colors, spacing } from '../../theme';

const AccountSwitcher = ({ onSwitchAccount, currentAccountType }) => {
  const handleSwitchAccount = () => {
    Alert.alert(
      'Switch Account Type',
      'Do you want to switch to a different account type? You will be logged out.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch Account',
          onPress: async () => {
            try {
              // Clear account type
              await AsyncStorage.removeItem('accountType');
              // Clear any auth data
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('loginSource');
              
              // Call the switch callback
              if (onSwitchAccount) {
                onSwitchAccount();
              }
            } catch (error) {
              console.log('Error switching account:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getAccountTypeLabel = () => {
    switch (currentAccountType) {
      case 'student':
        return 'Student Account';
      case 'practical':
        return 'Practical Account';
      case 'theory':
        return 'Theory Account';
      default:
        return 'Account';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.accountInfo}>
        <Icon name="account-circle" size={20} color={colors.primary} type="MaterialIcons" />
        <Text style={styles.accountLabel}>{getAccountTypeLabel()}</Text>
      </View>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={handleSwitchAccount}
        activeOpacity={0.7}
      >
        <Icon name="swap-horiz" size={18} color={colors.primary} type="MaterialIcons" />
        <Text style={styles.switchText}>Switch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  switchText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default AccountSwitcher;
