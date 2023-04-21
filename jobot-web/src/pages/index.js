import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageInput from "@/components/MessageInput";
import MessageHistory from "@/components/MessageHistory";
import Templates from "@/components/Templates";

export default function Home() {
  const { history, sending, sendMessages } = useOpenAIMessages();

  return (
    <>
      <Head>
        <title>Jobot - The AI That Does Everything</title>
        <link rel="icon" href="/jovian_favicon.png" type="image/png" />
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />

        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sendMessages={sendMessages} sending={sending} />
          </>
        )}
        {history.length <= 1 && (
          <div className="flex-1 overflow-y-auto ">
            <div className="mx-auto max-w-4xl overflow-y-auto w-full">
              <h1 className="mx-auto my-6 w-full max-w-4xl text-4xl font-medium text-center">
                Jobot - The AI That Does Everything
              </h1>
            </div>
            <MessageInput
              sending={sending}
              sendMessages={sendMessages}
              placeholder="Ask me anything.."
            />
            <div className="mx-auto max-w-4xl overflow-y-auto pb-8 w-full">
              <Templates />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
