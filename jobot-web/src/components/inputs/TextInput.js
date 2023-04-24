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
      className="block text-sm font-medium leading-6 text-gray-900 "
    >
      {label}
    </label>
    <div className="mt-2 mb-4">
      <input
        type="text"
        name={field}
        id={field}
        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

export default TextInput;
