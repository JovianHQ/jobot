import Navbar from "@/components/Navbar";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TextAreaAutosize from "react-textarea-autosize";

const TextInput = ({
  field,
  placeholder,
  label,
  value,
  onChange,
  required,
}) => (
  <div className="mt-4">
    <label
      htmlFor={field}
      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="mt-2 mb-4">
      <input
        type="text"
        name={field}
        id={field}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-gray-300 sm:text-sm sm:leading-6"
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

const TextArea = ({
  field,
  label,
  placeholder,
  value,
  onChange,
  code,
  required,
}) => (
  <div>
    <label
      htmlFor={field}
      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="mt-2 mb-4">
      <TextAreaAutosize
        minRows={4}
        maxRows={12}
        name={field}
        id={field}
        className={classNames(
          code && "font-mono",
          "block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:text-gray-300",
          " placeholder:text-gray-400 focus:ring-2 focus:ring-inset ",
          " focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
        )}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

export default function BuildPage() {
  const supabase = useSupabaseClient();
  const user = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to build a skill");
      return;
    }
    try {
      const skillData = {
        title: inputData.title,
        slug: inputData.slug,
        description: inputData.description,
        system_prompt: inputData.system_prompt,
        user_prompt: inputData.user_prompt,
        inputs: JSON.parse(inputData.inputs),
        user_id: user.id,
      };

      const { data, error } = await supabase.from("skills").insert(skillData);

      if (error) {
        throw error;
      }

      console.log("Skill created successfully:", data);
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  }

  const [inputData, setInputData] = useState({});

  const makeOnChange = (field) => (e) =>
    setInputData({ ...inputData, [field]: e.target.value });

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
            <form>
              <TextInput
                field="title"
                placeholder="Email Generator"
                label="Title"
                required
                value={inputData.title}
                onChange={makeOnChange("title")}
              />
              <TextInput
                field="slug"
                placeholder="email-generator"
                label="URL Slug"
                required
                value={inputData.slug}
                onChange={makeOnChange("slug")}
              />
              <TextArea
                field="description"
                placeholder="Enter a description here"
                label="Description"
                required
                value={inputData.description}
                onChange={makeOnChange("description")}
              />
              <TextArea
                field="system_prompt"
                placeholder="Enter a system prompt here"
                label="System Prompt"
                required
                value={inputData.system_prompt}
                onChange={makeOnChange("system_prompt")}
                code
              />
              <TextArea
                field="user_prompt"
                placeholder="Enter a user prompt here"
                label="User Prompt"
                required
                value={inputData.user_prompt}
                onChange={makeOnChange("user_prompt")}
                code
              />
              <TextArea
                field="inputs"
                placeholder="List the inputs here"
                label="Input Fields"
                required
                value={inputData.inputs}
                onChange={makeOnChange("inputs")}
                code
              />
              <div className="mt-4">
                <input
                  type="submit"
                  value="Create Skill"
                  onClick={handleSubmit}
                  className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
