import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';
import { useExpenses } from '../context/ExpenseContext';

export default function CategoriesScreen({ navigate }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenses();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const openNew = () => {
    setEditing({});
    setLabel('');
    setIcon(ICON_OPTIONS[0]);
    setColor(COLOR_OPTIONS[0]);
  };

  const openEdit = (c) => {
    setEditing(c);
    setLabel(c.label);
    setIcon(c.icon);
    setColor(c.color);
  };

  const close = () => setEditing(null);

  const save = () => {
    const name = label.trim();
    if (!name) {
      Alert.alert('Name required', 'Please enter a category name.');
      return;
    }
    if (editing && editing.id) {
      updateCategory(editing.id, { label: name, icon, color });
    } else {
      addCategory({ label: name, icon, color });
    }
    close();
  };

  const confirmDelete = (c) => {
    Alert.alert(
      'Delete category',
      `Delete "${c.label}"? Existing expenses keep their amounts but will show as uncategorised.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(c.id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigate('settings')}
          style={styles.back}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>Categories</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((c) => (
          <View key={c.id} style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: c.color + '22' }]}>
              <Text style={styles.icon}>{c.icon}</Text>
            </View>
            <Text style={styles.rowLabel} numberOfLines={1}>
              {c.label}
            </Text>
            <TouchableOpacity onPress={() => openEdit(c)} style={styles.actionBtn} activeOpacity={0.7}>
              <Text style={styles.actionEdit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDelete(c)}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.actionDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {categories.length === 0 && (
          <Text style={styles.emptyText}>No categories yet. Add your first one below.</Text>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={openNew} activeOpacity={0.85}>
          <Text style={styles.addText}>+ Add Category</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing && editing.id ? 'Edit Category' : 'New Category'}
            </Text>

            <View style={styles.preview}>
              <View style={[styles.previewIcon, { backgroundColor: color }]}>
                <Text style={styles.previewIconText}>{icon}</Text>
              </View>
              <Text style={styles.previewLabel}>{label.trim() || 'Category name'}</Text>
            </View>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={label}
                onChangeText={setLabel}
                placeholder="e.g. Gym, Pets, Internet"
                placeholderTextColor={colors.muted}
                maxLength={28}
              />

              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.grid}>
                {ICON_OPTIONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[styles.iconOpt, icon === ic && styles.iconOptSelected]}
                    onPress={() => setIcon(ic)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.iconOptText}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Colour</Text>
              <View style={styles.grid}>
                {COLOR_OPTIONS.map((co) => (
                  <TouchableOpacity
                    key={co}
                    style={[
                      styles.colorOpt,
                      { backgroundColor: co },
                      color === co && styles.colorOptSelected,
                    ]}
                    onPress={() => setColor(co)}
                    activeOpacity={0.7}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={close} activeOpacity={0.8}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={save} activeOpacity={0.85}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  back: {
    marginBottom: 2,
  },
  backText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  rowLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actionEdit: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  actionDelete: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    maxHeight: '86%',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 12,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIconText: {
    fontSize: 20,
  },
  previewLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconOpt: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  iconOptSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#E7F0F8',
  },
  iconOptText: {
    fontSize: 20,
  },
  colorOpt: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    marginRight: 8,
    marginBottom: 8,
  },
  colorOptSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  cancelText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
