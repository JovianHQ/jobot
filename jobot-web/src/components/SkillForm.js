import { useState } from "react";
import SkillInput from "./SkillInput";
import { makeDisplayName } from "@/utils";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export function fillTemplate(string, data = {}) {
  return Object.entries(data).reduce((res, [key, value]) => {
    // lookbehind expression, only replaces if mustache was not preceded by a backslash
    const mainRe = new RegExp(`(?<!\\\\){{\\s*${key}\\s*}}`, "g");
    // this regex is actually (?<!\\){{\s*<key>\s*}} but because of escaping it looks like that...
    const escapeRe = new RegExp(`\\\\({{\\s*${key}\\s*}})`, "g");
    // the second regex now handles the cases that were skipped in the first case.
    return res.replace(mainRe, value.toString()).replace(escapeRe, "$1");
  }, string);
}

const SkillForm = ({ skill, sendMessages }) => {
  const user = useUser();
  const [inputData, setInputData] = useState({});

  const inputs = skill.inputs || [];

  function startConversation() {
    const filledMessages = [
      { role: "system", content: fillTemplate(skill.system_prompt, inputData) },
      { role: "user", content: fillTemplate(skill.user_prompt, inputData) },
    ];

    sendMessages(filledMessages);
  }

  if (!skill) {
    return <div>Not Found</div>;
  }

  return (
    <div className="mx-auto my-4 w-full max-w-4xl px-2">
      <h1 className="text-center mx-auto text-4xl font-medium">
        {skill.title}
      </h1>
      <div className="mx-auto mt-4 mb-4 max-w-xl text-center text-gray-500 sm:text-base">
        {skill.description}
      </div>
      <div>
        {inputs.map((inputInfo) => (
          <SkillInput
            key={inputInfo.field}
            {...inputInfo}
            value={inputData[inputInfo.field]}
            onChange={(value) =>
              setInputData({ ...inputData, [inputInfo.field]: value })
            }
          />
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={startConversation}
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700"
        >
          Start Conversation
        </button>

        {skill.user_id !== user?.id ? (
          <div className="text-gray-500 font-medium text-sm">
            Author: {makeDisplayName(skill.profiles)}
          </div>
        ) : (
          <Link
            href={`/${skill.profiles.username}/${skill.slug}/edit`}
            type="submit"
            className="ml-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
          >
            Edit Skill
          </Link>
        )}
      </div>
    </div>
  );
};

export default SkillForm;
