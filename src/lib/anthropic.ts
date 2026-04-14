import Anthropic from "@anthropic-ai/sdk";

// Server-only — never import this in client components.
// The ANTHROPIC_API_KEY env var has no NEXT_PUBLIC_ prefix,
// so it is only available on the server.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
