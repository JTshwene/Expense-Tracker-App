import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = '@pula_expenses';
const BUDGET_KEY = '@pula_budget';
const CATEGORIES_KEY = '@pula_categories';

export async function loadExpenses() {
  try {
    const raw = await AsyncStorage.getItem(EXPENSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveExpenses(expenses) {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    // Ignore write failures; in-memory state remains the source of truth.
  }
}

export async function loadBudget() {
  try {
    const raw = await AsyncStorage.getItem(BUDGET_KEY);
    return raw ? Number(raw) : 0;
  } catch (e) {
    return 0;
  }
}

export async function saveBudget(budget) {
  try {
    await AsyncStorage.setItem(BUDGET_KEY, String(budget));
  } catch (e) {
    // Ignore write failures.
  }
}

export async function loadCategories() {
  try {
    const raw = await AsyncStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function saveCategories(categories) {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    // Ignore write failures.
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove([EXPENSES_KEY, BUDGET_KEY, CATEGORIES_KEY]);
  } catch (e) {
    // Ignore.
  }
}
