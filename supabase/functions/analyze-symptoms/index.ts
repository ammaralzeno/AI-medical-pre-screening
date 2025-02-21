
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
    const prompt = `As an AI medical pre-screening assistant, analyze the following patient information and provide a comprehensive assessment. Your response must be a valid JSON object with the following structure:

{
  "preliminaryAssessment": "A concise summary of the patient's condition",
  "potentialCauses": ["array of at least 3 possible causes"],
  "riskLevel": "low", "medium", or "high",
  "recommendedActions": ["array of at least 3 specific recommended actions"],
  "urgencyLevel": number from 1 to 10
}

Patient Information:
1. Patient Demographics:
- Name: ${formData.name}
- Age: ${formData.age}
- Gender: ${formData.gender}
- Medical History: ${formData.hasMedicalConditions ? formData.medicalConditionsDetails : 'No existing conditions'}

2. Symptoms:
- Pain Areas: ${formData.painAreas?.join(', ')}
- Pain Intensity: ${formData.painIntensity}
- Duration: ${formData.symptomDuration}

3. Red Flags:
- Numbness/Weakness: ${formData.hasNumbness ? 'Yes' : 'No'}
- Chest Pain/Breathing Issues: ${formData.hasChestPain ? 'Yes' : 'No'}

4. Additional Context:
${formData.additionalInfo}

Provide a direct, clear response following the exact JSON structure specified above. The preliminaryAssessment should be a single paragraph summarizing key findings.`;

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
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a medical pre-screening assistant that provides structured JSON responses. Always include a clear preliminaryAssessment in your response.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const analysis = JSON.parse(data.choices[0].message.content);

    // Validate the response format
    if (!analysis.preliminaryAssessment || typeof analysis.preliminaryAssessment !== 'string') {
      throw new Error('Invalid response: Missing or invalid preliminaryAssessment');
    }
    if (!Array.isArray(analysis.potentialCauses) || analysis.potentialCauses.length < 1) {
      throw new Error('Invalid response: Missing or invalid potentialCauses');
    }
    if (!['low', 'medium', 'high'].includes(analysis.riskLevel)) {
      throw new Error('Invalid response: Invalid riskLevel');
    }
    if (!Array.isArray(analysis.recommendedActions) || analysis.recommendedActions.length < 1) {
      throw new Error('Invalid response: Missing or invalid recommendedActions');
    }
    if (typeof analysis.urgencyLevel !== 'number' || analysis.urgencyLevel < 1 || analysis.urgencyLevel > 10) {
      throw new Error('Invalid response: Invalid urgencyLevel');
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      preliminaryAssessment: "Unable to generate assessment at this time. Please try again.",
      potentialCauses: [],
      riskLevel: "medium",
      recommendedActions: ["Please try submitting the form again.", "If the problem persists, contact support."],
      urgencyLevel: 5
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
