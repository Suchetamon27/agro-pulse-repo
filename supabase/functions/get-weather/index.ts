import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the integration API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch weather data from the API
    const weatherResponse = await fetch(
      `https://app-9djb8xmdm6m9-api-wL1zlmgJGAlY.gateway.appmedo.com/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts`,
      {
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('Weather API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data', details: errorText }),
        { 
          status: weatherResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const weatherData = await weatherResponse.json();

    // Extract relevant data
    const result = {
      current: {
        temp: weatherData.current?.temp || 0,
        feels_like: weatherData.current?.feels_like || 0,
        humidity: weatherData.current?.humidity || 0,
        pressure: weatherData.current?.pressure || 0,
        wind_speed: weatherData.current?.wind_speed || 0,
        uvi: weatherData.current?.uvi || 0,
        clouds: weatherData.current?.clouds || 0,
        weather: weatherData.current?.weather?.[0] || {},
      },
      hourly: weatherData.hourly?.slice(0, 24) || [],
      daily: weatherData.daily?.slice(0, 7) || [],
      timezone: weatherData.timezone || 'Asia/Kolkata',
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in get-weather function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
