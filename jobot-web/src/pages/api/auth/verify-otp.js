import { getChatResponseHeaders } from "@/network";
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
    res.status(400).send("The fields `email` and `code` are required");
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });

  const { data: data1, error: error1 } = await supabase.auth.verifyOtp({
    email: email,
    token: code,
    phone: phone,
    type: phone ? "sms" : "email",
  });

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
