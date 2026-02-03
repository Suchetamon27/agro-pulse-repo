import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    const { soilMoisture, temperature, humidity, cropType, weatherForecast } = await req.json();

    if (!cropType) {
      return new Response(
        JSON.stringify({ error: 'Crop type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the integration API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the prompt for Gemini
    const prompt = `You are an expert agricultural advisor for Indian farmers. Based on the following real-time data, provide a professional 3-sentence action plan with specific, actionable recommendations:

Current Agricultural Data:
- Crop Type: ${cropType}
- Soil Moisture: ${soilMoisture}%
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Weather Forecast: ${weatherForecast || 'Normal conditions'}

Provide exactly 3 sentences with specific actions the farmer should take immediately. Focus on irrigation, crop protection, and timing. Be precise with percentages and measurements suitable for Indian farming practices.`;

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
        JSON.stringify({ error: 'Failed to get AI guidance', details: errorText }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse SSE response
    const responseText = await geminiResponse.text();
    
    // Extract the text from SSE format
    let aiGuidance = '';
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(line.substring(6));
          if (jsonData.candidates && jsonData.candidates[0]?.content?.parts) {
            const parts = jsonData.candidates[0].content.parts;
            for (const part of parts) {
              if (part.text) {
                aiGuidance += part.text;
              }
            }
          }
        } catch (e) {
          // Skip invalid JSON lines
          continue;
        }
      }
    }

    if (!aiGuidance) {
      return new Response(
        JSON.stringify({ error: 'No guidance generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        guidance: aiGuidance.trim(),
        input_data: {
          cropType,
          soilMoisture,
          temperature,
          humidity,
          weatherForecast
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-advisor function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
