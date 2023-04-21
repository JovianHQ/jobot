import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/openai";
import MessageHistory from "@/components/MessageHistory";
import MessageInput from "@/components/MessageInput";
import { getTemplate } from "@/network";
import Template from "@/components/Template";

export default function TemplatePage({ template }) {
  const { history, sending, sendMessages } = useOpenAIMessages();

  if (!template) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Jobot - The AI That Does Everything</title>
        <link rel="icon" href="/jovian_favicon.png" type="image/png" />
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />

        {history.length === 1 && (
          <Template template={template} sendMessages={sendMessages} />
        )}

        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sending={sending} sendMessages={sendMessages} />
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const template = await getTemplate(context.params.slug);

  return {
    props: { template },
  };
}
