import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoginDialog } from ".";
import useLLM from "usellm";

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
      messages: newHistory,
      stream: true,
      onStream: (message) => {
        finalHistory = [...newHistory, message];
        setHistory(finalHistory);
      },
      onError: (error) => {
        console.error("Failed to send message", error);
        setHistory(oldHistory);
      },
    });

    setSending(false);
    return finalHistory;
  };

  return { history, setHistory, sending, sendMessages };
}
