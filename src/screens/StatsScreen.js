import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { CATEGORIES } from '../constants';
import { useExpenses } from '../context/ExpenseContext';
import { isSameMonth, monthLabel, formatCurrency } from '../utils/format';

export default function StatsScreen() {
  const { expenses } = useExpenses();
  const [scope, setScope] = useState('month'); // 'month' | 'all'

  const filtered = useMemo(
    () => (scope === 'month' ? expenses.filter((e) => isSameMonth(e.date)) : expenses),
    [expenses, scope],
  );

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const breakdown = useMemo(() => {
    const totals = {};
    filtered.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return CATEGORIES.map((cat) => ({
      ...cat,
      amount: totals[cat.id] || 0,
    }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Statistics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, scope === 'month' && styles.toggleActive]}
            onPress={() => setScope('month')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, scope === 'month' && styles.toggleTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, scope === 'all' && styles.toggleActive]}
            onPress={() => setScope('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, scope === 'all' && styles.toggleTextActive]}>
              All Time
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            {scope === 'month' ? `Total — ${monthLabel()}` : 'Total — All Time'}
          </Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
          <Text style={styles.totalCount}>
            {filtered.length} {filtered.length === 1 ? 'expense' : 'expenses'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Spending by Category</Text>

        {breakdown.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>No expenses recorded for this period.</Text>
          </View>
        ) : (
          breakdown.map((cat) => {
            const pct = total > 0 ? (cat.amount / total) * 100 : 0;
            return (
              <View key={cat.id} style={styles.catRow}>
                <View style={styles.catHeader}>
                  <Text style={styles.catName}>
                    {cat.icon}  {cat.label}
                  </Text>
                  <Text style={styles.catAmount}>{formatCurrency(cat.amount)}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { width: `${pct}%`, backgroundColor: cat.color }]}
                  />
                </View>
                <Text style={styles.catPct}>{pct.toFixed(1)}%</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.muted,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: spacing.lg,
  },
  totalLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  totalCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  catRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  catPct: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    textAlign: 'right',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 44,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
  },
});
