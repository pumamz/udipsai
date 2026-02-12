import React from "react";
import { Modal } from "./index";
import Button from "../button/Button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  description = "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-red-50 p-3 text-red-500 dark:bg-red-500/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16H12.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full justify-center"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="w-full justify-center bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
