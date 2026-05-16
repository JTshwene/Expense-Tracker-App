import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/format';

export default function SettingsScreen() {
  const { budget, setBudget, expenses, clearData } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(budget ? String(budget) : '');

  const handleSaveBudget = () => {
    const value = parseFloat(String(budgetInput).replace(',', '.'));
    if (budgetInput && (isNaN(value) || value < 0)) {
      Alert.alert('Invalid budget', 'Please enter a valid amount.');
      return;
    }
    setBudget(value || 0);
    Alert.alert('Saved', 'Your monthly budget has been updated.');
  };

  const handleClear = () => {
    Alert.alert(
      'Clear all data',
      'This permanently deletes all expenses and your budget. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: () => {
            clearData();
            setBudgetInput('');
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Text style={styles.appName}>Settings</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <Text style={styles.cardHint}>
            Set how much you plan to spend each month. Leave at zero for no limit.
          </Text>
          <View style={styles.amountWrap}>
            <Text style={styles.currency}>P</Text>
            <TextInput
              style={styles.amountInput}
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBudget} activeOpacity={0.85}>
            <Text style={styles.saveText}>Save Budget</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Data</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Expenses recorded</Text>
            <Text style={styles.statValue}>{expenses.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current budget</Text>
            <Text style={styles.statValue}>{formatCurrency(budget)}</Text>
          </View>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleClear} activeOpacity={0.85}>
            <Text style={styles.dangerText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutText}>
            Pula Expense Tracker helps people in Botswana keep track of everyday spending in
            Botswana Pula (BWP). All data is stored privately on your own device.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
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
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  cardHint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 18,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  currency: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    paddingVertical: 12,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  dangerText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '800',
  },
  aboutText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: 6,
  },
  version: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 12,
  },
});
