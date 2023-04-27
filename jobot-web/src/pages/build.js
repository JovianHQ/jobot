import { EditSkillForm } from "@/components/EditSkillForm";
import Navbar from "@/components/Navbar";
import { fetchUserProfile } from "@/network";
import { useLoginDialog } from "@/utils";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function BuildPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { setLoginOpen } = useLoginDialog();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      toast("Please log in to send a message");
      setLoginOpen(true);
      return;
    }

    const userProfile = await fetchUserProfile(supabase, user);

    try {
      const newSkill = {
        title: skillData.title,
        slug: skillData.slug,
        description: skillData.description,
        system_prompt: skillData.system_prompt,
        user_prompt: skillData.user_prompt,
        inputs: JSON.parse(skillData.inputs),
        user_id: user.id,
      };

      const { error } = await supabase.from("skills").insert(newSkill);

      if (error) {
        throw error;
      }

      toast.success("Skill created successfully");
      router.push(`${userProfile.username}/${skillData.slug}`);
    } catch (error) {
      toast.error("Error in creating skill:", error.message);
      console.error("Error creating skill:", error.message);
    }
  }

  const [skillData, setSkillData] = useState({});

  return (
    <>
      <Head>
        <title>Build a Skill - Jobot</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="px-2 flex-1 overflow-y-auto">
          <div className="mx-auto my-4 w-full max-w-4xl">
            <h1 className="text-center mx-auto text-4xl font-medium">
              Build a Skill
            </h1>
            <div className="mx-auto mt-4 mb-4 max-w-xl text-center text-gray-500 sm:text-base">
              Create a shareable and reusable skill
            </div>
            <EditSkillForm
              skillData={skillData}
              setSkillData={setSkillData}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
