
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget, Category, categories, formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";

export function BudgetOverview() {
  const { budgets } = useFinance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => (
            <BudgetItem key={budget.category} budget={budget} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetItem({ budget }: { budget: Budget }) {
  const category = categories.find(c => c.id === budget.category);
  const percentage = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
  const isOverBudget = budget.spent > budget.limit;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{category?.icon}</span>
          <span className="font-medium">{category?.name}</span>
        </div>
        <div className="text-sm">
          <span className={isOverBudget ? "text-destructive font-medium" : ""}>
            {formatCurrency(budget.spent)}
          </span>
          {" / "}
          <span>{formatCurrency(budget.limit)}</span>
        </div>
      </div>
      <div className="budget-progress">
        <div 
          className={`budget-progress-bar ${isOverBudget ? "bg-destructive" : ""}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
