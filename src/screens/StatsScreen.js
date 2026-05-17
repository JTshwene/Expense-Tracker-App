import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { FALLBACK_CATEGORY } from '../constants';
import { useExpenses } from '../context/ExpenseContext';
import { isSameMonth, monthLabel, formatCurrency, addMonths } from '../utils/format';
import Pie3D from '../components/Pie3D';

export default function StatsScreen() {
  const { expenses, categories } = useExpenses();
  const [scope, setScope] = useState('month'); // 'month' | 'all'
  const [monthDate, setMonthDate] = useState(new Date());

  const now = new Date();
  const canGoNext =
    monthDate.getFullYear() < now.getFullYear() ||
    (monthDate.getFullYear() === now.getFullYear() && monthDate.getMonth() < now.getMonth());

  const filtered = useMemo(
    () =>
      scope === 'all'
        ? expenses
        : expenses.filter((e) => isSameMonth(e.date, monthDate)),
    [expenses, scope, monthDate],
  );

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const breakdown = useMemo(() => {
    const totals = {};
    filtered.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    const rows = categories
      .map((c) => ({ ...c, amount: totals[c.id] || 0 }))
      .filter((c) => c.amount > 0);
    let unknown = 0;
    Object.keys(totals).forEach((id) => {
      if (!categories.some((c) => c.id === id)) unknown += totals[id];
    });
    if (unknown > 0) rows.push({ ...FALLBACK_CATEGORY, amount: unknown });
    return rows.sort((a, b) => b.amount - a.amount);
  }, [filtered, categories]);

  const chartWidth = Math.min(320, Dimensions.get('window').width - 72);
  const pieData = breakdown.map((c) => ({ value: c.amount, color: c.color, label: c.label }));

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
              Month
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

        {scope === 'month' && (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              activeOpacity={0.7}
              onPress={() => setMonthDate(addMonths(monthDate, -1))}
            >
              <Text style={styles.stepArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.stepLabel}>{monthLabel(monthDate)}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, !canGoNext && styles.stepBtnDisabled]}
              activeOpacity={0.7}
              disabled={!canGoNext}
              onPress={() => setMonthDate(addMonths(monthDate, 1))}
            >
              <Text style={[styles.stepArrow, !canGoNext && styles.stepArrowDisabled]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            {scope === 'month' ? `Total — ${monthLabel(monthDate)}` : 'Total — All Time'}
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
          <>
            <View style={styles.chartWrap}>
              <Pie3D data={pieData} width={chartWidth} />
            </View>
            {breakdown.map((cat) => {
              const pct = total > 0 ? (cat.amount / total) * 100 : 0;
              return (
                <View key={cat.id} style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: cat.color }]} />
                  <Text style={styles.legendName} numberOfLines={1}>
                    {cat.icon}  {cat.label}
                  </Text>
                  <View style={styles.legendRight}>
                    <Text style={styles.legendAmount}>{formatCurrency(cat.amount)}</Text>
                    <Text style={styles.legendPct}>{pct.toFixed(1)}%</Text>
                  </View>
                </View>
              );
            })}
          </>
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  stepBtn: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: -2,
  },
  stepArrowDisabled: {
    color: colors.muted,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 20,
    marginTop: spacing.md,
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
  chartWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  legendName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  legendPct: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
});
