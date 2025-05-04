
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Expense, categories, formatCurrency } from "@/lib/data";
import { useFinance } from "@/lib/finance-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Form schema
const expenseFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string({ required_error: "Please select a category" }),
  description: z.string().min(1, "Description is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
});

export default function Expenses() {
  const { expenses, addExpense } = useFinance();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  
  // Create form
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: undefined,
      category: "",
      description: "",
      date: new Date(),
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof expenseFormSchema>) => {
    addExpense({
      amount: data.amount,
      category: data.category as any,
      description: data.description,
      date: data.date,
    });
    form.reset();
    setOpen(false);
  };

  // Filter expenses
  const filteredExpenses = filter
    ? expenses.filter(
        (expense) =>
          expense.category === filter ||
          expense.description.toLowerCase().includes(filter.toLowerCase())
      )
    : expenses;

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="container p-4 lg:p-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of your expense.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
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

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe your expense" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Add Expense</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={filter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category.id)}
              className="flex items-center gap-1"
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] font-medium p-3 border-b">
              <div>Date</div>
              <div>Description</div>
              <div>Category</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="divide-y">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense: Expense) => (
                  <ExpenseRow key={expense.id} expense={expense} />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No expenses found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  const category = categories.find((c) => c.id === expense.category);

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr_1fr] p-3 hover:bg-muted/50">
      <div className="text-muted-foreground">
        {format(expense.date, "MMM d, yyyy")}
      </div>
      <div>{expense.description}</div>
      <div className="flex items-center gap-1">
        <span>{category?.icon}</span>
        <span>{category?.name}</span>
      </div>
      <div className="text-right font-medium">
        {formatCurrency(expense.amount)}
      </div>
    </div>
  );
}
