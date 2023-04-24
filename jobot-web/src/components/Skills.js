import { makeDisplayName } from "@/utils";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

async function getSkills(supabase) {
  try {
    const { data, error } = await supabase.from("skills").select(`
        *,
        profiles (
          username,
          first_name,
          last_name
        )
      `);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    toast.error("Failed to get skills");
    console.error("Failed to get skills", error);
    return [];
  }
}

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    getSkills(supabase).then(setSkills);
  }, [setSkills, supabase]);

  return (
    <div className="px-2 pb-6">
      <div className="mx-auto max-w-4xl overflow-y-auto w-full">
        <ul
          role="list"
          className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((skill) => (
            <li
              className="group col-span-1 cursor-pointer divide-y divide-gray-200 rounded-lg border bg-white hover:shadow"
              key={skill.slug}
            >
              <Link href={`/${skill.profiles.username}/${skill.slug}`}>
                <div className="flex h-full w-full flex-col p-5">
                  <div>
                    {skill.iconUrl && (
                      <span className="inline-flex rounded-lg">
                        <Image
                          src={skill.iconUrl}
                          width={32}
                          height={32}
                          className="h-8 w-8"
                          alt={skill.title}
                          unoptimized
                        />
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-gray-500 font-medium text-sm">
                    {makeDisplayName(skill.profiles)}
                  </div>
                  <h3 className="mt-2 truncate text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {skill.title}
                  </h3>

                  <p className="mt-1 text-gray-500 flex-1">
                    {skill.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Skills;
