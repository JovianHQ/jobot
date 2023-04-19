import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import TextareaAutosize from "react-textarea-autosize";
import Navbar from "../components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { streamOpenAIResponse } from "@/utils/openai";

const SYSTEM_MESSAGE =
  "You are Jobot, a helpful and verstaile AI created by Jovian using state-of the art ML models and APIs.";

export default function Home() {
  const user = useUser();

  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_MESSAGE },
  ]);

  const [userMessage, setUserMessage] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendRequest();
    }
  };

  const sendRequest = async () => {
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
    setUserMessage("");

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
    } catch (error) {
      console.error("error");

      setUserMessage(oldUserMessage);
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
        <div>
          <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4 items-start">
            <TextareaAutosize
              value={userMessage}
              autoFocus
              maxRows={10}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything.."
              onChange={(e) => setUserMessage(e.target.value)}
              className="border text-lg rounded-md p-2 flex-1 resize-none"
              rows={1}
            />
            <button
              onClick={sendRequest}
              className="bg-blue-500 hover:bg-blue-600 border rounded-md text-white text-lg w-20 p-2 ml-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
