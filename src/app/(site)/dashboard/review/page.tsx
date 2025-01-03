"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Mail, Shuffle, Settings, X } from "lucide-react";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import Image from "next/image";
import { getRandomReview } from "@/services/notes";
import Modal from "@/components/DashBoard/Modal";

interface Note {
  reviewId: string;
  bookName: string;
  chapterName?: string;
  noteContent: string;
  markText: string;
  noteTime: number;
}

// Membership Dialog Component
const MembershipDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">开通会员</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <div className="h-4 w-4 rounded bg-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">每日回顾推送到邮箱</h3>
                <p className="text-sm text-gray-500">让回顾释放阅读的价值</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <div className="h-4 w-4 rounded bg-orange-500" />
              </div>
              <div>
                <h3 className="font-medium">同步笔记不限数量</h3>
                <p className="text-sm text-gray-500">普通用户最大1000个</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-center space-x-1 text-center">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-[#ff6b24]">¥9</span>
              <span className="text-gray-500">/月</span>
            </div>
            <span className="mx-2 text-gray-400">·</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-400 line-through">¥99</span>
              <span className="text-2xl font-bold text-[#ff6b24]">¥68</span>
              <span className="text-gray-500">/年</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-center">
            <p>扫码付款，开通会员</p>
            <p className="text-sm text-gray-500">
              付款成功后，小助理会添加你为会员用户
            </p>
            <p className="text-sm text-gray-500">微信联系：77213305</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gray-100">
              {/* Replace with actual QR code */}
              <div className="text-gray-400">QR Code</div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="space-y-1 text-center text-sm text-gray-500">
            <p>谢谢你的支持</p>
            <p>激励我们不断完善这一产品</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Dialog Component
const SettingsDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedBook, setSelectedBook] = useState("全部笔记");
  const [reviewCount, setReviewCount] = useState("5");
  const [email, setEmail] = useState("user@example.com");
  const [showMembership, setShowMembership] = useState(false);

  if (!isOpen) return null;

  const reviewOptions = [
    { value: "5", label: "5条/天" },
    { value: "10", label: "10条/天" },
    { value: "20", label: "20条/天" },
  ];

  const handleSave = () => {
    // TODO: Save settings
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-medium">邮箱回顾（Beta）</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Review Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">回顾范围</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              >
                <option value="全部笔记">全部笔记</option>
                <option value="少有人走的路">少有人走的路</option>
                <option value="认知觉醒">认知觉醒</option>
              </select>
            </div>

            {/* Review Count */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">回顾数量</label>
              <select
                value={reviewCount}
                onChange={(e) => setReviewCount(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              >
                {reviewOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Settings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Pro Button */}
            <button
              onClick={() => setShowMembership(true)}
              className="w-full rounded-md bg-[#ff6b24] py-3 font-medium text-white transition hover:bg-[#ff6b24]/90"
            >
              8￥开通会员立享邮箱回顾
            </button>

            {/* Description */}
            <p className="text-center text-sm text-gray-500">
              因为邮箱发送需要服务器成本，故收取成本费用，后续为会员用户提供更多服务，感谢支持
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 border-t p-4">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-gray-600 transition hover:bg-gray-100"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-[#14161a] px-4 py-2 text-white transition hover:bg-[#14161a]/90"
            >
              保存
            </button>
          </div>
        </div>
      </div>

      <MembershipDialog
        isOpen={showMembership}
        onClose={() => setShowMembership(false)}
      />
    </>
  );
};

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

const ReviewPage = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    handleRandomNote();
  }, []);

  const handleRandomNote = () => {
    getRandomReview()
      .then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          const { readCount, totalCount, note, allFinished } = data;
          if (totalCount === 0) {
            setCurrentNote(null);
          } else if (allFinished) {
            setIsModalOpen(true);
          } else {
            setCurrentNote(note);
            setReadCount(readCount);
            setTotalCount(totalCount);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>;
  }

  if (!currentNote) {
    return <div className="p-8 text-center text-gray-500">暂无笔记</div>;
  }

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
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            回顾进度：{readCount}/{totalCount}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowShareDialog(true)}
            className="flex items-center space-x-1 text-gray-600 transition hover:text-gray-900"
          >
            <Share2 className="h-5 w-5" />
            <span>分享</span>
          </button>
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="flex items-center space-x-1 text-gray-600 transition hover:text-gray-900"
          >
            <Mail className="h-5 w-5" />
            <span>
              邮箱回顾<span className="ml-1 text-[#ff6b24]">(Pro)</span>
            </span>
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-1 items-center justify-center px-8 md:px-16 lg:px-32">
        <div className="mx-auto w-full max-w-5xl">
          {/* 内容卡片 */}
          <div className="rounded-lg bg-white/80 p-12 shadow-sm backdrop-blur-sm">
            <div className="mb-12">
              {currentNote.markText && (
                <div className="mb-8 flex ">
                  <div className="mr-3 w-1 bg-gray-300"></div>
                  <blockquote className="text-lg italic text-gray-700">
                    &ldquo;{currentNote.markText}&rdquo;
                  </blockquote>
                </div>
              )}
              <div className="leading-relaxed text-gray-800">
                {currentNote.noteContent}
              </div>
              {currentNote.chapterName && (
                <div className="mt-4 text-sm text-gray-500">
                  —— {currentNote.chapterName}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-gray-600">
                <span className="text-sm">{currentNote.bookName}</span>
                <span className="text-gray-400">|</span>
                <span className="text-sm">
                  {dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          </div>

          {/* 随机按钮 */}
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={handleRandomNote}
              className="flex items-center gap-2 rounded-full bg-white/80 px-6 py-2 shadow-sm transition-all hover:bg-white"
            >
              <Shuffle className="h-4 w-4" />
              随机回顾
            </button>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        note={currentNote}
      />
      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />

      <Modal
        isOpen={isModalOpen}
        onConfirm={() => {
          handleRandomNote();
          setIsModalOpen(false);
        }}
        title="提示"
        content="所有笔记都已回顾完，已全部重置回未读状态"
      />
    </div>
  );
};

export default ReviewPage;
