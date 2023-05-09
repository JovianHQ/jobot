import { useUser } from "@supabase/auth-helpers-react";
import { createParser } from "eventsource-parser";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoginDialog } from ".";

export const OpenAIStream = async (body, apiKey) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey || process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error. " + (await res.text()));
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export async function streamOpenAIResponse(response, callback) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  let isFirst = true;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;
    callback({ content: text, role: "assistant" }, isFirst);
    isFirst = false;
  }
  return { content: text, role: "assistant" };
}

const useLLM = (serviceUrl) => {
  async function chat({ body, onStream, onSuccess, onError }) {
    const response = await fetch(`${serviceUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      onError(new Error(await response.text()));
      return;
    }

    if (body.stream) {
      const message = await streamOpenAIResponse(response, onStream);
      onSuccess(message);
    } else {
      const resJson = await response.json();
      onSuccess(resJson.choices[0]);
    }
  }

  return { chat };
};

export async function postOpenAIMessages(messages) {
  return await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, stream: true }),
  });
}

const SYSTEM_MESSAGE =
  "You are Jobot, a helpful and verstaile AI created by Jovian using state-of the art ML models and APIs.";

const DEFAULT_HISTORY = [{ role: "system", content: SYSTEM_MESSAGE }];

export default function useOpenAIMessages(initialHistory = DEFAULT_HISTORY) {
  const { setLoginOpen } = useLoginDialog();
  const [history, setHistory] = useState(initialHistory);
  const [sending, setSending] = useState(false);
  const user = useUser();

  const llm = useLLM("/api/llmservice");

  const sendMessages = async (newMessages) => {
    if (!user) {
      toast("Please log in to send a message");
      setLoginOpen(true);
      return;
    }

    const oldHistory = history;
    const newHistory = [...history, ...newMessages];
    setSending(true);
    setHistory(newHistory);

    let finalHistory;

    await llm.chat({
      body: { messages: newHistory, stream: true },
      onStream: (message) => {
        finalHistory = [...newHistory, message];
        setHistory(finalHistory);
      },
      onSuccess: (message) => {
        setSending(false);
        finalHistory = [...newHistory, message];
        setHistory(finalHistory);
      },
      onError: (error) => {
        setSending(false);
        setHistory(oldHistory);
        toast.error("Failed to send:" + error.message);
        console.error("Faild to send", error);
      },
    });

    return finalHistory;
  };

  return { history, setHistory, sending, sendMessages };
}
