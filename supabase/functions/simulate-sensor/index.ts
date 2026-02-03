import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, farmLocationId } = await req.json();

    // Get farm location coordinates
    let latitude = 30.9010;
    let longitude = 75.8573;

    if (farmLocationId) {
      const { data: location } = await supabase
        .from('farm_locations')
        .select('latitude, longitude')
        .eq('id', farmLocationId)
        .single();
      
      if (location) {
        latitude = parseFloat(location.latitude.toString());
        longitude = parseFloat(location.longitude.toString());
      }
    }

    // Generate random sensor data
    const soilMoisture = Math.round((Math.random() * 80 + 10) * 100) / 100; // 10-90%
    const temperature = Math.round((Math.random() * 25 + 15) * 100) / 100; // 15-40°C
    const humidity = Math.round((Math.random() * 50 + 30) * 100) / 100; // 30-80%

    // Add small random offset to coordinates
    const latOffset = (Math.random() - 0.5) * 0.001;
    const lonOffset = (Math.random() - 0.5) * 0.001;

    // Insert sensor data
    const { data: sensorData, error: insertError } = await supabase
      .from('sensor_data')
      .insert({
        user_id: userId,
        timestamp: new Date().toISOString(),
        latitude: latitude + latOffset,
        longitude: longitude + lonOffset,
        soil_moisture: soilMoisture,
        temperature: temperature,
        humidity: humidity
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Check for critical conditions
    const isCritical = soilMoisture < 20;
    const alerts = [];

    if (isCritical) {
      alerts.push({
        type: 'critical_irrigation',
        message: 'Critical: Irrigation Required',
        severity: 'critical',
        details: `Soil moisture at ${soilMoisture}% is critically low. Immediate irrigation needed.`
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        sensor_data: sensorData,
        is_critical: isCritical,
        alerts: alerts
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in simulate-sensor function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
