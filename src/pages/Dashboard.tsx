
import { LineChart, Wallet, TrendingUp, PiggyBank } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { calculateTotalExpenses, formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";

export default function Dashboard() {
  const { expenses, budgets, goals } = useFinance();
  
  const totalExpenses = calculateTotalExpenses(expenses);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const budgetRemaining = totalBudget - totalExpenses;
  
  // Calculate total goals progress
  const totalGoalTargets = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalPercentage = Math.round((totalGoalProgress / totalGoalTargets) * 100);
  
  return (
    <div className="container p-4 lg:p-8 max-w-7xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(totalExpenses)} 
          icon={<Wallet className="h-5 w-5" />} 
          subtitle="This month"
        />
        <StatCard 
          title="Budget Remaining" 
          value={formatCurrency(budgetRemaining)} 
          icon={<TrendingUp className="h-5 w-5" />}
          className={budgetRemaining < 0 ? "border-destructive" : ""}
        />
        <StatCard 
          title="Budget Utilization" 
          value={`${Math.min(Math.round((totalExpenses / totalBudget) * 100), 100)}%`} 
          icon={<LineChart className="h-5 w-5" />}
        />
        <StatCard 
          title="Goals Progress" 
          value={`${goalPercentage}%`} 
          icon={<PiggyBank className="h-5 w-5" />} 
          subtitle={`${formatCurrency(totalGoalProgress)} of ${formatCurrency(totalGoalTargets)}`}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SpendingChart />
        <div className="lg:col-span-1 space-y-6">
          <RecentExpenses />
          <GoalTracker />
        </div>
      </div>
      
      {/* Budget Overview */}
      <div className="mt-6">
        <BudgetOverview />
      </div>
    </div>
  );
}
