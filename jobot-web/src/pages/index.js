import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import TextareaAutosize from "react-textarea-autosize";
import Navbar from "../components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { streamOpenAIResponse } from "@/utils/openai";
import JobotPageMessageForm from "@/components/JobotMessageForm";

const SYSTEM_MESSAGE =
  "You are Jobot, a helpful and verstaile AI created by Jovian using state-of the art ML models and APIs.";

export default function Home() {
  const user = useUser();

  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_MESSAGE },
  ]);

  const sendRequest = async (userMessage) => {
    if (!user) {
      alert("Please log in to send a message");
      return;
    }

    if (!userMessage) {
      alert("Please enter a message before you hit send");
      return;
    }

    const oldUserMessage = userMessage;
    const oldMessages = messages;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`OpenAI API returned an error.`);
      }

      streamOpenAIResponse(response, (newMessage) => {
        console.log("newMessage:", newMessage);
        const updatedMessages2 = [
          ...updatedMessages,
          { role: "assistant", content: newMessage },
        ];
        setMessages(updatedMessages2);
      });

      return true;
    } catch (error) {
      console.error("error");
      setMessages(oldMessages);
      window.alert("Error:" + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Jobot - Your friendly neighborhood AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <Navbar />

        {/* Message History */}
        <div className="flex-1 overflow-y-scroll ">
          <div className="w-full max-w-screen-md mx-auto px-4">
            {messages
              .filter((message) => message.role !== "system")
              .map((message, idx) => (
                <div key={idx} className="my-3">
                  <div className="font-bold">
                    {message.role === "user" ? "You" : "Jobot"}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input Box */}
        <JobotPageMessageForm sendMessage={sendRequest} />
      </div>
    </>
  );
}
