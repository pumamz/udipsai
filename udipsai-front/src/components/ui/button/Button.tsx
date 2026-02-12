import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "danger" | "warning" | "success" | "info" | "default"; 
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  title,
  type = "button",
}) => {
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-brand-400 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    danger:
      "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-red-500 hover:text-white p-2 text-center text-red-500 dark:text-red-400 dark:hover:text-red-500",
    warning:
      "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:text-yellow-600 p-2 text-center text-gray-600 dark:text-gray-400 dark:hover:text-yellow-600",
    success:
      "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:text-green-600 p-2 text-center text-gray-600 dark:text-gray-400 dark:hover:text-green-600",
    info:
      "ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:text-blue-500 p-2 text-center text-gray-600 dark:text-gray-400 dark:hover:text-blue-500",
    default:
      "hover:text-red-600 p-2 text-center text-gray-600 dark:text-gray-400 dark:hover:text-red-600",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
