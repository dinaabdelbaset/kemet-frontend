import type { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
  value?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

const Input = ({
  type,
  name,
  value,
  id,
  placeholder,
  className,
  label,
  error,
  ...res
}: IProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        id={id || name}
        className={`text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
          ${error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
          }
          ${className}`}
        {...res}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
