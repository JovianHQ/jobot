import { ensureUserProfile, getChatResponseHeaders } from "@/network";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  const headers = getChatResponseHeaders();
  for (const key in headers) {
    res.setHeader(key, headers[key]);
  }

  if (req.method !== "POST") {
    res.status(405).send("Method not supported");
    return;
  }
  const { email, phone, code } = req.body || {};

  if (!(email || phone) || !code) {
    res.status(400).send("The fields `email`/`phone` and `code` are required");
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });

  const supabaseBody = {
    token: code,
    type: phone ? "sms" : "email",
  };

  if (email) {
    supabaseBody.email = email;
  }

  if (phone) {
    supabaseBody.phone = phone;
  }

  const { data: data1, error: error1 } = await supabase.auth.verifyOtp(
    supabaseBody
  );

  if (error1) {
    console.error("Failed to verify code for login", error1);
    res
      .status(400)
      .json({ message: "Failed to verify code. " + error1.message });

    return;
  }

  const user = data1?.user;

  if (!user) {
    console.error("unable to retrieve user");
    res.status(400).json({ message: "Unable to retrieve user" });
    return;
  }

  const profile = await ensureUserProfile(supabase, user);

  if (!profile) {
    console.log("unable to create user profile");
    res.status(500).json({ message: "Unable to create user profile" });
    return;
  }

  const keyName = "API Key - " + new Date().toString();

  const keyData = {
    user_id: user.id,
    name: keyName,
  };

  const { data: apiKey, error: error3 } = await supabase
    .from("apikeys")
    .insert(keyData)
    .select()
    .single();

  if (error3) {
    res
      .status(500)
      .json({ message: "Failed to create API key. " + error3.message });
    return;
  }

  res.status(200).json({ apiKey });
}
