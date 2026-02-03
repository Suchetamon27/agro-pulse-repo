import React, { useEffect, useState } from 'react';
import { ShieldAlert, Bug, Snowflake, Info, ArrowUpRight, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { analyzeGuardianData, getActiveAlerts, Alert as AlertType } from '@/db/api';

export const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await getActiveAlerts();
    setAlerts(data.slice(0, 3));
    setLoading(false);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    // Analyze Punjab region (30.9010, 75.8573) with 10km radius
    const result = await analyzeGuardianData(30.9010, 75.8573, 10);
    if (result) {
      await loadAlerts();
    }
    setAnalyzing(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'pest': return Bug;
      case 'frost': return Snowflake;
      case 'heat_wave': return AlertTriangle;
      case 'drought': return Info;
      default: return ShieldAlert;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="h-full border-none shadow-md bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-md bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            Yield Guardian AI
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runAnalysis}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run Analysis'
            )}
          </Button>
        </div>
        <CardDescription>
          Advanced risk assessment based on satellite and sensor data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active alerts. All systems normal.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.alert_type);
            return (
              <div key={alert.id} className={`p-4 rounded-xl border ${getAlertColor(alert.severity)} relative group cursor-pointer transition-all hover:translate-x-1`}>
                <div className="flex gap-4">
                  <div className="p-2 bg-white/50 rounded-lg shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm uppercase tracking-wide">{alert.title}</h4>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="bg-white/30">
                        {alert.affected_farms} farms affected
                      </Badge>
                      <Badge variant="secondary" className="bg-white/30">
                        {alert.area_radius}km radius
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="pt-4 border-t border-border mt-4">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1">Risk Summary</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-primary">85%</div>
              <div className="text-[10px] text-muted-foreground">CROP HEALTH</div>
            </div>
             <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-primary">{alerts.length}</div>
              <div className="text-[10px] text-muted-foreground">ACTIVE ALERTS</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
