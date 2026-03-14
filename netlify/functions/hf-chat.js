// OpenRouter API (supports multiple free models)
// Using Google Gemma 3 12B - excellent for structured outputs, completely free
const MODEL = 'google/gemma-3n-e2b-it:free' // Free tier, good quality
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const token = process.env.OPENROUTER_API_KEY
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENROUTER_API_KEY not configured on server' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { messages, maxTokens = 150, temperature = 0.7 } = body

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://iu-app.netlify.app', // Your site URL (optional but recommended)
        'X-Title': 'IU Japanese Learning App', // App name (optional)
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    })

    const data = await res.text()

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `OpenRouter API error ${res.status}: ${data}` }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
