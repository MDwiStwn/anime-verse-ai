import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Create Supabase client for database access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { message }: ChatMessage = await req.json();

    console.log('Received chat message:', message);

    // Get anime data from database for context
    const { data: animeData, error: animeError } = await supabase
      .from('animes')
      .select('id, title, english_title, romaji_title, genres, synopsis, rating, release_year, status')
      .limit(50);

    if (animeError) {
      console.error('Error fetching anime data:', animeError);
    }

    // Create context for AI
    const animeContext = animeData ? animeData.map(anime => ({
      id: anime.id,
      title: anime.title,
      english_title: anime.english_title,
      romaji_title: anime.romaji_title,
      genres: anime.genres,
      synopsis: anime.synopsis?.substring(0, 200) + '...',
      rating: anime.rating,
      year: anime.release_year,
      status: anime.status
    })) : [];

    const systemPrompt = `You are AniVerse AI, a friendly and knowledgeable anime assistant for the AniVerse streaming platform. You help users discover and learn about anime.

IMPORTANT GUIDELINES:
1. Always provide helpful, accurate responses about anime
2. When recommending anime, use the database data provided in the context
3. Format anime titles as clickable links using this exact format: [Anime Title](ANIME_ID)
4. Keep responses conversational and engaging
5. If asked about specific anime not in the database, politely mention it's not available on AniVerse yet
6. For recommendations, consider user preferences for genre, year, rating, etc.
7. Always be enthusiastic about anime!

Available anime in our database:
${JSON.stringify(animeContext, null, 2)}

Remember: When mentioning any anime from our database, format it as [Anime Title](ANIME_ID) so users can click to view details.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});