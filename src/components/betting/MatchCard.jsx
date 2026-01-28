import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import Card from '../common/Card';

const MatchCard = ({ match, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      {/* League Header */}
      <View style={styles.header}>
        <Text style={styles.leagueName}>{match.league}</Text>
        {match.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE {match.minute}'</Text>
          </View>
        )}
      </View>

      {/* Teams & Score */}
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{match.homeTeam.substring(0, 1)}</Text>
          </View>
          <Text style={styles.teamName} numberOfLines={1}>{match.homeTeam}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{match.homeScore} - {match.awayScore}</Text>
        </View>
        
        <View style={styles.team}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{match.awayTeam.substring(0, 1)}</Text>
          </View>
          <Text style={styles.teamName} numberOfLines={1}>{match.awayTeam}</Text>
        </View>
      </View>

      {/* Odds Grid */}
      <View style={styles.oddsGrid}>
        <TouchableOpacity style={styles.oddButton}>
          <Text style={styles.oddLabel}>1</Text>
          <Text style={styles.oddValue}>{match.odds.home}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oddButton}>
          <Text style={styles.oddLabel}>X</Text>
          <Text style={styles.oddValue}>{match.odds.draw}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oddButton}>
          <Text style={styles.oddLabel}>2</Text>
          <Text style={styles.oddValue}>{match.odds.away}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  leagueName: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
    marginRight: 6,
  },
  liveText: {
    color: colors.error,
    fontSize: 10,
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  teamName: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  scoreContainer: {
    paddingHorizontal: spacing.md,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  oddsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  oddButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oddLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  oddValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});

export default MatchCard;
