import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/db/supabase';
import { Loader2, MapPin } from 'lucide-react';

interface SensorReading {
  id: string;
  latitude: number;
  longitude: number;
  soil_moisture: number;
  temperature: number;
  timestamp: string;
}

export const SoilHealthMap: React.FC = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSensorData();
  }, []);

  const loadSensorData = async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('sensor_data')
      .select('id, latitude, longitude, soil_moisture, temperature, timestamp')
      .gte('timestamp', oneHourAgo)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (!error && data) {
      // Group by location and get latest reading
      const locationMap = new Map();
      data.forEach((reading: any) => {
        const key = `${reading.latitude.toFixed(4)},${reading.longitude.toFixed(4)}`;
        if (!locationMap.has(key)) {
          locationMap.set(key, reading);
        }
      });
      
      setSensorReadings(Array.from(locationMap.values()));
    }
    setLoading(false);
  };

  const getColorForMoisture = (moisture: number) => {
    if (moisture < 20) return 'bg-red-500';
    if (moisture < 35) return 'bg-orange-500';
    if (moisture < 50) return 'bg-yellow-500';
    if (moisture < 70) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusText = (moisture: number) => {
    if (moisture < 20) return 'Critical';
    if (moisture < 35) return 'Low';
    if (moisture < 50) return 'Medium';
    if (moisture < 70) return 'Good';
    return 'Excellent';
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Soil Health Monitor - Local Village</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {sensorReadings.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sensor data available in the last hour</p>
                  <p className="text-sm">Click "Simulate Sensor" to generate data</p>
                </div>
              ) : (
                sensorReadings.map((reading) => (
                  <Card key={reading.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getColorForMoisture(reading.soil_moisture)}`} />
                          <span className="font-semibold text-sm">{getStatusText(reading.soil_moisture)}</span>
                        </div>
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Soil Moisture:</span>
                          <span className="font-bold">{reading.soil_moisture.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="font-bold">{reading.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{reading.latitude.toFixed(4)}, {reading.longitude.toFixed(4)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          {new Date(reading.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span>Critical (&lt;20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span>Low (20-35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span>Medium (35-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Good (50-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span>Excellent (&gt;70%)</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
