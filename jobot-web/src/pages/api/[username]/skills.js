import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: profile, error: err1 } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", req.query.username)
    .single();

  if (err1) {
    res.status(404).json({ error: err1 });
    return;
  }

  const { data: skills, error: err2 } = await supabase
    .from("skills")
    .select(`*`)
    .eq("user_id", profile.id);

  if (err2) {
    res.status(404).json({ profile, error: err2 });
    return;
  }

  res.status(200).json({ skills, profile });
}
