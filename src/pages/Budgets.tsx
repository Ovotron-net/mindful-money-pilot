
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget, categories, formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema
const budgetFormSchema = z.object({
  category: z.string({ required_error: "Please select a category" }),
  limit: z.coerce.number().positive("Budget must be positive"),
});

export default function Budgets() {
  const { budgets, updateBudget } = useFinance();
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [open, setOpen] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      limit: undefined,
    },
  });

  // Handle click to edit a budget
  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    form.setValue("category", budget.category);
    form.setValue("limit", budget.limit);
    setOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof budgetFormSchema>) => {
    updateBudget(data.category as any, data.limit);
    form.reset();
    setOpen(false);
    setSelectedBudget(null);
  };

  // Calculate total budget and total spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="container p-4 lg:p-8 max-w-7xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Budget Management</h1>

      {/* Overall Budget Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Budget Status</CardTitle>
          <CardDescription>
            Your total budget across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-sm font-medium">Total Budget</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(totalBudget)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-sm font-medium">Total Spent</div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(totalSpent)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="text-sm font-medium">Remaining</div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  totalRemaining < 0 ? "text-destructive" : ""
                }`}
              >
                {formatCurrency(totalRemaining)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Budget utilization</span>
              <span
                className={`text-sm ${
                  totalPercentage > 90 ? "text-destructive" : ""
                }`}
              >
                {totalPercentage}%
              </span>
            </div>
            <div className="budget-progress">
              <div
                className={`budget-progress-bar ${
                  totalPercentage > 90 ? "bg-destructive" : ""
                }`}
                style={{ width: `${totalPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>
            Manage your budget limits for each spending category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const category = categories.find((c) => c.id === budget.category);
              const percentage = Math.round((budget.spent / budget.limit) * 100);
              
              return (
                <div key={budget.category}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span>{category?.icon}</span>
                      <span className="font-medium">{category?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBudget(budget)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div>
                      <span className={budget.spent > budget.limit ? "text-destructive" : ""}>
                        {formatCurrency(budget.spent)}
                      </span>
                      {" of "}
                      <span>{formatCurrency(budget.limit)}</span>
                    </div>
                    <span className={percentage > 90 ? "text-destructive" : ""}>
                      {percentage}%
                    </span>
                  </div>
                  
                  <div className="budget-progress">
                    <div
                      className={`budget-progress-bar ${
                        percentage > 90 ? "bg-destructive" : ""
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Budget Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              {selectedBudget
                ? `Update the budget for ${
                    categories.find((c) => c.id === selectedBudget.category)
                      ?.name
                  }`
                : "Set a new budget limit"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!selectedBudget}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              {category.icon} {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save Budget</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
