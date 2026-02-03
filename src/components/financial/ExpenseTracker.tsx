import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  category: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'irrigation' | 'pesticide' | 'other';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export const ExpenseTracker: React.FC = () => {
  const { t, ready } = useTranslation();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<string>('seeds');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('farm_expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    localStorage.setItem('farm_expenses', JSON.stringify(updatedExpenses));
  };

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid expense amount.',
        variant: 'destructive',
      });
      return;
    }

    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      category: category as any,
      amount: parseFloat(amount),
      description: description || `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
      date: date,
      createdAt: new Date().toISOString()
    };

    const updatedExpenses = [newExpense, ...expenses];
    saveExpenses(updatedExpenses);

    toast({
      title: 'Expense Added',
      description: `₹${amount} logged for ${category}`,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setDialogOpen(false);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    saveExpenses(updatedExpenses);
    
    toast({
      title: 'Expense Deleted',
      description: 'Expense record removed successfully.',
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      seeds: '🌱',
      fertilizer: '🧪',
      labor: '👷',
      equipment: '🚜',
      irrigation: '💧',
      pesticide: '🛡️',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      seeds: 'bg-green-100 text-green-800 border-green-200',
      fertilizer: 'bg-purple-100 text-purple-800 border-purple-200',
      labor: 'bg-blue-100 text-blue-800 border-blue-200',
      equipment: 'bg-orange-100 text-orange-800 border-orange-200',
      irrigation: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      pesticide: 'bg-red-100 text-red-800 border-red-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.other;
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  const categoryTotals = getExpensesByCategory();
  const totalExpenses = getTotalExpenses();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-foreground/80">Total Expenses</p>
                <p className="text-2xl font-bold text-primary-foreground">₹{totalExpenses.toFixed(2)}</p>
              </div>
              <Receipt className="w-8 h-8 text-primary-foreground/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Seeds</p>
                <p className="text-2xl font-bold">₹{(categoryTotals.seeds || 0).toFixed(2)}</p>
              </div>
              <span className="text-3xl">🌱</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Fertilizer</p>
                <p className="text-2xl font-bold">₹{(categoryTotals.fertilizer || 0).toFixed(2)}</p>
              </div>
              <span className="text-3xl">🧪</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Labor</p>
                <p className="text-2xl font-bold">₹{(categoryTotals.labor || 0).toFixed(2)}</p>
              </div>
              <span className="text-3xl">👷</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Expense</DialogTitle>
            <DialogDescription>
              Track your farming costs for better financial planning
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeds">🌱 Seeds</SelectItem>
                  <SelectItem value="fertilizer">🧪 Fertilizer</SelectItem>
                  <SelectItem value="labor">👷 Labor</SelectItem>
                  <SelectItem value="equipment">🚜 Equipment</SelectItem>
                  <SelectItem value="irrigation">💧 Irrigation</SelectItem>
                  <SelectItem value="pesticide">🛡️ Pesticide</SelectItem>
                  <SelectItem value="other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Wheat seeds for 2 acres"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={addExpense} className="flex-1 bg-primary hover:bg-primary/90">
              Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense List */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>
            All your farming expenses in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">No Expenses Logged</p>
              <p className="text-sm text-muted-foreground">Start tracking your farming costs</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl">{getCategoryIcon(expense.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{expense.description}</p>
                        <Badge variant="outline" className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-primary">₹{expense.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
