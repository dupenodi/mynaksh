// Vercel function at /api/chat. The web app is served from the same domain, so no CORS is needed.
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
  // Returning the upstream body as-is streams the reply to the browser token by token.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
