const axios = require('axios');

async function generateExtraction(text, question) {

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const systemPrompt = `You are an information extraction assistant. Given a document and a question, return a JSON object with 5-8 key-value pairs most relevant to the question. Respond ONLY with a valid JSON object.`;

  const userPrompt = `Document:\n"""\n${text.substring(0, 35000)}\n"""\n\nQuestion: ${question}\n\nReturn a JSON object of 5-8 short key-value pairs summarizing the most relevant facts for the question.`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.0,
    max_tokens: 1000
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`
  };

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', body, { headers });
  const textResp = resp.data.choices[0].message.content;

  // Try to safely parse JSON from the model output
  try {
    const parsed = JSON.parse(textResp);
    return parsed;
  } catch (e) {
    // If parsing fails, wrap the raw text
    return { raw: textResp };
  }
}

module.exports = { generateExtraction };
