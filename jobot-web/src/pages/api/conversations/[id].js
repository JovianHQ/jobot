import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const headers = getChatResponseHeaders();
  for (const key in headers) {
    res.setHeader(key, headers[key]);
  }
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
    return;
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
    return;
  }

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(200).json({ data });
  return;
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
    return;
  }

  if (error) {
    res
      .status(400)
      .json({ message: "Conversation not found. " + error.message });
  }

  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error: messagesError } = await supabaseService
    .from("messages")
    .insert(messages);

  if (messagesError) {
    res.status(500).json({ message: messagesError.message });
    return;
  }

  return getConversation(supabase, user, req, res);
}
