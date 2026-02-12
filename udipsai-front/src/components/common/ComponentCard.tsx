interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  action?: React.ReactNode;
  bodyDisabled?: boolean;
  onHeaderClick?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  action,
  bodyDisabled = false,
  onHeaderClick,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all duration-300 ${
        bodyDisabled ? "opacity-90 shadow-none saturate-50" : "shadow-sm"
      } ${className}`}
    >
      <div
        onClick={onHeaderClick}
        className={`px-6 py-5 flex items-center justify-between transition-colors duration-300 ${
          onHeaderClick ? "cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02]" : ""
        } ${!bodyDisabled && "border-b border-gray-100 dark:border-gray-800"}`}
      >
        <div>
          <h3
            className={`text-base font-semibold transition-colors duration-300 ${
              bodyDisabled
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-800 dark:text-white/90"
            }`}
          >
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {action && (
          <div
            className="flex-shrink-0 ml-4"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
          </div>
        )}
      </div>

      {!bodyDisabled && (
        <div className="p-4 sm:p-6 animate-in fade-in zoom-in-100 duration-300">
          <div className="space-y-6">{children}</div>
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
