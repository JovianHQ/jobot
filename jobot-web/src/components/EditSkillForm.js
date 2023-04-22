import { isJson } from "@/utils";
import SlugInput from "./inputs/SlugInput";
import TextArea from "./inputs/TextArea";
import TextInput from "./inputs/TextInput";

export function EditSkillForm({ skillData, setSkillData, onSubmit, editMode }) {
  const makeOnChange = (field) => (e) =>
    setSkillData({ ...skillData, [field]: e.target.value });

  return (
    <form>
      <TextInput
        field="title"
        placeholder="Email Generator"
        label="Title"
        required
        value={skillData.title}
        onChange={makeOnChange("title")}
      />
      <SlugInput
        field="slug"
        placeholder="email-generator"
        label="URL Slug"
        required
        value={skillData.slug}
        onChange={makeOnChange("slug")}
      />
      <TextArea
        field="description"
        placeholder="Enter a description here"
        label="Description"
        required
        value={skillData.description}
        onChange={makeOnChange("description")}
      />
      <TextArea
        field="system_prompt"
        placeholder="Enter a system prompt here"
        label="System Prompt"
        required
        value={skillData.system_prompt}
        onChange={makeOnChange("system_prompt")}
        code
      />
      <TextArea
        field="user_prompt"
        placeholder="Enter a user prompt here"
        label="User Prompt"
        required
        value={skillData.user_prompt}
        onChange={makeOnChange("user_prompt")}
        code
      />
      <TextArea
        field="inputs"
        placeholder="List the inputs here"
        label="Input Fields"
        required
        value={
          isJson(skillData.inputs)
            ? JSON.stringify(skillData.inputs, null, 2)
            : skillData.inputs
        }
        onChange={makeOnChange("inputs")}
        code
      />
      <div className="mt-4 flex justify-between">
        <input
          type="submit"
          value={editMode ? "Save Skill" : "Create Skill"}
          onClick={onSubmit}
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
        />

        {editMode && (
          <button
            onClick={() => alert("Not implemented")}
            type="submit"
            className="ml-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
          >
            Delete Skill
          </button>
        )}
      </div>
    </form>
  );
}
