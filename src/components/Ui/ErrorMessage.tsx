interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md flex items-center gap-2 animate-pulse">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
