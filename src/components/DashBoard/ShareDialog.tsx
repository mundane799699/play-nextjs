import { Note } from "@/types/note";
import { useRef } from "react";
import { X } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";

// Share Dialog Component
const ShareDialog = ({
  isOpen,
  onClose,
  note,
}: {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}) => {
  const [selectedColor, setSelectedColor] = useState(
    "bg-gradient-to-br from-pink-400 to-purple-500",
  );
  const [selectedFont, setSelectedFont] = useState("寒蝉活楷体");
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: null,
        });
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${note.bookName}-笔记.png`;
        link.href = url;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">分享书摘</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="mb-6">
          <div
            ref={cardRef}
            className={`${selectedColor} flex min-h-[200px] w-full flex-col justify-between rounded-lg p-8`}
            style={{ minHeight: "max-content" }}
          >
            <div className={`space-y-4 text-white ${selectedFont}`}>
              <div className="whitespace-pre-wrap break-words text-lg leading-relaxed">
                {note.markText}
              </div>
              <div className="text-sm opacity-80">
                /{note.bookName}
                <br />
                {note.chapterName}
              </div>
            </div>
            <div className="mt-4 text-sm text-white/70">
              - Created by Readecho -
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Color Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">背景颜色</label>
            <div className="grid grid-cols-8 gap-2">
              {[
                "bg-gradient-to-br from-pink-400 to-purple-500",
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "bg-gradient-to-br from-green-400 to-green-600",
                "bg-gradient-to-br from-orange-400 to-red-500",
                "bg-gradient-to-br from-purple-400 to-indigo-500",
                "bg-gradient-to-br from-yellow-400 to-orange-500",
                "bg-gradient-to-br from-cyan-400 to-blue-500",
                "bg-gradient-to-br from-pink-400 to-rose-500",
              ].map((color, index) => (
                <button
                  key={index}
                  className={`${color} h-8 w-8 rounded-full ${
                    selectedColor === color
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">字体</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              {["寒蝉活楷体", "思源黑体", "霞鹜文楷", "得意黑"].map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full rounded-md bg-black py-3 text-white transition hover:bg-black/90"
          >
            下载图片
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
