import React, { useRef, useEffect } from "react";
import cn from "classnames";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import TextArea from "react-textarea-autosize";
import { useState } from "react";

const MessageInput = ({
  sending,
  sendMessages,
  placeholder = "Start typing here...",
}) => {
  const inputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const handleSendClick = () => {
    sendMessages([{ role: "user", content: prompt }]).then(
      (success) => !success && setPrompt(prompt)
    );
    setPrompt("");
  };

  const Icon = sending ? HiOutlineDotsHorizontal : AiOutlineSend;

  useEffect(() => {
    !sending && inputRef?.current?.focus();
  }, [sending]);

  return (
    <div className="mx-auto w-full max-w-4xl p-2">
      <div className="flex items-end rounded-md border p-4 pr-2 dark:border-gray-400">
        <TextArea
          ref={inputRef}
          minRows={1}
          maxRows={10}
          autoFocus
          disabled={sending}
          placeholder={sending ? "Wait for my response.." : placeholder}
          className={cn(
            sending && "bg-gray-100 text-gray-400",
            "w-full flex-1 resize-none self-center bg-transparent leading-tight focus:outline-none dark:border-gray-500"
          )}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSendClick();
            }
          }}
        />
        <button
          className="rounded-full p-4 bg-blue-500 hover:bg-blue-600 text-white text-lg"
          title="Send"
          onClick={handleSendClick}
        >
          <Icon variant="primary" disabled={!prompt || sending} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
