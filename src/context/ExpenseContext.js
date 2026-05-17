import React, { createContext, useContext, useEffect, useState } from 'react';
import * as storage from '../storage';
import { DEFAULT_CATEGORIES, FALLBACK_CATEGORY } from '../constants';

const ExpenseContext = createContext(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState(0);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loadedExpenses, loadedBudget, loadedCategories] = await Promise.all([
        storage.loadExpenses(),
        storage.loadBudget(),
        storage.loadCategories(),
      ]);
      if (!mounted) return;
      setExpenses(loadedExpenses);
      setBudgetState(loadedBudget);
      if (loadedCategories && loadedCategories.length) {
        setCategories(loadedCategories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
        storage.saveCategories(DEFAULT_CATEGORIES);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addExpense = (expense) => {
    const newExpense = {
      id: makeId(),
      amount: Number(expense.amount) || 0,
      category: expense.category,
      note: (expense.note || '').trim(),
      date: expense.date,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => {
      const next = [newExpense, ...prev];
      storage.saveExpenses(next);
      return next;
    });
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => {
      const next = prev.filter((x) => x.id !== id);
      storage.saveExpenses(next);
      return next;
    });
  };

  const setBudget = (value) => {
    const num = Number(value) || 0;
    setBudgetState(num);
    storage.saveBudget(num);
  };

  const addCategory = ({ label, icon, color }) => {
    setCategories((prev) => {
      const next = [...prev, { id: makeId(), label, icon, color }];
      storage.saveCategories(next);
      return next;
    });
  };

  const updateCategory = (id, patch) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
      storage.saveCategories(next);
      return next;
    });
  };

  const deleteCategory = (id) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      storage.saveCategories(next);
      return next;
    });
  };

  const getCategoryById = (id) =>
    categories.find((c) => c.id === id) || FALLBACK_CATEGORY;

  const clearData = () => {
    setExpenses([]);
    setBudgetState(0);
    setCategories(DEFAULT_CATEGORIES);
    storage.clearAll();
    storage.saveCategories(DEFAULT_CATEGORIES);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budget,
        categories,
        loading,
        addExpense,
        deleteExpense,
        setBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        clearData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within an ExpenseProvider');
  return ctx;
}
