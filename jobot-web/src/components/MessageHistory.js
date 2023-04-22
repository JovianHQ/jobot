import { useEffect, useRef } from "react";

import Message from "./Message";

const MessageHistory = ({ history }) => {
  let messagesWindow = useRef();

  useEffect(() => {
    if (messagesWindow?.current) {
      messagesWindow.current.scrollTop = messagesWindow.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className="flex-1 overflow-y-auto py-2 px-2"
      ref={(el) => (messagesWindow.current = el)}
    >
      {history
        .filter((message) => message.role !== "system")
        .map((message, index) => (
          <Message key={index} {...message} />
        ))}
    </div>
  );
};

export default MessageHistory;
