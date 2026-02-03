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

    const url = new URL(req.url);
    const dataType = url.searchParams.get('type') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Get available data streams from farmers
    const { data: farmers, error: farmersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        wallet_balance,
        farm_locations!inner(
          id,
          name,
          state,
          district,
          latitude,
          longitude
        )
      `)
      .eq('role', 'farmer')
      .limit(limit);

    if (farmersError) {
      throw farmersError;
    }

    // Get recent sensor data for each farmer
    const dataStreams = [];
    
    for (const farmer of farmers || []) {
      const { data: recentData, error: dataError } = await supabase
        .from('sensor_data')
        .select('*')
        .eq('user_id', farmer.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (!dataError && recentData && recentData.length > 0) {
        const latest = recentData[0];
        const dataAge = Date.now() - new Date(latest.timestamp).getTime();
        const hoursAgo = Math.floor(dataAge / (1000 * 60 * 60));

        dataStreams.push({
          farmer_id: farmer.id,
          farmer_name: farmer.name,
          farm_name: farmer.farm_locations.name,
          location: {
            state: farmer.farm_locations.state,
            district: farmer.farm_locations.district,
            latitude: farmer.farm_locations.latitude,
            longitude: farmer.farm_locations.longitude
          },
          available_data: {
            soil_health: true,
            temperature: true,
            humidity: true,
            irrigation: true
          },
          latest_reading: {
            temperature: latest.temperature,
            soil_moisture: latest.soil_moisture,
            humidity: latest.humidity,
            timestamp: latest.timestamp
          },
          data_freshness: hoursAgo < 1 ? 'real-time' : hoursAgo < 6 ? 'recent' : 'stale',
          price_per_request: Math.floor(Math.random() * 10) + 3, // ₹3-12
          status: hoursAgo < 2 ? 'online' : 'offline'
        });
      }
    }

    // Get marketplace statistics
    const { data: transactionStats } = await supabase
      .from('transactions')
      .select('amount, data_type')
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const totalVolume = transactionStats?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
    const avgPrice = transactionStats?.length ? totalVolume / transactionStats.length : 0;

    // Get popular data types
    const dataTypeCounts = {};
    transactionStats?.forEach(t => {
      dataTypeCounts[t.data_type] = (dataTypeCounts[t.data_type] || 0) + 1;
    });

    const topDataType = Object.entries(dataTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Soil Health Data';

    return new Response(
      JSON.stringify({
        success: true,
        data_streams: dataStreams,
        marketplace_stats: {
          total_providers: dataStreams.length,
          online_providers: dataStreams.filter(d => d.status === 'online').length,
          avg_price: Math.round(avgPrice * 100) / 100,
          weekly_volume: Math.round(totalVolume * 100) / 100,
          top_data_type: topDataType,
          demand_index: dataStreams.filter(d => d.status === 'online').length > 5 ? 'High' : 'Medium'
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in marketplace function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
