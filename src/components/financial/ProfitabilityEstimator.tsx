import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface CropPrice {
  name: string;
  currentPrice: number;
  unit: string;
}

export const ProfitabilityEstimator: React.FC = () => {
  const { t, ready } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [expectedYield, setExpectedYield] = useState('30');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const cropPrices: Record<string, CropPrice> = {
    wheat: { name: 'Wheat', currentPrice: 2150, unit: 'quintal' },
    rice: { name: 'Rice', currentPrice: 2850, unit: 'quintal' },
    corn: { name: 'Corn', currentPrice: 1950, unit: 'quintal' },
    cotton: { name: 'Cotton', currentPrice: 6200, unit: 'quintal' },
    sugarcane: { name: 'Sugarcane', currentPrice: 315, unit: 'quintal' },
    potato: { name: 'Potato', currentPrice: 1200, unit: 'quintal' },
    tomato: { name: 'Tomato', currentPrice: 1800, unit: 'quintal' },
    onion: { name: 'Onion', currentPrice: 2200, unit: 'quintal' }
  };

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('farm_expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      
      const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
      setTotalExpenses(total);
    }
  }, []);

  const calculateProfitability = () => {
    const crop = cropPrices[selectedCrop];
    const yield_quintals = parseFloat(expectedYield) || 0;
    const revenue = crop.currentPrice * yield_quintals;
    const profit = revenue - totalExpenses;
    const roi = totalExpenses > 0 ? ((profit / totalExpenses) * 100) : 0;
    const profitMargin = revenue > 0 ? ((profit / revenue) * 100) : 0;

    return {
      revenue,
      profit,
      roi,
      profitMargin,
      breakEvenYield: totalExpenses / crop.currentPrice
    };
  };

  const results = calculateProfitability();
  const isProfit = results.profit > 0;

  const getExpenseBreakdown = () => {
    const breakdown: Record<string, number> = {};
    expenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });
    return breakdown;
  };

  const expenseBreakdown = getExpenseBreakdown();
  const breakdownEntries = Object.entries(expenseBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Profitability Calculator</CardTitle>
          <CardDescription>
            Estimate your return on investment based on expenses and market prices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Crop</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(cropPrices).map(([key, crop]) => (
                    <SelectItem key={key} value={key}>
                      {crop.name} - ₹{crop.currentPrice}/{crop.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expected Yield (quintals)</Label>
              <Input
                type="number"
                value={expectedYield}
                onChange={(e) => setExpectedYield(e.target.value)}
                placeholder="30"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Market Price</AlertTitle>
            <AlertDescription className="text-blue-800">
              Current {cropPrices[selectedCrop].name} price: ₹{cropPrices[selectedCrop].currentPrice} per {cropPrices[selectedCrop].unit}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Expected Revenue</p>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">₹{results.revenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-md ${isProfit ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Net Profit/Loss</p>
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-white" />
              ) : (
                <TrendingDown className="w-4 h-4 text-white" />
              )}
            </div>
            <p className="text-2xl font-bold text-white">
              {isProfit ? '+' : ''}₹{results.profit.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">ROI</p>
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {results.roi.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Profitability Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your farming economics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ROI Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Return on Investment (ROI)</span>
              <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {results.roi.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(Math.abs(results.roi), 100)} 
              className={`h-3 ${isProfit ? '[&>div]:bg-green-600' : '[&>div]:bg-red-600'}`}
            />
            <p className="text-xs text-muted-foreground">
              {isProfit 
                ? `You'll earn ₹${results.roi.toFixed(1)} for every ₹100 invested`
                : `You'll lose ₹${Math.abs(results.roi).toFixed(1)} for every ₹100 invested`
              }
            </p>
          </div>

          {/* Profit Margin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Profit Margin</span>
              <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {results.profitMargin.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(Math.abs(results.profitMargin), 100)} 
              className={`h-3 ${isProfit ? '[&>div]:bg-green-600' : '[&>div]:bg-red-600'}`}
            />
          </div>

          {/* Break-even Analysis */}
          <Alert className={isProfit ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}>
            <AlertCircle className={`h-4 w-4 ${isProfit ? 'text-green-600' : 'text-orange-600'}`} />
            <AlertTitle className={isProfit ? 'text-green-900' : 'text-orange-900'}>
              Break-even Point
            </AlertTitle>
            <AlertDescription className={isProfit ? 'text-green-800' : 'text-orange-800'}>
              You need to produce at least <strong>{results.breakEvenYield.toFixed(1)} quintals</strong> to cover your expenses.
              {isProfit 
                ? ` You're currently ${(parseFloat(expectedYield) - results.breakEvenYield).toFixed(1)} quintals above break-even.`
                : ` You need ${(results.breakEvenYield - parseFloat(expectedYield)).toFixed(1)} more quintals to break even.`
              }
            </AlertDescription>
          </Alert>

          {/* Expense Breakdown */}
          {breakdownEntries.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Expense Breakdown</h4>
              {breakdownEntries.map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{category}</span>
                      <span className="font-semibold">₹{amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold text-sm">Recommendations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {!isProfit && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">⚠️</span>
                    <span>Consider reducing costs in high-expense categories or increasing yield through better practices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">💡</span>
                    <span>Explore government subsidies and support programs to reduce input costs.</span>
                  </li>
                </>
              )}
              {isProfit && results.roi < 20 && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">💡</span>
                  <span>Your ROI is positive but modest. Consider optimizing input costs or exploring higher-value crops.</span>
                </li>
              )}
              {isProfit && results.roi >= 20 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✅</span>
                  <span>Excellent ROI! Your farming operation is highly profitable. Consider scaling up production.</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">📊</span>
                <span>Track expenses regularly to identify cost-saving opportunities and improve profitability.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
