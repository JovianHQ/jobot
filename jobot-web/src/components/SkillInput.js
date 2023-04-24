import classNames from "classnames";

const SkillInput = ({
  field,
  title,
  placeholder,
  type,
  value,
  onChange,
  options = [],
}) => {
  switch (type) {
    case "textarea":
    case "code":
      return (
        <div>
          <label
            htmlFor={field}
            className="block text-sm font-medium leading-6 text-gray-900 "
          >
            {title}
          </label>
          <div className="mt-2 mb-4">
            <textarea
              rows={4}
              name={field}
              id={field}
              className={classNames(
                type === "code" && "font-mono",
                "block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ",
                " placeholder:text-gray-400 focus:ring-2 focus:ring-inset ",
                " focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
              )}
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <label
            htmlFor={field}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {title}
          </label>
          <select
            id={field}
            name={field}
            className="mt-2 block w-full rounded-md border-0 px-2 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select an Option</option>
            {options.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return (
        <div>
          <label
            htmlFor={field}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {title}
          </label>
          <div className="mt-2 mb-4">
            <input
              type={type}
              name={field}
              id={field}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder={placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      );
  }
};

export default SkillInput;
