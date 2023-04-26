import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

const headers = {
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Referer, Authorization, API_URL",
};

async function verifyAuth(req, res) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const possibleKey = authHeader.substring(7);

    const { data: apiKey, error: err2 } = await supabase
      .from("apikeys")
      .select("*")
      .eq("key", possibleKey)
      .single();

    if (err2 || !apiKey) {
      console.error("Failed to validate API key", err2);
    } else {
      return true;
    }
  }

  const {
    data: { user },
    error: err1,
  } = await supabase.auth.getUser();

  if (err1 || !user) {
    console.error("Failed to get current user", err1);
  } else {
    return true;
  }

  return false;
}

async function handler(req, res) {
  const authenticated = await verifyAuth(req, res);

  if (!authenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  body.model = "gpt-3.5-turbo";

  if (body.stream) {
    const stream = await OpenAIStream(body);
    return new Response(stream, { status: 200, headers });
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    return new Response(res, { status: 200, headers });
  }
}

export default handler;
