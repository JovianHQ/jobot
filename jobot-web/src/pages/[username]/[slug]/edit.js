import { EditSkillForm } from "@/components/EditSkillForm";
import Navbar from "@/components/Navbar";
import { isJson } from "@/utils";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function EditSkillPage({ skill }) {
  const [skillData, setSkillData] = useState(skill);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const updatedSkill = {
        title: skillData.title,
        slug: skillData.slug,
        description: skillData.description,
        system_prompt: skillData.system_prompt,
        user_prompt: skillData.user_prompt,
        inputs: isJson(skillData.inputs)
          ? skillData.inputs
          : JSON.parse(skillData.inputs),
        user_id: user.id,
      };

      const { error } = await supabase
        .from("skills")
        .update(updatedSkill)
        .eq("id", skillData.id);

      if (error) {
        throw error;
      }

      toast.success("Skill updated successfully");
      router.push(`/${skill.profiles.username}/${updatedSkill.slug}`);
    } catch (error) {
      toast.error("Failed to update skill:" + error.message);
      console.error("Error updating skill:", error);
    }
  }

  if (!skill) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{`Edit Skill - ${skill.title}`}</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="px-2 flex-1 overflow-y-auto">
          <div className="mx-auto my-4 w-full max-w-4xl">
            <h1 className="text-center mx-auto text-4xl font-medium">
              Build a Skill
            </h1>
            <EditSkillForm
              skillData={skillData}
              setSkillData={setSkillData}
              onSubmit={handleSubmit}
              editMode
            />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const supabase = createServerSupabaseClient(context);
  const slug = context.params.slug;
  const username = context.params.username;

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profiles(username, first_name, last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error || !skills || skills.length == 0) {
    console.error("Failed to fetch skill for slug: " + slug, error);
    return {
      notFound: true,
    };
  }

  const skill = skills[0];

  const {
    data: { user },
    error: e2,
  } = await supabase.auth.getUser();

  if (e2 || user?.id != skill?.user_id) {
    console.error(
      "User is not the author",
      e2,
      "user.id",
      user.id,
      "skill.user_id",
      skill.user_id
    );
    return {
      notFound: true,
    };
  }

  return {
    props: { skill },
  };
}
