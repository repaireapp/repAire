// Netlify Function — Proxy sécurisé vers OpenAI
// La clé API est stockée dans les variables d'environnement Netlify (jamais dans le code)

export default async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const body = await req.json();
    const { messages, model, temperature, max_tokens, response_format } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages manquants' }),
        { status: 400, headers }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API non configurée sur le serveur' }),
        { status: 500, headers }
      );
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000,
        response_format: response_format || { type: 'json_object' },
        messages,
      }),
    });

    const data = await openaiResponse.json();

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erreur serveur proxy' }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/.netlify/functions/diagnostic',
};
