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

  if (!body || !body.email || !body.code) {
    return new Response("The fields `email` and `code` are required", {
      status: 400,
    });
  }

  const supabase = createMiddlewareSupabaseClient({ req, res });

  let user;

  const { data: data1, error: error1 } = await supabase.auth.verifyOtp({
    email: body.email,
    token: body.code,
    type: "magiclink",
  });

  if (error1) {
    console.error(
      "Magic link OTP verification failed for " + body.email,
      error1
    );
    const { data: data2, error: error2 } = await supabase.auth.verifyOtp({
      email: body.email,
      token: body.code,
      type: "signup",
    });

    if (error2) {
      console.error("Signup OTP verification failed for " + body.email, error2);
      return new Response("Failed to log in." + error2.message, {
        status: 400,
        headers,
      });
    }

    user = data2?.user;
  } else {
    user = data1?.user;
  }

  if (!user) {
    console.error("unable to retrieve user");
    return new Response("Unable to retrieve user", {
      status: 400,
      headers,
    });
  }

  const keyName = "API Key - " + new Date().toString();

  const keyData = {
    user_id: user.id,
    name: keyName,
  };

  const { error: error3 } = await supabase.from("apikeys").insert(keyData);

  if (error3) {
    return new Response("Failed to create API key. " + error3.message, {
      status: 500,
      headers,
    });
  }

  const { data, error: error4 } = await supabase
    .from("apikeys")
    .select("*")
    .eq("name", keyName)
    .eq("user_id", user.id)
    .single();

  if (error4) {
    return new Response("Failed to create API key. " + error3.message, {
      status: 500,
      headers,
    });
  }

  headers["Content-Type"] = "application/json";
  return new Response(JSON.stringify({ apiKey: data }), {
    status: 200,
    headers,
  });
}
