import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { calculateCarbonCredits, exchangeCarbonCredits, getCarbonCredits } from '@/db/api';

export const CarbonShield: React.FC = () => {
  const [carbonData, setCarbonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);

  useEffect(() => {
    loadCarbonData();
  }, []);

  const loadCarbonData = async () => {
    setLoading(true);
    const calculated = await calculateCarbonCredits('mock-user-id');
    if (calculated) {
      setCarbonData(calculated);
    }
    setLoading(false);
  };

  const handleExchange = async () => {
    if (!carbonData || carbonData.credits_earned < 0.5) {
      return;
    }

    setExchanging(true);
    const result = await exchangeCarbonCredits('mock-user-id', carbonData.credits_earned);
    
    if (result) {
      // Reload data
      await loadCarbonData();
    }
    
    setExchanging(false);
  };

  if (loading || !carbonData) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Loading sustainability data...</p>
        </CardContent>
      </Card>
    );
  }

  const creditsValue = Math.round(carbonData.credits_earned * 100);

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Carbon Shield</CardTitle>
            <CardDescription className="text-xs">
              Earn rewards for sustainable farming
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sustainability Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Sustainability Score</span>
            <span className="text-2xl font-bold text-emerald-600">
              {carbonData.sustainability_score}
            </span>
          </div>
          <Progress value={carbonData.sustainability_score} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            Based on water efficiency and soil health
          </p>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">Water Efficiency</div>
            <div className="text-xl font-bold text-blue-600">
              {carbonData.water_efficiency_score}%
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">Soil Health</div>
            <div className="text-xl font-bold text-green-600">
              {carbonData.soil_health_score}%
            </div>
          </div>
        </div>

        {/* Carbon Credits */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-muted-foreground">Carbon Credits Earned</div>
              <div className="text-3xl font-bold text-emerald-600">
                {carbonData.credits_earned.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-muted-foreground">
              Exchange Value: <span className="font-bold text-foreground">₹{creditsValue}</span>
            </span>
          </div>

          <Button
            onClick={handleExchange}
            disabled={carbonData.credits_earned < 0.5 || exchanging}
            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            {exchanging ? (
              'Processing...'
            ) : (
              <>
                Exchange Credits
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          
          {carbonData.credits_earned < 0.5 && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Minimum 0.5 credits required to exchange
            </p>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <h5 className="text-xs font-semibold mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              How it works
            </Badge>
          </h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Maintain optimal soil moisture (40-60%)</li>
            <li>• Reduce water waste through efficient irrigation</li>
            <li>• Earn 1 credit per 10 sustainability points</li>
            <li>• Exchange rate: 1 credit = ₹100</li>
          </ul>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Last updated: {new Date(carbonData.last_calculated_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
