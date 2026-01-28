import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { colors, typography, spacing } from '../theme';

const MyBetsScreen = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'settled'

  const activeBets = [
    {
      id: '1',
      teams: 'Arsenal vs Liverpool',
      selection: 'Arsenal Win (1)',
      odds: '2.45',
      stake: '$50.00',
      potentialReturn: '$122.50',
      status: 'Open'
    },
    {
      id: '2',
      teams: 'Lakers vs Warriors',
      selection: 'Over 220.5',
      odds: '1.90',
      stake: '$25.00',
      potentialReturn: '$47.50',
      status: 'Open'
    }
  ];

  const settledBets = [
    {
      id: '3',
      teams: 'Man City vs Chelsea',
      selection: 'Man City Win',
      odds: '1.50',
      stake: '$100.00',
      result: 'Won',
      return: '$150.00'
    },
    {
      id: '4',
      teams: 'Djokovic vs Alcaraz',
      selection: 'Alcaraz Win',
      odds: '2.10',
      stake: '$50.00',
      result: 'Lost',
      return: '$0.00'
    }
  ];

  const renderBetCard = (bet, isSettled) => (
    <View key={bet.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.matchTitle}>{bet.teams}</Text>
        <View style={[
          styles.statusBadge, 
          isSettled ? (bet.result === 'Won' ? styles.wonBadge : styles.lostBadge) : styles.openBadge
        ]}>
          <Text style={[
            styles.statusText,
            isSettled ? (bet.result === 'Won' ? styles.wonText : styles.lostText) : styles.openText
          ]}>
            {isSettled ? bet.result : bet.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.selectionRow}>
        <Text style={styles.label}>Selection:</Text>
        <Text style={styles.value}>{bet.selection}</Text>
      </View>
      
      <View style={styles.selectionRow}>
        <Text style={styles.label}>Odds:</Text>
        <Text style={styles.value}>{bet.odds}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.label}>Stake</Text>
          <Text style={styles.stakeValue}>{bet.stake}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>{isSettled ? 'Return' : 'Potential Return'}</Text>
          <Text style={[styles.returnValue, isSettled && bet.result === 'Lost' && { color: colors.textSecondary }]}>
            {isSettled ? bet.return : bet.potentialReturn}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>My Bets</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]} 
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settled' && styles.activeTab]} 
          onPress={() => setActiveTab('settled')}
        >
          <Text style={[styles.tabText, activeTab === 'settled' && styles.activeTabText]}>Settled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {activeTab === 'active' 
          ? activeBets.map(bet => renderBetCard(bet, false))
          : settledBets.map(bet => renderBetCard(bet, true))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  matchTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadge: { backgroundColor: colors.info + '20' },
  wonBadge: { backgroundColor: colors.success + '20' },
  lostBadge: { backgroundColor: colors.error + '10' },
  
  statusText: { fontSize: 12, fontWeight: 'bold' },
  openText: { color: colors.info },
  wonText: { color: colors.success },
  lostText: { color: colors.error },

  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stakeValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  returnValue: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.success,
  },
});

export default MyBetsScreen;
