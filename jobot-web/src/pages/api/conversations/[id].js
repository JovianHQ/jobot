import { verifyServerSideAuth } from "@/network";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = await verifyServerSideAuth(supabase, req.headers);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    return getConversation(supabase, user, req, res);
  } else if (req.method === "POST") {
    return updateConversation(supabase, user, req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getConversation(supabase, user, req, res) {
  const { id } = req.query;

  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages (id, created_at, role, content)")
    .eq("id", id)
    .single();

  if (!data || !data.user_id == user.id) {
    res.status(404).json({ message: "Conversation not found" });
  }

  if (error) {
    res.status(400).json({ message: error.message });
  }

  res.status(200).json({ data });
}

async function updateConversation(supabase, user, req, res) {
  const { id } = req.query;
  let { messages } = req.body;

  messages = messages.map((message) => ({
    ...message,
    conversation_id: id,
  }));

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .single();

  if (!data || !data.user_id == user.id) {
    res.status(404).json({ message: "Conversation not found" });
  }

  if (error) {
    res
      .status(400)
      .json({ message: "Conversation not found. " + error.message });
  }

  const { error: messagesError } = await supabase
    .from("messages")
    .insert(messages);

  if (messagesError) {
    res.status(500).json({ message: messagesError.message });
  }

  return getConversation(supabase, user, req, res);
}
