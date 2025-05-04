
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense, formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";
import { format } from "date-fns";

export function RecentExpenses() {
  const { expenses } = useFinance();
  
  // Get only the 5 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full bg-expense-${expense.category} flex items-center justify-center text-white`}>
          {expense.category.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-xs text-muted-foreground">
            {format(expense.date, "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <p className="font-medium">{formatCurrency(expense.amount)}</p>
    </div>
  );
}
