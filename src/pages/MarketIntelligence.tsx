import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMarketIntelligence } from '@/db/api';

const MarketIntelligence: React.FC = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [weatherAnomaly, setWeatherAnomaly] = useState('Normal conditions');

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    const data = await getMarketIntelligence(weatherAnomaly);
    if (data) {
      setMarketData(data);
    }
    setLoading(false);
  };

  const simulateWeatherChange = async (anomaly: string) => {
    setWeatherAnomaly(anomaly);
    setLoading(true);
    const data = await getMarketIntelligence(anomaly);
    if (data) {
      setMarketData(data);
    }
    setLoading(false);
  };

  if (loading && !marketData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const formatChartData = (predictions: any[]) => {
    return predictions.map((p) => ({
      day: `Day ${p.day}`,
      price: p.price
    }));
  };

  const calculateTrend = (predictions: any[]) => {
    if (!predictions || predictions.length < 2) return 0;
    const first = predictions[0].price;
    const last = predictions[predictions.length - 1].price;
    return ((last - first) / first) * 100;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Market Intelligence</h1>
            <p className="text-muted-foreground">Real-time crop prices and 7-day predictions</p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {weatherAnomaly}
          </Badge>
        </div>

        {/* Weather Scenario Buttons */}
        <Card className="border-none shadow-md bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Weather Scenario Simulator
            </CardTitle>
            <CardDescription>
              See how weather anomalies affect crop prices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => simulateWeatherChange('Normal conditions')}
                variant={weatherAnomaly === 'Normal conditions' ? 'default' : 'outline'}
                size="sm"
              >
                Normal
              </Button>
              <Button
                onClick={() => simulateWeatherChange('Severe drought predicted')}
                variant={weatherAnomaly.includes('drought') ? 'default' : 'outline'}
                size="sm"
              >
                Drought
              </Button>
              <Button
                onClick={() => simulateWeatherChange('Heavy rainfall and flooding expected')}
                variant={weatherAnomaly.includes('flood') ? 'default' : 'outline'}
                size="sm"
              >
                Flood
              </Button>
              <Button
                onClick={() => simulateWeatherChange('Extreme heatwave incoming')}
                variant={weatherAnomaly.includes('heat') ? 'default' : 'outline'}
                size="sm"
              >
                Heatwave
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Prices */}
        {marketData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rice */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Rice (Basmati)</CardTitle>
                  <CardDescription>Per Quintal (100 kg)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{marketData.current_prices.rice}
                    </span>
                    {calculateTrend(marketData.predictions.rice) > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <Badge
                    variant={calculateTrend(marketData.predictions.rice) > 0 ? 'default' : 'secondary'}
                    className={calculateTrend(marketData.predictions.rice) > 0 ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {calculateTrend(marketData.predictions.rice) > 0 ? '+' : ''}
                    {calculateTrend(marketData.predictions.rice).toFixed(1)}% (7 days)
                  </Badge>
                </CardContent>
              </Card>

              {/* Wheat */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Wheat</CardTitle>
                  <CardDescription>Per Quintal (100 kg)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{marketData.current_prices.wheat}
                    </span>
                    {calculateTrend(marketData.predictions.wheat) > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <Badge
                    variant={calculateTrend(marketData.predictions.wheat) > 0 ? 'default' : 'secondary'}
                    className={calculateTrend(marketData.predictions.wheat) > 0 ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {calculateTrend(marketData.predictions.wheat) > 0 ? '+' : ''}
                    {calculateTrend(marketData.predictions.wheat).toFixed(1)}% (7 days)
                  </Badge>
                </CardContent>
              </Card>

              {/* Corn */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Corn (Maize)</CardTitle>
                  <CardDescription>Per Quintal (100 kg)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{marketData.current_prices.corn}
                    </span>
                    {calculateTrend(marketData.predictions.corn) > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <Badge
                    variant={calculateTrend(marketData.predictions.corn) > 0 ? 'default' : 'secondary'}
                    className={calculateTrend(marketData.predictions.corn) > 0 ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {calculateTrend(marketData.predictions.corn) > 0 ? '+' : ''}
                    {calculateTrend(marketData.predictions.corn).toFixed(1)}% (7 days)
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Price Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rice Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Rice - 7 Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={formatChartData(marketData.predictions.rice)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Wheat Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Wheat - 7 Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={formatChartData(marketData.predictions.wheat)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Corn Chart */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Corn - 7 Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={formatChartData(marketData.predictions.corn)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Market Insights */}
            <Card className="border-none shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {weatherAnomaly.includes('drought') && (
                    <p className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-orange-500">
                      <strong>Drought Impact:</strong> Water-intensive crops like Rice and Corn show rising price trends due to reduced supply expectations.
                    </p>
                  )}
                  {weatherAnomaly.includes('flood') && (
                    <p className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
                      <strong>Flood Impact:</strong> Excess rainfall can damage standing crops, leading to supply concerns and price increases.
                    </p>
                  )}
                  {weatherAnomaly.includes('heat') && (
                    <p className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-red-500">
                      <strong>Heatwave Impact:</strong> Extreme temperatures stress crops, particularly affecting yield quality and market prices.
                    </p>
                  )}
                  {weatherAnomaly === 'Normal conditions' && (
                    <p className="p-3 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
                      <strong>Stable Market:</strong> Normal weather conditions support steady crop growth and stable price trends.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default MarketIntelligence;
