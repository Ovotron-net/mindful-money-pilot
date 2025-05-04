
import React, { createContext, useContext, useState } from 'react';
import { 
  Expense, 
  Budget, 
  Goal, 
  sampleExpenses, 
  sampleBudgets, 
  sampleGoals,
  Category 
} from './data';

interface FinanceContextType {
  expenses: Expense[];
  budgets: Budget[];
  goals: Goal[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateBudget: (category: Category, limit: number) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, amount: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    };
    setExpenses([newExpense, ...expenses]);
    
    // Update the corresponding budget
    setBudgets(
      budgets.map((budget) =>
        budget.category === expense.category
          ? { ...budget, spent: budget.spent + expense.amount }
          : budget
      )
    );
  };

  const updateBudget = (category: Category, limit: number) => {
    setBudgets(
      budgets.map((budget) =>
        budget.category === category
          ? { ...budget, limit }
          : budget
      )
    );
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        budgets,
        goals,
        addExpense,
        updateBudget,
        addGoal,
        updateGoal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
