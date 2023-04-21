import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageInput from "@/components/MessageInput";
import MessageHistory from "@/components/MessageHistory";

export default function Home() {
  const { history, sending, sendMessages } = useOpenAIMessages();

  return (
    <>
      <Head>
        <title>Jobot - Your friendly neighborhood AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
        <MessageHistory history={history} />
        <MessageInput sendMessages={sendMessages} sending={sending} />
      </div>
    </>
  );
}
