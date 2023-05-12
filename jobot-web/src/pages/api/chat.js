import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createLLMService } from "usellm";

export const config = {
  runtime: "edge",
};

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

async function handler(req, res) {
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
  body.model = "gpt-3.5-turbo";

  body.messages = (body.messages || []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  body.$action = "chat";

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200, headers });
  } catch (error) {
    return new Response(error.message, { status: 400, headers });
  }
}

export default handler;
