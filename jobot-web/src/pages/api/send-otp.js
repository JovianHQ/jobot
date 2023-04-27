import { getChatResponseHeaders } from "@/network";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  const headers = getChatResponseHeaders();
  if (req.method !== "POST") {
    return new Response("Method not supported", { status: 405, headers });
  }
  const body = await req.json();

  if (!body || !body.email) {
    return new Response("Email is required", { status: 400, headers });
  }

  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { error } = await supabase.auth.signInWithOtp({
    email: body.email,
  });

  if (error) {
    return new Response("Failed to send verification code. " + error.message, {
      status: 500,
      headers,
    });
  }

  return new Response("Verification code sent", { status: 200, headers });
}
