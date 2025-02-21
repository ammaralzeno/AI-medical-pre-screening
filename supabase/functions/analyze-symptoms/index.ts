
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    
    // Format the prompt with the questionnaire data
    const prompt = `You are an AI medical pre-screening assistant. Based on the following patient information, provide a structured analysis. Return your response in JSON format with these sections: preliminaryAssessment (general overview), potentialCauses (array of possible causes), riskLevel (low, medium, or high), recommendedActions (array of next steps), and urgencyLevel (numeric 1-10).

Patient Information:
- Name: ${formData.name}
- Age: ${formData.age}
- Main Symptom: ${formData.mainSymptom}
- Duration: ${formData.symptomDuration}
- Additional Details: ${formData.additionalInfo}

Provide your analysis in a clear, structured JSON format.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a medical pre-screening assistant that provides structured JSON responses.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
