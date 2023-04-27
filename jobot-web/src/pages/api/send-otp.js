import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  const body = await req.json();

  if (!body || !body.email) {
    return new Response("Email is required", { status: 400 });
  }

  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { error } = await supabase.auth.signInWithOtp({
    email: body.email,
  });

  if (error) {
    return new Response("Failed to send verification code. " + error.message, {
      status: 500,
    });
  }

  return new Response("Verification code sent", { status: 200 });
}
