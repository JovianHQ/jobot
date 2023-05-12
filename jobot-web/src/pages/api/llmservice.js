import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createLLMService } from "usellm";

export const config = {
  runtime: "edge",
};

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const authenticated = await verifyServerSideAuth(supabase, req.headers);
  const headers = getChatResponseHeaders();

  if (!authenticated) {
    return new Response(`{ "message": "Unauthorized"}`, {
      status: 401,
      headers,
    });
  }

  const body = await req.json();

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200, headers });
  } catch (error) {
    return new Response(error.message, { status: 400, headers });
  }
}
