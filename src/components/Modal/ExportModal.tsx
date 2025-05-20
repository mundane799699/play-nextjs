import React, { useState } from "react";
import { X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "excel" | "markdown") => void;
}

const ExportModal = ({ isOpen, onClose, onExport }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<"excel" | "markdown">("excel");

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">导出笔记</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="excel"
              name="exportFormat"
              checked={selectedFormat === "excel"}
              onChange={() => setSelectedFormat("excel")}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="excel" className="ml-2 text-gray-700">
              导出为Excel表格
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="markdown"
              name="exportFormat"
              checked={selectedFormat === "markdown"}
              onChange={() => setSelectedFormat("markdown")}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="markdown" className="ml-2 text-gray-700">
              导出为Markdown文档
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            确定导出
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 