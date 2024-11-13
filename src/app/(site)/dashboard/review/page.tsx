"use client";

import React, { useState } from "react";
import { Share2, Settings, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Note {
  id: number;
  bookName: string;
  author: string;
  quote: string;
  note: string;
  source?: string;
}

// 示例数据
const sampleNotes: Note[] = [
  {
    id: 1,
    bookName: "少有人走的路",
    author: "M·斯科特·派克",
    quote:
      "最好的药物是忙碌，最好的医生是睡眠，最好的疗愈是读书，最好的爱情是自爱，最好的自爱是自律。",
    note: "生活中的很多不适都源于我们的懒惰和放纵。自律不是束缚，而是通向自由的道路。",
    source: "心智成熟的旅程",
  },
  // 可以添加更多示例数据
];

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[480px] max-w-[90vw] rounded-lg bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ShareDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="分享书摘">
      <div className="space-y-6">
        <div>
          <div className="mb-3 text-sm text-gray-500">字体</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              "bg-purple-400",
              "bg-blue-400",
              "bg-emerald-400",
              "bg-orange-400",
              "bg-indigo-400",
              "bg-yellow-400",
              "bg-cyan-400",
              "bg-pink-400",
            ].map((color, i) => (
              <div
                key={i}
                className={`h-12 w-12 rounded-full ${color} cursor-pointer`}
              ></div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">字体</div>
          <select className="w-full rounded-lg border p-2">
            <option>蒙娜丽莎体</option>
          </select>
        </div>
        <button className="w-full rounded-lg bg-gray-900 py-3 text-white">
          下载图片
        </button>
      </div>
    </Dialog>
  );
};

const SettingsDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="每日回顾设置">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">回顾范围</div>
          <select className="w-full rounded-lg border p-2">
            <option>全部笔记</option>
          </select>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">回顾数量</div>
          <input
            type="text"
            className="w-full rounded-lg border p-2"
            defaultValue="5条/天"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">推送到邮箱</div>
          <div className="flex gap-2">
            <input
              type="time"
              className="flex-1 rounded-lg border p-2"
              defaultValue="07:00"
            />
            <span className="flex items-center rounded bg-orange-500 px-2 text-sm text-white">
              Pro
            </span>
          </div>
          <div className="text-xs text-gray-400">
            每天按照设定时间推送到选定已绑定的邮箱：12345@qq.com
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg border py-2">取消</button>
          <button className="flex-1 rounded-lg bg-gray-900 py-2 text-white">
            确定
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const ReviewPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  return (
    <div
      className="bg-stone-100 p-4"
      style={{
        backgroundImage: `
          linear-gradient(rgba(245, 242, 236, 0.9), rgba(245, 242, 236, 0.9)),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none' stroke='%23D2C6B5' stroke-width='0.5'/%3E%3C/svg%3E")
        `,
      }}
    >
      {/* 顶部工具栏 */}
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="h-8 w-8 rounded-lg bg-stone-200/50"></div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowShareDialog(true)}
            className="rounded-full p-2 transition-colors hover:bg-stone-200/50"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="rounded-full p-2 transition-colors hover:bg-stone-200/50"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-1 items-center justify-center px-8 md:px-16 lg:px-32">
        <div className="mx-auto w-full max-w-5xl">
          {/* 内容卡片 */}
          <div className="rounded-lg bg-white/80 p-12 shadow-sm backdrop-blur-sm">
            <div className="mb-12">
              <blockquote className="mb-8 text-lg italic text-gray-700">
                "{sampleNotes[currentIndex].quote}"
              </blockquote>
              <div className="leading-relaxed text-gray-800">
                {sampleNotes[currentIndex].note}
              </div>
              {sampleNotes[currentIndex].source && (
                <div className="mt-4 text-sm text-gray-500">
                  —— {sampleNotes[currentIndex].source}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-gray-600">
                <span className="text-sm">
                  {sampleNotes[currentIndex].bookName}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-sm">
                  {sampleNotes[currentIndex].author}
                </span>
              </div>
            </div>
          </div>

          {/* 导航区域 */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className={`rounded-full bg-white/80 p-2 shadow-sm transition-all
                ${currentIndex === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white"}`}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <div className="min-w-[3rem] text-center font-serif text-sm text-gray-500">
              {currentIndex + 1} / {sampleNotes.length}
            </div>

            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(sampleNotes.length - 1, i + 1))
              }
              disabled={currentIndex === sampleNotes.length - 1}
              className={`rounded-full bg-white/80 p-2 shadow-sm transition-all
                ${currentIndex === sampleNotes.length - 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white"}`}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />
    </div>
  );
};

export default ReviewPage;
