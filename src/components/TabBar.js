import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'add', label: 'Add', icon: '➕' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function TabBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const focused = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onChange(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.icon, focused && styles.iconFocused]}>{tab.icon}</Text>
            <Text style={[styles.label, focused && styles.labelFocused]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    opacity: 0.45,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    color: colors.muted,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '700',
  },
});
