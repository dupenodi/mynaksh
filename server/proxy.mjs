// Keeps the OpenRouter key off the phone: the app posts here and the reply streams straight back.
import { createServer } from 'node:http';

import { hasApiKey, MODEL, streamChat } from './openrouter.mjs';

const PORT = Number(process.env.PORT ?? 8787);

if (!hasApiKey()) {
  console.error('OPENROUTER_API_KEY is not set. Add it to .env (see .env.example).');
  process.exit(1);
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404).end();
    return;
  }

  try {
    const { messages } = await readJson(req);
    const upstream = await streamChat(messages);
    res.writeHead(upstream.status, { 'Content-Type': 'text/event-stream' });
    for await (const chunk of upstream.body) res.write(chunk);
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(502).end(JSON.stringify({ error: 'Upstream request failed' }));
  }
}).listen(PORT, () => console.log(`Chat proxy on http://localhost:${PORT} using ${MODEL}`));
