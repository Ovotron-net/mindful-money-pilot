
// Types
export type Category = 
  | 'food' 
  | 'transport' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'health' 
  | 'housing'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: Date;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
}

// Sample Data
export const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'health', name: 'Health', icon: '⚕️' },
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export const sampleExpenses: Expense[] = [
  {
    id: '1',
    amount: 25.50,
    category: 'food',
    description: 'Lunch at Cafe',
    date: new Date('2024-05-01'),
  },
  {
    id: '2',
    amount: 45.00,
    category: 'transport',
    description: 'Uber ride',
    date: new Date('2024-05-02'),
  },
  {
    id: '3',
    amount: 120.75,
    category: 'utilities',
    description: 'Electricity bill',
    date: new Date('2024-05-02'),
  },
  {
    id: '4',
    amount: 35.99,
    category: 'entertainment',
    description: 'Movie tickets',
    date: new Date('2024-05-03'),
  },
  {
    id: '5',
    amount: 89.99,
    category: 'shopping',
    description: 'New headphones',
    date: new Date('2024-04-28'),
  },
  {
    id: '6',
    amount: 65.00,
    category: 'health',
    description: 'Pharmacy',
    date: new Date('2024-04-29'),
  },
  {
    id: '7',
    amount: 1200.00,
    category: 'housing',
    description: 'Monthly rent',
    date: new Date('2024-05-01'),
  },
];

export const sampleBudgets: Budget[] = [
  { category: 'food', limit: 400, spent: 325.50 },
  { category: 'transport', limit: 200, spent: 145.00 },
  { category: 'utilities', limit: 300, spent: 250.75 },
  { category: 'entertainment', limit: 150, spent: 95.99 },
  { category: 'shopping', limit: 200, spent: 189.99 },
  { category: 'health', limit: 100, spent: 85.00 },
  { category: 'housing', limit: 1500, spent: 1200.00 },
  { category: 'other', limit: 100, spent: 45.25 },
];

export const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
  },
  {
    id: '2',
    title: 'Vacation',
    targetAmount: 2000,
    currentAmount: 750,
    deadline: new Date('2024-08-15'),
  },
  {
    id: '3',
    title: 'New Laptop',
    targetAmount: 1500,
    currentAmount: 500,
    deadline: new Date('2024-11-01'),
  },
];

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateProgress = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

export const getExpensesByCategory = (expenses: Expense[]): Record<Category, number> => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<Category, number>);
};
