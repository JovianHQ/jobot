import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageInput from "@/components/MessageInput";
import MessageHistory from "@/components/MessageHistory";
import Skills from "@/components/Skills";

export default function Home() {
  const { history, sending, sendMessages } = useOpenAIMessages();

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
      <div className="flex flex-col h-screen">
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
              sendMessages={sendMessages}
              placeholder="Ask me anything.."
            />

            <Skills />
          </div>
        )}

        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sendMessages={sendMessages} sending={sending} />
          </>
        )}
      </div>
    </>
  );
}
