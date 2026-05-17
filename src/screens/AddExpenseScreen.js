import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, radius } from '../theme';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';

export default function AddExpenseScreen({ navigate }) {
  const { addExpense, categories } = useExpenses();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] ? categories[0].id : null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (categories.length && !categories.some((c) => c.id === category)) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  const reset = () => {
    setAmount('');
    setCategory(categories[0] ? categories[0].id : null);
    setNote('');
    setDate(new Date());
  };

  const onChangeDate = (event, selected) => {
    setShowPicker(false);
    if (event.type !== 'dismissed' && selected) setDate(selected);
  };

  const handleSave = () => {
    const value = parseFloat(String(amount).replace(',', '.'));
    if (!value || value <= 0) {
      Alert.alert('Invalid amount', 'Please enter an amount greater than zero.');
      return;
    }
    if (!category) {
      Alert.alert('No category', 'Please add a category first from the Categories screen.');
      return;
    }
    addExpense({ amount: value, category, note, date: date.toISOString() });
    reset();
    showToast('Expense saved');
    navigate('home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Text style={styles.appName}>Add Expense</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Amount (Pula)</Text>
        <View style={styles.amountWrap}>
          <Text style={styles.currency}>P</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.label}>Category</Text>
        {categories.length === 0 ? (
          <Text style={styles.emptyHint}>
            You have no categories. Add one from Settings → Manage Categories.
          </Text>
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const selected = cat.id === category;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    selected && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateField}
          activeOpacity={0.8}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Text style={styles.dateIcon}>📅</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Combi to work, Choppies shopping"
          placeholderTextColor={colors.muted}
          maxLength={80}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveText}>Save Expense</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: spacing.md,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    paddingVertical: 14,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dateIcon: {
    fontSize: 16,
  },
  emptyHint: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
