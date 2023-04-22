import { useState } from "react";
import SkillInput from "./SkillInput";

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

      <div>
        <button
          type="button"
          onClick={startConversation}
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
};

export default SkillForm;
