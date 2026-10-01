// Local stand-in for api/chat.mjs. Keeps the OpenRouter key on the server and has no dependencies.
import { createServer } from 'node:http';

import { hasApiKey, MODEL, streamChat } from './openrouter.mjs';

const PORT = Number(process.env.PORT ?? 8787);

if (!hasApiKey()) {
  console.error('OPENROUTER_API_KEY is not set. Add it to .env (see .env.example).');
  process.exit(1);
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors).end();
    return;
  }
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404, cors).end();
    return;
  }

  try {
    const { messages } = await readJson(req);
    const upstream = await streamChat(messages);
    // Pipe the server-sent events straight through, so tokens reach the app as they arrive.
    res.writeHead(upstream.status, { ...cors, 'Content-Type': 'text/event-stream' });
    for await (const chunk of upstream.body) res.write(chunk);
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(502, cors).end(JSON.stringify({ error: 'Upstream request failed' }));
  }
}).listen(PORT, () => console.log(`Chat proxy on http://localhost:${PORT} using ${MODEL}`));
