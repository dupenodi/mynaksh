/**
 * Reads an OpenAI-style server-sent event stream fed in as text chunks, and reports
 * the text so far after every token.
 */
export function createSseReader(onText: (textSoFar: string) => void) {
  let buffer = '';
  let text = '';

  return {
    push(chunk: string) {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const token = tokenFrom(line);
        if (token) {
          text += token;
          onText(text);
        }
      }
    },
    text: () => text,
  };
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
