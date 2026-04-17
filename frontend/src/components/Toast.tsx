export const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="flex font-label items-center justify-between gap-3 px-4 py-3.5 rounded-lg min-w-[280px] max-w-md bg-gray-200 border border-none shadow-xl"
      role="alert"
    >
      <span className="text-xs font-semibold text-gray-900">{message}</span>

      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="flex items-center justify-center w-5 h-5 shrink-0 rounded transition-colors text-gray-500 hover:text-gray-800"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 2L12 12M12 2L2 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};
