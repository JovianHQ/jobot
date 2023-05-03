import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageInput from "@/components/MessageInput";
import MessageHistory from "@/components/MessageHistory";
import Skills from "@/components/Skills";
import Layout from "@/components/Layout";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function Home() {
  const { history, sending, sendMessages } = useOpenAIMessages();
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  async function handleSend(newMessages) {
    const finalHistory = await sendMessages(newMessages);

    if (!finalHistory) {
      return false;
    }

    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: finalHistory
          .filter((m) => m.role !== "system")[0]
          .content.slice(0, 40),
      })
      .select()
      .single();

    if (conversationError) {
      toast.error(
        "Failed to create conversation. " + conversationError.message
      );
      console.error("Failed to create conversation", conversationError);
      return false;
    }

    // add conversation id into all messages
    const unsavedMessages = finalHistory.map((message) => ({
      ...message,
      conversation_id: conversationData.id,
    }));

    // insert messages using supabase
    const { error: messagesError } = await supabase
      .from("messages")
      .insert(unsavedMessages);

    if (messagesError) {
      toast.error("Failed to save messages. " + messagesError.message);
      console.error("Failed to save messages", messagesError);
      return false;
    }

    router.push(`/conversations/${conversationData.id}`);
  }

  return (
    <>
      <Head>
        <title>Jobot - The AI That Does Everything</title>
        <meta
          name="description"
          content="Jobot is a general purpose, programmable & extensible AI being developed by Jovian, using state of the art machine learning models and APIs."
        />
        <link rel="icon" href="/jobot_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <Layout>
        <Navbar />

        {history.length <= 1 && (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl overflow-y-auto w-full">
              <h1 className="mx-auto mt-4 my-6 w-full max-w-4xl text-3xl  md:text-4xl font-medium text-center">
                Jobot - The AI That Does Everything
              </h1>
            </div>

            <MessageInput
              sending={sending}
              sendMessages={handleSend}
              placeholder="Ask me anything.."
            />

            <Skills />
          </div>
        )}

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
