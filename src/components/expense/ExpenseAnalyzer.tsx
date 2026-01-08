import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Trash2, TrendingUp, AlertTriangle, Wallet, PiggyBank } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
}

const EXPENSE_CATEGORIES = [
  { name: 'Housing', color: '#8884d8', icon: '🏠' },
  { name: 'Food', color: '#82ca9d', icon: '🍔' },
  { name: 'Transportation', color: '#ffc658', icon: '🚗' },
  { name: 'Utilities', color: '#ff7300', icon: '💡' },
  { name: 'Healthcare', color: '#00C49F', icon: '🏥' },
  { name: 'Entertainment', color: '#FFBB28', icon: '🎬' },
  { name: 'Shopping', color: '#FF8042', icon: '🛍️' },
  { name: 'Education', color: '#0088FE', icon: '📚' },
  { name: 'EMI', color: '#8B0000', icon: '💳' },
  { name: 'Other', color: '#888888', icon: '📦' },
];

export const ExpenseAnalyzer = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Housing', amount: 25000, description: 'Rent' },
    { id: '2', category: 'Food', amount: 8000, description: 'Groceries & Dining' },
    { id: '3', category: 'Transportation', amount: 5000, description: 'Fuel & Metro' },
    { id: '4', category: 'EMI', amount: 15000, description: 'Car Loan EMI' },
  ]);
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description
      }
    ]);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const analysis = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savings = monthlyIncome - totalExpenses;
    const savingsRate = (savings / monthlyIncome) * 100;
    const debtToIncome = (expenses.find(e => e.category === 'EMI')?.amount || 0) / monthlyIncome * 100;

    // Category breakdown
    const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
      ...cat,
      value: expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0)
    })).filter(c => c.value > 0);

    // Recommendations
    const recommendations: string[] = [];
    if (savingsRate < 20) {
      recommendations.push('🚨 Your savings rate is below 20%. Aim to save at least 20% of income.');
    }
    if (debtToIncome > 40) {
      recommendations.push('⚠️ Your EMI-to-income ratio is high. Consider debt consolidation.');
    }
    const foodPercentage = (expenses.filter(e => e.category === 'Food').reduce((s, e) => s + e.amount, 0) / monthlyIncome) * 100;
    if (foodPercentage > 15) {
      recommendations.push('💡 Food expenses are high. Consider meal planning to reduce costs.');
    }
    if (savingsRate >= 30) {
      recommendations.push('🌟 Great savings rate! Consider investing surplus in mutual funds.');
    }

    // Loan eligibility estimate
    const maxEMI = monthlyIncome * 0.5 - (expenses.find(e => e.category === 'EMI')?.amount || 0);
    const maxLoanAmount = maxEMI * 60; // Rough estimate for 5-year loan

    return {
      totalExpenses,
      savings,
      savingsRate,
      debtToIncome,
      categoryTotals,
      recommendations,
      maxEMI: Math.max(0, maxEMI),
      maxLoanAmount: Math.max(0, maxLoanAmount)
    };
  }, [expenses, monthlyIncome]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Expense Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Income Input */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Monthly Income:</span>
          <Input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            className="w-40"
            placeholder="₹ Income"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-primary">₹{analysis.totalExpenses.toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${analysis.savings >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-xs text-muted-foreground">Savings</p>
            <p className={`text-lg font-bold ${analysis.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{analysis.savings.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="text-lg font-bold text-blue-600">{analysis.savingsRate.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Max New EMI</p>
            <p className="text-lg font-bold text-purple-600">₹{analysis.maxEMI.toLocaleString()}</p>
          </div>
        </div>

        {/* Pie Chart */}
        {analysis.categoryTotals.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analysis.categoryTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analysis.categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Expense */}
        <div className="flex flex-wrap gap-2">
          <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-28"
          />
          <Input
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="flex-1 min-w-32"
          />
          <Button onClick={addExpense} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Expense List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {expenses.map((expense) => {
            const cat = EXPENSE_CATEGORIES.find(c => c.name === expense.category);
            return (
              <div key={expense.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{cat?.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{expense.category}</p>
                    <p className="text-xs text-muted-foreground">{expense.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">₹{expense.amount.toLocaleString()}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            AI Recommendations
          </h4>
          {analysis.recommendations.map((rec, i) => (
            <p key={i} className="text-sm p-2 bg-muted/50 rounded-lg">{rec}</p>
          ))}
        </div>

        {/* Loan Eligibility */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Estimated Loan Eligibility
          </h4>
          <p className="text-2xl font-bold text-primary">
            Up to ₹{analysis.maxLoanAmount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Based on 50% income rule with existing EMIs</p>
        </div>
      </CardContent>
    </Card>
  );
};
