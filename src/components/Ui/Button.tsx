import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  type?: "button" | "submit" | "reset";
  backgroundColor?: string;
  children: ReactNode;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  backgroundColor = "#EB662B",
  type = "button",
  isLoading = false,
  disabled,
  ...rest
}: IProps) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 text-center capitalize font-medium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 ${className}`}
      style={{ background: backgroundColor }}
      type={type}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
