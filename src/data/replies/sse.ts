/**
 * Reads an OpenAI-style server-sent event stream and reports the text so far
 * after every token. Returns the full text once the stream ends.
 */
export async function readTextStream(
  body: ReadableStream<Uint8Array>,
  onText: (textSoFar: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return text;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const token = tokenFrom(line);
      if (token) {
        text += token;
        onText(text);
      }
    }
  }
}

function tokenFrom(line: string): string | undefined {
  if (!line.startsWith('data: ') || line === 'data: [DONE]') {
    return undefined;
  }
  try {
    return JSON.parse(line.slice(6)).choices?.[0]?.delta?.content;
  } catch {
    return undefined;
  }
}
