import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineChatBubbleLeftRight as ChatIcon } from "react-icons/hi2";
import { RiMenuUnfoldLine, RiMenuFoldLine } from "react-icons/ri";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

async function getConversations(supabase, user) {
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages (id, created_at, role, content)")
    .eq("user_id", user.id);

  if (error) {
    toast.error("Failed to retrieve conversations. " + error.message);
    console.error("Failed to retrieve conversations", error);
    return [];
  }

  return data;
}

const LeftSidebar = () => {
  const [show, setShow] = useState(true);
  const { query } = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations(supabase, user).then(setConversations);
  }, [supabase, user, setConversations]);

  if (!user) {
    return null;
  }

  if (!show) {
    return (
      <button
        className="hidden fixed mt-3 ml-3 rounded-full lg:flex items-center justify-center p-2  hover:bg-gray-100 text-gray-400 text-lg z-50"
        title="Open Sidebar"
        onClick={() => setShow(true)}
      >
        <RiMenuUnfoldLine variant="primary" style={{ fontSize: 20 }} />
      </button>
    );
  }

  return (
    <div className="hidden h-full lg:inset-y-0 lg:z-50 lg:flex w-72">
      <div
        className={cn(
          "flex grow flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-white p-2 pt-0 ",
          !show && "invisible"
        )}
      >
        <div className="sticky top-0 flex items-center bg-white pt-2 ">
          <Link
            className={cn(
              "flex flex-1 cursor-pointer items-center rounded-md border p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 ",
              !query.id && "bg-gray-100 font-semibold text-gray-600"
            )}
            href="/"
          >
            <AiOutlinePlus size={20} className="inline" />
            <div>&nbsp;&nbsp;New Chat</div>
          </Link>

          <button
            className="rounded-full ml-2 flex items-center justify-center p-2 hover:bg-gray-100 text-gray-400 text-lg"
            title="Hide"
            onClick={() => setShow(false)}
          >
            <RiMenuFoldLine variant="primary" style={{ fontSize: 20 }} />
          </button>
        </div>

        {conversations?.map((conversation) => (
          <Link
            key={conversation.id}
            className={cn(
              "flex cursor-pointer items-center rounded-md p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              conversation.id == query.id &&
                "bg-gray-100 font-semibold text-gray-600"
            )}
            href={`/conversations/${conversation.id}`}
          >
            <ChatIcon size={20} className="inline flex-shrink-0" />
            <div className="truncate">&nbsp;&nbsp;{conversation.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
