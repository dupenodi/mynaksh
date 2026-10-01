// Vercel function behind the hosted web build. Same domain as the page, so no CORS.
import { hasApiKey, streamChat } from '../server/openrouter.mjs';

export async function POST(request) {
  if (!hasApiKey()) {
    return Response.json({ error: 'OPENROUTER_API_KEY is not set' }, { status: 500 });
  }
  const { messages } = await request.json();
  if (!Array.isArray(messages)) {
    return Response.json({ error: 'messages must be an array' }, { status: 400 });
  }
  const upstream = await streamChat(messages);
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
