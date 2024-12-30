interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  title: string;
  content: string;
}

export default function Modal({
  isOpen,
  onConfirm,
  title,
  content,
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded-lg bg-white p-6">
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="mb-6 text-gray-600">{content}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
