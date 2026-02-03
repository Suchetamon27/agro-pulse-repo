import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { latitude, longitude, radius = 10 } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get recent sensor data within the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: sensorData, error: sensorError } = await supabase
      .from('sensor_data')
      .select('*, users!inner(name, farm_location_id, farm_locations!inner(name, state))')
      .gte('timestamp', twoHoursAgo)
      .order('timestamp', { ascending: false });

    if (sensorError) {
      throw sensorError;
    }

    // Filter by distance and group by farm
    const farmDataMap = new Map();
    
    for (const reading of sensorData || []) {
      const { data: distanceData } = await supabase.rpc('calculate_distance', {
        lat1: latitude,
        lon1: longitude,
        lat2: reading.latitude,
        lon2: reading.longitude
      });

      const distance = distanceData || 0;
      
      if (distance <= radius) {
        const farmKey = reading.user_id;
        if (!farmDataMap.has(farmKey)) {
          farmDataMap.set(farmKey, []);
        }
        farmDataMap.get(farmKey).push({
          ...reading,
          distance
        });
      }
    }

    // Analyze for anomalies
    const anomalies = [];
    const alerts = [];

    // Temperature drop detection (Frost Alert)
    let coldFarms = 0;
    const tempThreshold = 15; // Below 15°C is considered cold for Indian crops
    
    for (const [farmId, readings] of farmDataMap.entries()) {
      const latestReading = readings[0];
      if (latestReading.temperature < tempThreshold) {
        coldFarms++;
      }
    }

    if (coldFarms >= 3) {
      alerts.push({
        type: 'frost',
        severity: 'high',
        title: 'Cold Temperature Alert',
        description: `${coldFarms} farms reporting temperatures below ${tempThreshold}°C. Crop protection measures recommended.`,
        affected_farms: coldFarms
      });
    }

    // Heat wave detection
    let hotFarms = 0;
    const heatThreshold = 40; // Above 40°C is heat wave
    
    for (const [farmId, readings] of farmDataMap.entries()) {
      const latestReading = readings[0];
      if (latestReading.temperature > heatThreshold) {
        hotFarms++;
      }
    }

    if (hotFarms >= 3) {
      alerts.push({
        type: 'heat_wave',
        severity: 'high',
        title: 'Heat Wave Warning',
        description: `${hotFarms} farms reporting temperatures above ${heatThreshold}°C. Increase irrigation and provide shade.`,
        affected_farms: hotFarms
      });
    }

    // Low soil moisture detection (Drought)
    let dryFarms = 0;
    const moistureThreshold = 35; // Below 35% is too dry
    
    for (const [farmId, readings] of farmDataMap.entries()) {
      const latestReading = readings[0];
      if (latestReading.soil_moisture < moistureThreshold) {
        dryFarms++;
      }
    }

    if (dryFarms >= 3) {
      alerts.push({
        type: 'drought',
        severity: 'medium',
        title: 'Low Soil Moisture Alert',
        description: `${dryFarms} farms reporting soil moisture below ${moistureThreshold}%. Irrigation required.`,
        affected_farms: dryFarms
      });
    }

    // Insert new alerts into database
    if (alerts.length > 0) {
      for (const alert of alerts) {
        await supabase.from('alerts').insert({
          alert_type: alert.type,
          severity: alert.severity,
          latitude,
          longitude,
          area_radius: radius,
          title: alert.title,
          description: alert.description,
          affected_farms: alert.affected_farms,
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    // Get active alerts for the area
    const { data: activeAlerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          farms_monitored: farmDataMap.size,
          radius_km: radius,
          center: { latitude, longitude }
        },
        new_alerts: alerts,
        active_alerts: activeAlerts || [],
        sensor_summary: {
          cold_farms: coldFarms,
          hot_farms: hotFarms,
          dry_farms: dryFarms
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in guardian function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
