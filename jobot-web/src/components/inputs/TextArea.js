import classNames from "classnames";

import TextAreaAutosize from "react-textarea-autosize";

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
      className="block text-sm font-medium leading-6 text-gray-900"
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
          "block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
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

export default TextArea;
