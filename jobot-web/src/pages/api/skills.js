import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: skills, error } = await supabase.from("skills").select(`
    *,
    profile:profiles (
      username,
      first_name,
      last_name
    )
  `);

  if (error) {
    res.status(404).json({ error: error });
    return;
  }

  res.status(200).json({ skills });
}
