import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-pro'),
    messages,
    system: `You are NEXUS, an advanced holographic spatial computing OS. 
    Keep your answers concise, conversational, and direct. 
    Do not use markdown like asterisks or bolding, just plain text, as it will be spoken via TTS and rendered as 3D text.
    The user is currently looking at the '${context}' module. You should use this context if they say 'this' or 'here'.
    When the user asks you to open a module, rotate the carousel, or perform a UI action, use the appropriate tool.`,
    tools: {
      // @ts-ignore
      executeCommand: tool({
        description: 'Execute a UI command like rotating the carousel or opening a specific module.',
        parameters: z.object({
          command: z.enum([
            'rotate-left', 'rotate-right', 'open-Instagram', 'open-Stocks', 'open-Projects', 
            'open-Sports', 'open-Calendar', 'open-Weather', 'open-AI', 'open-News', 
            'open-Music', 'open-System'
          ])
        }),
      } as any),
    },
  });

  // @ts-ignore - Ignore type error for toDataStreamResponse if present
  return result.toDataStreamResponse();
}
