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

    const { imageBase64, userId } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the integration API key
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct prompt for plant disease diagnosis
    const prompt = `You are an expert agricultural pathologist specializing in Indian crop diseases. Analyze this plant leaf image carefully and provide:

1. **Disease/Pest Identification**: Identify any diseases, pests, or nutrient deficiencies visible in the image.
2. **Severity Assessment**: Rate the severity as Low, Medium, or High.
3. **Organic Treatment**: Provide 3-4 specific organic treatment recommendations suitable for Indian farmers, including:
   - Natural pesticides (neem oil, garlic spray, etc.)
   - Cultural practices (pruning, spacing, etc.)
   - Timing and application methods
4. **Prevention**: Suggest 2-3 preventive measures for future.

Be specific, practical, and focus on affordable, organic solutions.`;

    // Call Gemini API with image
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
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image', details: errorText }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse SSE response
    const responseText = await geminiResponse.text();
    let diagnosis = '';
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(line.substring(6));
          if (jsonData.candidates && jsonData.candidates[0]?.content?.parts) {
            const parts = jsonData.candidates[0].content.parts;
            for (const part of parts) {
              if (part.text) {
                diagnosis += part.text;
              }
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (!diagnosis) {
      return new Response(
        JSON.stringify({ error: 'No diagnosis generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract confidence level (if mentioned)
    let confidenceLevel = 'Medium';
    if (diagnosis.toLowerCase().includes('high confidence') || diagnosis.toLowerCase().includes('definitely')) {
      confidenceLevel = 'High';
    } else if (diagnosis.toLowerCase().includes('low confidence') || diagnosis.toLowerCase().includes('possibly')) {
      confidenceLevel = 'Low';
    }

    // Store diagnosis in database
    const { data: diagnosisRecord, error: dbError } = await supabase
      .from('plant_diagnoses')
      .insert({
        user_id: userId,
        diagnosis: diagnosis,
        treatment: diagnosis, // Full response includes treatment
        confidence_level: confidenceLevel
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        diagnosis: diagnosis,
        confidence_level: confidenceLevel,
        diagnosis_id: diagnosisRecord?.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in plant-doctor function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
