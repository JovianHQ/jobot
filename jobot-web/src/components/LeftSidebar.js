import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineChatBubbleLeftRight as ChatIcon } from "react-icons/hi2";
import { RiMenuUnfoldLine, RiMenuFoldLine } from "react-icons/ri";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

const LeftSidebar = () => {
  const [show, setShow] = useState(false);
  const { query } = useRouter();
  const user = useUser();

  if (!user) {
    return null;
  }

  const data = {};

  return (
    <div
      className="hidden h-full lg:inset-y-0 lg:z-50 lg:flex "
      style={{ top: 56 }}
    >
      {!show && (
        <div className="p-4 pr-0">
          <button
            className="rounded-full flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white text-lg"
            title="Show"
            onClick={() => setShow(true)}
          >
            <RiMenuUnfoldLine variant="primary" style={{ fontSize: 20 }} />
          </button>
        </div>
      )}

      <div
        className={cn(
          "flex grow flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-white p-2 pt-0 dark:border-gray-500 dark:bg-transparent ",
          !show && "invisible"
        )}
      >
        <div className="sticky top-0 flex items-center bg-white py-2 dark:bg-gray-900">
          <Link
            className={cn(
              "flex flex-1 cursor-pointer items-center rounded-md border  p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-500 dark:bg-gray-800 dark:text-white dark:hover:text-white",
              !query.id && "bg-gray-100 font-semibold text-gray-600"
            )}
            href="/jobot"
          >
            <AiOutlinePlus size={20} className="inline " />
            <div>&nbsp;&nbsp;New Chat</div>
          </Link>

          <button
            className="rounded-full ml-2 flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white text-lg"
            title="Hide"
            onClick={() => setShow(false)}
          >
            <RiMenuFoldLine variant="primary" style={{ fontSize: 20 }} />
          </button>
        </div>

        {data.conversations?.map((conversation, index) => (
          <Link
            key={conversation.subject + "-" + index}
            className={cn(
              "flex cursor-pointer items-center rounded-md p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 hover:dark:text-white",
              conversation.id == query.id &&
                "bg-gray-100 font-semibold text-gray-600 dark:bg-gray-800 dark:text-white"
            )}
            href={`/jobot/conversation/${conversation.id}`}
            shallow
          >
            <ChatIcon size={20} className="inline flex-shrink-0" />
            <div className="truncate">
              &nbsp;&nbsp;{conversation.subject || "New Chat"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
