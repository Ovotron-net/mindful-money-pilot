
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, categories, getExpensesByCategory } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function SpendingChart() {
  const { expenses } = useFinance();
  const expensesByCategory = getExpensesByCategory(expenses);
  
  const chartData = categories.map((category) => ({
    name: category.name,
    value: expensesByCategory[category.id] || 0,
    color: `bg-expense-${category.id}`,
    id: category.id,
  })).filter(item => item.value > 0);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.id}`} 
                    fill={`var(--expense-${entry.id})`} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {chartData.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full`}
                style={{ backgroundColor: `var(--expense-${entry.id})` }}
              ></div>
              <span className="text-xs">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
