import { useState } from "react";
import TemplateInput from "./TemplateInput";

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

const Template = ({ template, sendMessages }) => {
  const [inputData, setInputData] = useState({});

  const inputs = template.inputs || [];

  const filledMessages = [
    { role: "system", content: fillTemplate(template.systemPrompt, inputData) },
    { role: "user", content: fillTemplate(template.userPrompt, inputData) },
  ];

  if (!template) {
    return <div>Not Found</div>;
  }

  return (
    <div className="mx-auto my-4 w-full max-w-4xl px-2">
      <h1 className="text-center mx-auto text-4xl font-medium">
        {template.title}
      </h1>
      <div className="mx-auto mt-4 mb-4 max-w-xl text-center text-gray-500 sm:text-base">
        {template.description}
      </div>
      <div>
        {inputs.map((inputInfo) => (
          <TemplateInput
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
          onClick={() => sendMessages(filledMessages)}
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
};

export default Template;
