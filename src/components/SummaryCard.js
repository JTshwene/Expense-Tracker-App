import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { formatCurrency } from '../utils/format';

export default function SummaryCard({ monthLabel, spent, budget }) {
  const hasBudget = budget > 0;
  const remaining = budget - spent;
  const ratio = hasBudget ? Math.min(spent / budget, 1) : 0;
  const overBudget = hasBudget && spent > budget;

  let barColor = colors.success;
  if (ratio >= 1) barColor = colors.danger;
  else if (ratio >= 0.75) barColor = colors.warning;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Spent in {monthLabel}</Text>
      <Text style={styles.amount}>{formatCurrency(spent)}</Text>

      {hasBudget ? (
        <>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: barColor }]} />
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Budget: {formatCurrency(budget)}</Text>
            <Text style={[styles.metaText, overBudget && styles.metaDanger]}>
              {overBudget
                ? `Over by ${formatCurrency(Math.abs(remaining))}`
                : `${formatCurrency(remaining)} left`}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.hint}>Set a monthly budget in Settings to track your spending.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 18,
  },
  label: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginTop: 16,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  metaDanger: {
    color: '#FFD9DA',
  },
  hint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 14,
    lineHeight: 18,
  },
});
