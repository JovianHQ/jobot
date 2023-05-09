import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

async function getAllConversations(supabase, user, res) {
  const headers = getChatResponseHeaders();
  for (const key in headers) {
    res.setHeader(key, headers[key]);
  }
  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages (id, created_at, role, content)")
    .eq("user_id", user.id);

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.status(200).json({ data });
}

async function createNewConversation(supabase, user, req, res) {
  // get message from body
  let { messages, title } = req.body;

  // if messages is empty list return 400
  if (!messages || messages.length === 0) {
    res.status(400).json({ message: "No messages provided" });
  }

  // create new conversation
  const { data: conversationData, error: conversationError } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title: title || messages[0].content.slice(0, 40),
    })
    .select()
    .single();

  if (conversationError) {
    res.status(500).json({ message: conversationError.message });
  }

  // add conversation id into all messages
  messages = messages.map((message) => ({
    ...message,
    conversation_id: conversationData.id,
  }));

  // insert messages using supabase
  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .insert(messages)
    .select();

  if (messagesError) {
    res.status(500).json({ message: messagesError.message });
  }

  conversationData.messages = messagesData;

  res.status(200).json({ data: conversationData });
}

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = await verifyServerSideAuth(supabase, req.headers);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    return getAllConversations(supabase, user, res);
  } else if (req.method === "POST") {
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    return createNewConversation(supabaseService, user, req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
