// Groq API (OpenAI-compatible endpoint)
// Using 8B model for higher rate limits (30,000 TPM vs 12,000 for 70B)
const MODEL = 'llama-3.1-8b-instant' // Faster, higher rate limits, still very capable
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const token = process.env.GROQ_API_KEY
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GROQ_API_KEY not configured on server' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { messages, maxTokens = 150, temperature = 0.7 } = body

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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
        body: JSON.stringify({ error: `Groq API error ${res.status}: ${data}` }),
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
