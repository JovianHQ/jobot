import Navbar from "@/components/Navbar";
import SlugInput from "@/components/inputs/SlugInput";
import TextArea from "@/components/inputs/TextArea";
import TextInput from "@/components/inputs/TextInput";
import { fetchUserProfile } from "@/network";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

async function updateUserProfile(supabase, profileData) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profileData.id);

    if (error) {
      throw error;
    }

    toast.success("Profile updated!");
    return true;
  } catch (e) {
    toast.error("Failed to update profile");
    console.error("Failed to update profile", e);
  }
}

export default function AccountPage() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    fetchUserProfile(supabase, user).then((data) => setProfileData(data));
  }, [supabase, user, setProfileData, router]);

  const makeOnChange = (field) => (e) =>
    setProfileData({ ...profileData, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();

    updateUserProfile(supabase, profileData);
  }

  if (!profileData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Manage Account - Jobot</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="px-2 flex-1 overflow-y-auto">
          <div className="mx-auto my-4 w-full max-w-4xl">
            <h1 className="text-center mx-auto text-4xl font-medium">
              Manage Account
            </h1>
            <form>
              <SlugInput
                field="username"
                label="Username"
                required
                value={profileData.username}
                onChange={makeOnChange("username")}
              />
              <TextInput
                field="first_name"
                label="First Name"
                required
                value={profileData.first_name}
                onChange={makeOnChange("first_name")}
              />

              <TextInput
                field="last_name"
                label="Last Name"
                value={profileData.last_name}
                onChange={makeOnChange("last_name")}
              />

              <TextArea
                field="bio"
                label="Bio"
                value={profileData.bio}
                onChange={makeOnChange("bio")}
              />

              <div className="mt-4 flex justify-between">
                <input
                  type="submit"
                  value="Save"
                  onClick={handleSubmit}
                  className="rounded-md w-20  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
                />
                <Link
                  href="/logout"
                  type="submit"
                  className="ml-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
                >
                  Log Out
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
