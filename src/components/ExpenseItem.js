import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { getCategory } from '../constants';
import { formatCurrency, formatDate } from '../utils/format';

export default function ExpenseItem({ expense, onDelete }) {
  const category = getCategory(expense.category);

  const confirmDelete = () => {
    Alert.alert(
      'Delete expense',
      `Remove this ${category.label} expense of ${formatCurrency(expense.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onLongPress={confirmDelete}
      accessibilityHint="Long press to delete"
    >
      <View style={[styles.iconCircle, { backgroundColor: category.color + '22' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>{category.label}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {expense.note ? expense.note : formatDate(expense.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        <Text style={styles.date}>{formatDate(expense.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  middle: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
});
