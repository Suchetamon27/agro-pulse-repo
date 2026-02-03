import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAIGuidance } from '@/db/api';

interface AIAdvisorProps {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  cropType?: string;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  soilMoisture,
  temperature,
  humidity,
  cropType = 'Wheat'
}) => {
  const [guidance, setGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchGuidance = async () => {
    setLoading(true);
    setError('');
    
    // Determine weather forecast based on temperature
    let weatherForecast = 'Normal conditions';
    if (temperature > 38) {
      weatherForecast = 'Heatwave incoming';
    } else if (temperature < 18) {
      weatherForecast = 'Cool weather expected';
    } else if (humidity > 80) {
      weatherForecast = 'High humidity, possible rain';
    }

    const result = await getAIGuidance(
      soilMoisture,
      temperature,
      humidity,
      cropType,
      weatherForecast
    );

    if (result && result.success) {
      setGuidance(result.guidance);
    } else {
      setError('Unable to fetch AI guidance. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-accent/10 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent rounded-lg">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">AI Advisor</CardTitle>
              <CardDescription className="text-xs">
                Powered by Gemini 2.5 Flash
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchGuidance}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                Get Guidance
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!guidance && !loading && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Click "Get Guidance" to receive AI-powered recommendations</p>
            <p className="text-xs mt-2">Based on your current soil and weather conditions</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-accent mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing your farm data...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take up to 30 seconds</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {guidance && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                Crop: {cropType}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {temperature}°C
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {soilMoisture}% Moisture
              </Badge>
            </div>
            
            <div className="bg-card rounded-lg p-4 border-l-4 border-accent">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2 text-primary">Recommended Actions:</h4>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {guidance}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>AI-generated guidance</span>
              <span>Updated just now</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
