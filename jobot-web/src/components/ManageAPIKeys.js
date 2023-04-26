import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

async function createApiKey(supabase, keyData) {
  const { error } = await supabase.from("apikeys").insert(keyData);
  if (error) {
    toast.error("Failed to create API key");
    console.error("Failed to create key", error);
    return false;
  }
  toast.success("API key created");
  return true;
}

async function fetchApiKeys(supabase, user) {
  const { data, error } = await supabase
    .from("apikeys")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.log("Failed to fetch API keys", error);
    toast.error("Failed to fetch API keys. " + error.message);
    return [];
  }
  return data;
}

async function deleteApiKey(supabase, key) {
  console.log("deleting key", key);
  const { error } = await supabase.from("apikeys").delete().eq("key", key);

  if (error) {
    console.log("Failed to delete API key", error);
    toast.error("Failed to delete API key. " + error.message);
    return false;
  }

  toast.success("Deleted API key");
  return true;
}

export default function ManageAPIKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [keyName, setKeyName] = useState("");
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user) {
      fetchApiKeys(supabase, user).then(setApiKeys);
    }
  }, [supabase, user]);

  const handleCreateClick = async () => {
    if (!keyName) {
      toast.error("Enter a key name to create a key");
      return;
    }
    const created = await createApiKey(supabase, {
      name: keyName,
      user_id: user.id,
    });
    if (created) {
      setKeyName("");
      fetchApiKeys(supabase, user).then(setApiKeys);
    }
  };

  const handleDeleteClick = async (key) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this API key?"
    );
    if (confirmed) {
      const deleted = await deleteApiKey(supabase, key);
      if (deleted) {
        fetchApiKeys(supabase, user).then(setApiKeys);
      }
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-2xl font-medium">Manage API Keys</h2>

      <div className="flex mt-4">
        <input
          type="text"
          className="block rounded-md w-80 border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter key name"
          value={keyName || ""}
          onChange={(e) => setKeyName(e.target.value)}
        />
        <button
          className="ml-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
          onClick={handleCreateClick}
        >
          Create New Key
        </button>
      </div>
      <table className="border my-4 border-collapse w-full">
        <tr>
          <th className="border p-2 text-left">Name</th>
          <th className="border p-2 text-left">Key</th>
          <th className="border p-2 text-left">Actions</th>
        </tr>
        {apiKeys?.map((apiKey, idx) => (
          <tr key={idx}>
            <td className="border p-2">{apiKey.name}</td>
            <td className="border p-2">
              <pre>
                ********************
                {apiKey.key.substring(apiKey.key.length - 4)}
              </pre>
            </td>
            <td className="border p-2">
              <CopyToClipboard
                text={apiKey.key}
                onCopy={() => toast.success("Copied to clipboard")}
              >
                <button className="rounded-md bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100">
                  Copy
                </button>
              </CopyToClipboard>
              <button
                className="ml-2 rounded-md bg-white py-1 px-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => handleDeleteClick(apiKey.key)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
