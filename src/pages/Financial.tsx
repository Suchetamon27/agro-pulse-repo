import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MicroInsurance } from '@/components/financial/MicroInsurance';
import { ExpenseTracker } from '@/components/financial/ExpenseTracker';
import { ProfitabilityEstimator } from '@/components/financial/ProfitabilityEstimator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Shield, Receipt, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Financial: React.FC = () => {
  const { t, ready } = useTranslation();
  const [walletBalance, setWalletBalance] = useState(2450.0);

  const handleBalanceUpdate = (newBalance: number) => {
    setWalletBalance(newBalance);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {ready ? t('financial') : 'Financial Management'}
            </h1>
            <p className="text-muted-foreground">
              {ready ? t('financialDesc') : 'Manage insurance, expenses, and profitability'}
            </p>
          </div>
          <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-primary-foreground" />
                <div>
                  <p className="text-xs text-primary-foreground/80">
                    {ready ? t('walletBalance') : 'Wallet Balance'}
                  </p>
                  <p className="text-2xl font-bold text-primary-foreground">₹{walletBalance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="insurance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="insurance" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">
                {ready ? t('microInsurance') : 'Micro-Insurance'}
              </span>
              <span className="sm:hidden">Insurance</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">
                {ready ? t('expenseTracker') : 'Expense Tracker'}
              </span>
              <span className="sm:hidden">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="profitability" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">
                {ready ? t('profitability') : 'Profitability'}
              </span>
              <span className="sm:hidden">ROI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insurance" className="space-y-6">
            <MicroInsurance 
              walletBalance={walletBalance} 
              onBalanceUpdate={handleBalanceUpdate}
            />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6">
            <ProfitabilityEstimator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Financial;
