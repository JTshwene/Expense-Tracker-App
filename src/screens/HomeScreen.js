import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { useExpenses } from '../context/ExpenseContext';
import { isSameMonth, monthLabel } from '../utils/format';
import SummaryCard from '../components/SummaryCard';
import ExpenseItem from '../components/ExpenseItem';

export default function HomeScreen({ navigate }) {
  const { expenses, budget, deleteExpense } = useExpenses();

  const monthName = monthLabel();
  const spentThisMonth = useMemo(
    () =>
      expenses
        .filter((e) => isSameMonth(e.date))
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  const header = (
    <View>
      <Text style={styles.greeting}>Dumela! 👋</Text>
      <Text style={styles.subGreeting}>Here is your spending overview</Text>
      <SummaryCard monthLabel={monthName} spent={spentThisMonth} budget={budget} />
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <Text style={styles.count}>{expenses.length} total</Text>
      </View>
    </View>
  );

  const empty = (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>🧾</Text>
      <Text style={styles.emptyTitle}>No expenses yet</Text>
      <Text style={styles.emptyText}>Tap the button below to record your first expense.</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => navigate('add')} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>Add an expense</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>Pula Expense Tracker</Text>
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} onDelete={deleteExpense} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
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
    flexGrow: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  count: {
    fontSize: 13,
    color: colors.muted,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
