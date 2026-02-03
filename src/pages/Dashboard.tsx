import React, { useState, useEffect } from 'react';
import { ClimateWidget } from '@/components/dashboard/ClimateWidget';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { AIAdvisor } from '@/components/dashboard/AIAdvisor';
import { PlantDoctor } from '@/components/dashboard/PlantDoctor';
import { CarbonShield } from '@/components/dashboard/CarbonShield';
import { SoilHealthMap } from '@/components/dashboard/SoilHealthMap';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrendingUp, Sprout, CloudRain, Sun, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getWeatherData, simulateSensor } from '@/db/api';

const Dashboard: React.FC = () => {
  const [climateData, setClimateData] = useState({
    temp: 28.5,
    humidity: 65,
    soilMoisture: 48,
  });
  const [isCritical, setIsCritical] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // Fetch initial weather data
    const fetchInitialData = async () => {
      const weatherData = await getWeatherData(30.9010, 75.8573);
      if (weatherData) {
        setClimateData({
          temp: Math.round(weatherData.current.temp * 10) / 10,
          humidity: weatherData.current.humidity,
          soilMoisture: Math.max(30, Math.min(70, 100 - weatherData.current.humidity + Math.random() * 10)),
        });
      }
    };
    fetchInitialData();
  }, []);

  const handleSimulateSensor = async () => {
    setSimulating(true);
    const result = await simulateSensor('mock-user-id');
    
    if (result && result.success) {
      setClimateData({
        temp: result.sensor_data.temperature,
        humidity: result.sensor_data.humidity,
        soilMoisture: result.sensor_data.soil_moisture,
      });
      setIsCritical(result.is_critical);
      
      // Auto-hide critical alert after 10 seconds
      if (result.is_critical) {
        setTimeout(() => setIsCritical(false), 10000);
      }
    }
    
    setSimulating(false);
  };

  return (
    <AppLayout>
      <div className={`space-y-8 transition-colors duration-500 ${isCritical ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}>
        {/* Critical Alert Banner */}
        {isCritical && (
          <Alert variant="destructive" className="border-2 border-red-500 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Critical: Irrigation Required</AlertTitle>
            <AlertDescription className="text-base">
              Soil moisture at {climateData.soilMoisture.toFixed(1)}% is critically low. Immediate irrigation needed to prevent crop damage.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-accent text-accent-foreground mb-4">
              {isCritical ? 'Farm Status: Critical' : 'Farm Status: Optimal'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AgroPulse Dashboard</h1>
            <p className="text-lg opacity-80 mb-8">Welcome back, Farmer Singh. {isCritical ? 'Immediate action required for irrigation.' : 'All systems are performing within normal parameters. Your wheat yield projection is up 12% this season.'}</p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Sprout className="w-5 h-5 text-accent" />
                  <span className="font-semibold">{isCritical ? 'Needs Attention' : 'Healthy Crops'}</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold">Optimal Sunlight</span>
               </div>
               <Button
                 onClick={handleSimulateSensor}
                 disabled={simulating}
                 className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
               >
                 <Activity className="w-4 h-4" />
                 {simulating ? 'Simulating...' : 'Simulate Sensor'}
               </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full md:w-1/2 opacity-30 md:opacity-60 pointer-events-none">
            <img 
              src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_22b87e76-43da-4e09-a423-059b22a636e2.jpg" 
              alt="Aerial view of green fields" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          </div>
        </div>

        {/* Climate Widget */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-primary" />
              Real-Time Micro-Climate - Punjab Region
            </h2>
          </div>
          <ClimateWidget />
        </section>

        {/* Soil Health Map */}
        <section>
          <SoilHealthMap />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Advisor - Full Width on Top */}
          <div className="lg:col-span-2">
            <AIAdvisor
              soilMoisture={climateData.soilMoisture}
              temperature={climateData.temp}
              humidity={climateData.humidity}
              cropType="Wheat"
            />
          </div>

          {/* Carbon Shield */}
          <div>
            <CarbonShield />
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-2">
             <AlertPanel />
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-md bg-accent text-accent-foreground">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Yield Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">124 Quintals</div>
                <p className="text-sm opacity-80 mb-4">Projected wheat harvest for this season</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                    +12% from last season
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card overflow-hidden">
               <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sun className="w-4 h-4 text-orange-400" />
                  Sun Exposure
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold mb-2">9.2 hrs</div>
                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-3/4" />
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plant Doctor Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Plant Health Diagnostics</h2>
          <PlantDoctor />
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
