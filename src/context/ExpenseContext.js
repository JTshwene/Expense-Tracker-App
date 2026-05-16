import React, { createContext, useContext, useEffect, useState } from 'react';
import * as storage from '../storage';

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loadedExpenses, loadedBudget] = await Promise.all([
        storage.loadExpenses(),
        storage.loadBudget(),
      ]);
      if (!mounted) return;
      setExpenses(loadedExpenses);
      setBudgetState(loadedBudget);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addExpense = (expense) => {
    const newExpense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

  const clearData = () => {
    setExpenses([]);
    setBudgetState(0);
    storage.clearAll();
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, budget, loading, addExpense, deleteExpense, setBudget, clearData }}
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
