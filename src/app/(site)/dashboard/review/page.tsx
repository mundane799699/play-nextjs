"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Mail, Shuffle, Settings, X, Copy, Check } from "lucide-react";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import Image from "next/image";
import { getRandomReview } from "@/services/notes";
import Modal from "@/components/DashBoard/Modal";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState("全部笔记");
  const [reviewCount, setReviewCount] = useState("5");
  const [email, setEmail] = useState("");
  const [showMembership, setShowMembership] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

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
            <h2 className="text-lg font-medium">邮箱回顾（开发中）</h2>
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
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = async () => {
    if (!currentNote) return;
    
    const textToCopy = `${currentNote.markText ? currentNote.markText + '\n\n' : ''}${currentNote.noteContent}\n\n${currentNote.chapterName || ''}\n${currentNote.bookName}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>;
  }

  if (!currentNote) {
    return <div className="p-8 text-center text-gray-500">暂无笔记</div>;
  }

  return (
    <div className="p-4">
      {/* 顶部工具栏 */}
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="text-xs sm:text-sm text-gray-500">
            回顾进度：{readCount}/{totalCount}
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="flex items-center p-1.5 sm:p-0 text-gray-600 transition hover:text-gray-900"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">
              邮箱回顾<span className="ml-1 text-[#ff6b24]">(开发中)</span>
            </span>
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-1 items-center justify-center px-1 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto w-full max-w-5xl">
          {/* 内容卡片 */}
          <div className="relative rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setShowShareDialog(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group inline-flex items-center justify-center relative"
                aria-label="分享"
              >
                <Share2 className="h-5 w-5" strokeWidth={1.5} />
                <div className="absolute inset-0 cursor-pointer" onClick={() => setShowShareDialog(true)} />
                <span className="absolute hidden group-hover:block -top-8 -left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  分享笔记
                </span>
              </button>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group inline-flex items-center justify-center relative"
                aria-label={isCopied ? "已复制" : "复制内容"}
              >
                {isCopied ? 
                  <Check className="h-5 w-5" strokeWidth={1.5} /> : 
                  <Copy className="h-5 w-5" strokeWidth={1.5} />
                }
                <div className="absolute inset-0 cursor-pointer" onClick={handleCopy} />
                <span className="absolute hidden group-hover:block -top-8 -left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {isCopied ? '已复制!' : '复制内容'}
                </span>
              </button>
            </div>
            <div className="flex flex-col">
              {/* 标记的文本 */}
              {currentNote.markText && (
                <div className="relative pl-4 mb-4 sm:mb-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
                  <blockquote className="text-sm sm:text-lg font-medium text-gray-700">
                    {currentNote.markText}
                  </blockquote>
                </div>
              )}

              {/* 笔记内容 */}
              <div>
                <div className="text-xs sm:text-base leading-relaxed text-gray-800">
                  {currentNote.noteContent}
                </div>
                {currentNote.chapterName && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                    {currentNote.chapterName}
                  </div>
                )}
              </div>

              {/* 书籍信息 */}
              <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 text-xs sm:text-sm border-t border-gray-100">
                <span className="font-medium text-gray-900">{currentNote.bookName}</span>
                <span className="text-gray-500">
                  {dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          </div>

          {/* 随机按钮 */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center">
            <button
              onClick={handleRandomNote}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-2 text-xs sm:text-sm shadow-sm transition-all hover:bg-white"
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
