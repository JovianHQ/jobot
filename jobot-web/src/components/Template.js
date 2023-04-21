import { mustache } from "modules/jobot-page/utils/index";
import { useState } from "react";
import TemplateInput from "./TemplateInput";

function combinePrompts(systemPrompt, userPrompt) {
  return `${systemPrompt}\n\n${userPrompt}`;
}

const Template = ({ template, onSubmit }) => {
  const [inputData, setInputData] = useState({});

  const fullPrompt = combinePrompts(template.systemPrompt, template.userPrompt);
  const inputs = template.inputs || [];
  const hasInputs = inputs.length > 0;

  const filledPrompt = hasInputs ? mustache(fullPrompt, inputData) : fullPrompt;

  if (!template) {
    return <div>Not Found</div>;
  }

  return (
    <div className="mx-auto my-4 w-full max-w-4xl px-2">
      <h1 className="text-center">{template.title}</h1>
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
          onClick={() => onSubmit(filledPrompt)}
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
};

export default Template;
