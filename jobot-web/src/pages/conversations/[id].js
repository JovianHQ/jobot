import Layout from "@/components/Layout";
import MessageHistory from "@/components/MessageHistory";
import MessageInput from "@/components/MessageInput";
import Navbar from "@/components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ConversationPage({ conversation }) {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();

  const { history, setHistory, sending, sendMessages } = useOpenAIMessages(
    conversation.messages
  );

  useEffect(() => {
    setHistory(conversation.messages);
  }, [conversation, setHistory]);

  async function handleSend(newMessages) {
    const newHistory = await sendMessages(newMessages);

    if (!newHistory) {
      return false;
    }

    const savedMessages = newHistory.filter((m) => m.id);

    const unsavedMessages = newHistory
      .filter((m) => !m.id)
      .map((message) => ({
        ...message,
        conversation_id: id,
      }));

    const { data: newMessagesData, error: messagesError } = await supabase
      .from("messages")
      .insert(unsavedMessages)
      .select();

    if (messagesError) {
      toast.error("Failed to save messages. " + messagesError.message);
      console.error(messagesError);
      return false;
    }

    setHistory([...savedMessages, ...newMessagesData]);

    return true;
  }

  if (!conversation) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${conversation.title} - Jobot`}</title>
        <meta
          name="description"
          content="Jobot is a general purpose, programmable & extensible AI being developed by Jovian, using state of the art machine learning models and APIs."
        />
        <link rel="icon" href="/jobot_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <Layout>
        <Navbar />
        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sendMessages={handleSend} sending={sending} />
          </>
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const supabase = createServerSupabaseClient(context);

  const { id } = context.params;

  const {
    data: { user },
    error: err1,
  } = await supabase.auth.getUser();

  if (err1 || !user) {
    return {
      notFound: true,
    };
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages(id, role, created_at, content)")
    .eq("id", id)
    .single();

  if (!data || !data.user_id == user.id || error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      conversation: data,
    },
  };
}
