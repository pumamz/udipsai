import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-300 transform scale-100 flex flex-col overflow-hidden max-h-[90vh]";

  const paddingRegex = /\bp[xyzbtr]?-[^ ]+/g;
  const paddingClasses = className?.match(paddingRegex)?.join(" ") || "p-6";
  const shellClasses = className?.replace(paddingRegex, "").trim() || "";

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 modal z-[99999]">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses} ${shellClasses} mt-auto mb-auto transition-all duration-300 transform scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-[1000] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100/80 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
          <div className={`${paddingClasses} pr-7 sm:pr-9`}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
