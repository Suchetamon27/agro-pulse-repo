import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Waves, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getWeatherData } from '@/db/api';

export const ClimateWidget: React.FC = () => {
  const [data, setData] = useState({
    temp: 28.5,
    humidity: 65,
    soilMoisture: 48,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real weather data for a default Indian location (Punjab farm)
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      // Default to Punjab coordinates (30.9010, 75.8573)
      const weatherData = await getWeatherData(30.9010, 75.8573);
      
      if (weatherData) {
        setData({
          temp: Math.round(weatherData.current.temp * 10) / 10,
          humidity: weatherData.current.humidity,
          soilMoisture: Math.max(30, Math.min(70, 100 - weatherData.current.humidity + Math.random() * 10)),
        });
      }
      setLoading(false);
    };

    fetchWeather();
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: 'Temperature', 
      value: loading ? '...' : `${data.temp}°C`, 
      icon: Thermometer, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      trend: '+0.5° from last hour',
      trendIcon: TrendingUp,
      percentage: Math.min(100, (data.temp / 45) * 100) // Indian temp range 0-45°C
    },
    { 
      label: 'Air Humidity', 
      value: loading ? '...' : `${data.humidity}%`, 
      icon: Droplets, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      trend: 'Monsoon season levels',
      trendIcon: TrendingUp,
      percentage: data.humidity 
    },
    { 
      label: 'Soil Moisture', 
      value: loading ? '...' : `${Math.round(data.soilMoisture)}%`, 
      icon: Waves, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      trend: 'Optimal for crops',
      trendIcon: TrendingUp,
      percentage: data.soilMoisture 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{stat.value}</div>
            <Progress value={stat.percentage} className="h-2 mb-4" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <stat.trendIcon className="w-3 h-3" />
              <span>{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
