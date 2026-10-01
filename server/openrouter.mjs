// Shared by the local proxy and the Vercel function, so both behave the same.
const MODEL = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-haiku-4.5';

export function hasApiKey() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export function streamChat(messages) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Title': 'MyNaksh Conversation',
    },
    body: JSON.stringify({ model: MODEL, messages, stream: true, max_tokens: 1800 }),
  });
}

export { MODEL };
