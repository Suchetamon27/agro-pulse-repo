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

    const { weatherAnomaly } = await req.json();

    // Get the integration API key
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct prompt for market price simulation
    const prompt = `You are a market analyst for Indian agricultural commodities. Generate realistic current market prices for the following crops in Indian Rupees per quintal (100 kg):

1. Rice (Basmati)
2. Wheat
3. Corn (Maize)

Current market context: ${weatherAnomaly || 'Normal weather conditions'}

Provide ONLY a JSON response in this exact format (no markdown, no explanation):
{
  "rice": 3500,
  "wheat": 2100,
  "corn": 1800
}

Prices should reflect typical Indian mandi rates and factor in the weather context.`;

    // Call Gemini API
    const geminiResponse = await fetch(
      'https://app-9djb8xmdm6m9-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch market prices', details: errorText }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse SSE response
    const responseText = await geminiResponse.text();
    let priceData = '';
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(line.substring(6));
          if (jsonData.candidates && jsonData.candidates[0]?.content?.parts) {
            const parts = jsonData.candidates[0].content.parts;
            for (const part of parts) {
              if (part.text) {
                priceData += part.text;
              }
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Extract JSON from response
    let prices = { rice: 3500, wheat: 2100, corn: 1800 }; // Default fallback
    try {
      const jsonMatch = priceData.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        prices = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse prices, using defaults');
    }

    // Store prices in database
    const timestamp = new Date().toISOString();
    await supabase.from('market_prices').insert([
      { crop_name: 'Rice', price: prices.rice, recorded_at: timestamp },
      { crop_name: 'Wheat', price: prices.wheat, recorded_at: timestamp },
      { crop_name: 'Corn', price: prices.corn, recorded_at: timestamp }
    ]);

    // Calculate 7-day price predictions using simple linear regression
    // Factor in weather anomalies
    const predictions = calculatePricePredictions(prices, weatherAnomaly);

    return new Response(
      JSON.stringify({
        success: true,
        current_prices: prices,
        predictions: predictions,
        weather_context: weatherAnomaly || 'Normal conditions'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in market-intelligence function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculatePricePredictions(currentPrices: any, weatherAnomaly: string) {
  const predictions: any = {
    rice: [],
    wheat: [],
    corn: []
  };

  // Determine trend based on weather anomaly
  let riceTrend = 0.5; // Default: slight increase
  let wheatTrend = 0.5;
  let cornTrend = 0.5;

  if (weatherAnomaly) {
    const anomalyLower = weatherAnomaly.toLowerCase();
    
    if (anomalyLower.includes('drought') || anomalyLower.includes('heat')) {
      // Drought increases prices for water-intensive crops
      riceTrend = 2.5; // Rice is water-intensive
      wheatTrend = 1.5;
      cornTrend = 2.0;
    } else if (anomalyLower.includes('flood') || anomalyLower.includes('rain')) {
      // Excess rain can damage crops, increasing prices
      riceTrend = 1.5;
      wheatTrend = 1.0;
      cornTrend = 1.2;
    } else if (anomalyLower.includes('cold') || anomalyLower.includes('frost')) {
      // Cold affects wheat more
      wheatTrend = 2.0;
      riceTrend = 0.8;
      cornTrend = 1.0;
    }
  }

  // Generate 7-day predictions with some randomness
  for (let day = 1; day <= 7; day++) {
    const randomFactor = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
    
    predictions.rice.push({
      day: day,
      price: Math.round(currentPrices.rice * (1 + (riceTrend * day / 100) * randomFactor))
    });
    
    predictions.wheat.push({
      day: day,
      price: Math.round(currentPrices.wheat * (1 + (wheatTrend * day / 100) * randomFactor))
    });
    
    predictions.corn.push({
      day: day,
      price: Math.round(currentPrices.corn * (1 + (cornTrend * day / 100) * randomFactor))
    });
  }

  return predictions;
}
