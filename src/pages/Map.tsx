import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Droplets, Thermometer, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FieldSector {
  id: string;
  name: string;
  ndvi: number; // 0-1 scale (0=poor, 1=excellent)
  moisture: number; // percentage
  temperature: number;
  x: number; // position percentage
  y: number; // position percentage
  width: number;
  height: number;
}

const Map: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<FieldSector | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Simulated field sectors with NDVI values
  const fieldSectors: FieldSector[] = [
    { id: 'A1', name: 'North Field A1', ndvi: 0.85, moisture: 62, temperature: 26, x: 10, y: 10, width: 35, height: 35 },
    { id: 'A2', name: 'North Field A2', ndvi: 0.78, moisture: 58, temperature: 27, x: 50, y: 10, width: 35, height: 35 },
    { id: 'B1', name: 'Central Field B1', ndvi: 0.92, moisture: 68, temperature: 25, x: 10, y: 50, width: 35, height: 35 },
    { id: 'B2', name: 'Central Field B2', ndvi: 0.65, moisture: 45, temperature: 29, x: 50, y: 50, width: 35, height: 35 },
  ];

  const getNDVIColor = (ndvi: number): string => {
    if (ndvi >= 0.8) return 'rgb(34, 139, 34)'; // Dark green - excellent
    if (ndvi >= 0.7) return 'rgb(50, 205, 50)'; // Lime green - good
    if (ndvi >= 0.6) return 'rgb(154, 205, 50)'; // Yellow green - moderate
    if (ndvi >= 0.5) return 'rgb(255, 215, 0)'; // Gold - fair
    return 'rgb(255, 165, 0)'; // Orange - poor
  };

  const getNDVIStatus = (ndvi: number): string => {
    if (ndvi >= 0.8) return 'Excellent';
    if (ndvi >= 0.7) return 'Good';
    if (ndvi >= 0.6) return 'Moderate';
    if (ndvi >= 0.5) return 'Fair';
    return 'Poor';
  };

  const getMoistureStatus = (moisture: number): string => {
    if (moisture >= 60) return 'Optimal';
    if (moisture >= 45) return 'Adequate';
    if (moisture >= 30) return 'Low';
    return 'Critical';
  };

  const handleSectorClick = (sector: FieldSector) => {
    setSelectedSector(sector);
    setDialogOpen(true);
  };

  const averageNDVI = fieldSectors.reduce((sum, s) => sum + s.ndvi, 0) / fieldSectors.length;
  const averageMoisture = fieldSectors.reduce((sum, s) => sum + s.moisture, 0) / fieldSectors.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Field Map</h1>
          <p className="text-muted-foreground">NDVI satellite view and crop health monitoring</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Average NDVI</p>
                  <p className="text-2xl font-bold">{averageNDVI.toFixed(2)}</p>
                  <Badge className="mt-1 bg-green-600 text-white">
                    {getNDVIStatus(averageNDVI)}
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: getNDVIColor(averageNDVI) }}>
                  <span className="text-white text-xl">🌾</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Average Moisture</p>
                  <p className="text-2xl font-bold">{averageMoisture.toFixed(0)}%</p>
                  <Badge variant="outline" className="mt-1">
                    {getMoistureStatus(averageMoisture)}
                  </Badge>
                </div>
                <Droplets className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Area</p>
                  <p className="text-2xl font-bold">4 Sectors</p>
                  <Badge variant="outline" className="mt-1">
                    10 Acres
                  </Badge>
                </div>
                <MapPin className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NDVI Legend */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">NDVI Health Index</CardTitle>
            <CardDescription>Normalized Difference Vegetation Index - Click on sectors for details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(34, 139, 34)' }} />
                <span>Excellent (0.8-1.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(50, 205, 50)' }} />
                <span>Good (0.7-0.8)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(154, 205, 50)' }} />
                <span>Moderate (0.6-0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(255, 215, 0)' }} />
                <span>Fair (0.5-0.6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgb(255, 165, 0)' }} />
                <span>Poor (&lt;0.5)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Satellite Map View */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Satellite Field View</CardTitle>
            <CardDescription>Interactive NDVI heatmap - Click sectors for moisture data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-square max-w-3xl mx-auto bg-gradient-to-br from-green-900/20 to-green-700/20 rounded-lg border-2 border-border overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px)'
              }} />

              {/* Field Sectors */}
              {fieldSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => handleSectorClick(sector)}
                  className="absolute transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-white/30 rounded-lg cursor-pointer group"
                  style={{
                    left: `${sector.x}%`,
                    top: `${sector.y}%`,
                    width: `${sector.width}%`,
                    height: `${sector.height}%`,
                    backgroundColor: getNDVIColor(sector.ndvi),
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                    <span className="font-bold text-lg md:text-2xl drop-shadow-lg">{sector.id}</span>
                    <span className="text-xs md:text-sm font-semibold drop-shadow-lg">NDVI: {sector.ndvi.toFixed(2)}</span>
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  </div>
                  
                  {/* Hotspot indicator */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
                </button>
              ))}

              {/* Compass */}
              <div className="absolute top-4 left-4 bg-white/90 rounded-full p-3 shadow-lg">
                <div className="text-xs font-bold text-center">N</div>
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-6 bg-red-600 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Scale */}
              <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-black" />
                  <span className="font-semibold">100m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {selectedSector?.name}
              </DialogTitle>
              <DialogDescription>Sector {selectedSector?.id} - Detailed Analysis</DialogDescription>
            </DialogHeader>
            
            {selectedSector && (
              <div className="space-y-4 py-4">
                {/* NDVI Status */}
                <div className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: `${getNDVIColor(selectedSector.ndvi)}20` }}>
                  <div>
                    <p className="text-sm text-muted-foreground">NDVI Index</p>
                    <p className="text-2xl font-bold">{selectedSector.ndvi.toFixed(2)}</p>
                  </div>
                  <Badge className="text-white" style={{ backgroundColor: getNDVIColor(selectedSector.ndvi) }}>
                    {getNDVIStatus(selectedSector.ndvi)}
                  </Badge>
                </div>

                {/* Moisture Level */}
                <div className="flex items-center justify-between p-4 rounded-lg border bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Soil Moisture</p>
                      <p className="text-2xl font-bold">{selectedSector.moisture}%</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {getMoistureStatus(selectedSector.moisture)}
                  </Badge>
                </div>

                {/* Temperature */}
                <div className="flex items-center justify-between p-4 rounded-lg border bg-orange-50">
                  <div className="flex items-center gap-3">
                    <Thermometer className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold">{selectedSector.temperature}°C</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    Normal
                  </Badge>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-lg border bg-accent/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Recommendations
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {selectedSector.ndvi < 0.7 && (
                      <li>• Consider applying nitrogen-rich fertilizer to improve crop health</li>
                    )}
                    {selectedSector.moisture < 50 && (
                      <li>• Increase irrigation frequency - soil moisture is below optimal</li>
                    )}
                    {selectedSector.ndvi >= 0.8 && selectedSector.moisture >= 60 && (
                      <li>• Excellent conditions - maintain current practices</li>
                    )}
                    <li>• Monitor for pest activity in this sector</li>
                  </ul>
                </div>

                <Button onClick={() => setDialogOpen(false)} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Map;
