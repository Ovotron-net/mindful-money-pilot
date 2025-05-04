
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";
import { format } from "date-fns";

export function GoalTracker() {
  const { goals } = useFinance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-sm">{progress}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                  {goal.deadline && (
                    <span className="text-muted-foreground">
                      Due {format(goal.deadline, "MMM d, yyyy")}
                    </span>
                  )}
                </div>
                <div className="budget-progress">
                  <div
                    className="budget-progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
