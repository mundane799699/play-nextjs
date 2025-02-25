import React from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal = ({
  isOpen,
  onClose,
  title = "提示",
  message,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
}: ModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2">
        {/* Title */}
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>

        {/* Message */}
        <p className="mb-6 text-base text-body-color dark:text-dark-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-body-color transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
