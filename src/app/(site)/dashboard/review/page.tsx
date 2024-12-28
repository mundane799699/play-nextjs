"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Mail, Shuffle, Settings, X } from "lucide-react";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import Image from "next/image";

interface Note {
  reviewId: string;
  bookName: string;
  chapterName?: string;
  noteContent: string;
  markText: string;
  noteTime: number;
}

// Membership Dialog Component
const MembershipDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">开通会员</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 rounded" />
              </div>
              <div>
                <h3 className="font-medium">每日回顾推送到邮箱</h3>
                <p className="text-gray-500 text-sm">让回顾释放阅读的价值</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-orange-500 rounded" />
              </div>
              <div>
                <h3 className="font-medium">同步笔记不限数量</h3>
                <p className="text-gray-500 text-sm">普通用户最大1000个</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex justify-center items-baseline space-x-1 text-center">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-[#ff6b24]">¥9</span>
              <span className="text-gray-500">/月</span>
            </div>
            <span className="text-gray-400 mx-2">·</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm line-through text-gray-400">¥99</span>
              <span className="text-2xl font-bold text-[#ff6b24]">¥68</span>
              <span className="text-gray-500">/年</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p>扫码付款，开通会员</p>
            <p className="text-sm text-gray-500">付款成功后，小助理会添加你为会员用户</p>
            <p className="text-sm text-gray-500">微信联系：77213305</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Replace with actual QR code */}
              <div className="text-gray-400">QR Code</div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>谢谢你的支持</p>
            <p>激励我们不断完善这一产品</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Dialog Component
const SettingsDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Review Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">回顾范围</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
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
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                {reviewOptions.map(option => (
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
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Pro Button */}
            <button
              onClick={() => setShowMembership(true)}
              className="w-full py-3 bg-[#ff6b24] text-white rounded-md hover:bg-[#ff6b24]/90 transition font-medium"
            >
              8￥开通会员立享邮箱回顾
            </button>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center">
              因为邮箱发送需要服务器成本，故收取成本费用，后续为会员用户提供更多服务，感谢支持
            </p>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#14161a] text-white rounded-md hover:bg-[#14161a]/90 transition"
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
const ShareDialog = ({ isOpen, onClose, note }: { isOpen: boolean; onClose: () => void; note: Note }) => {
  const [selectedColor, setSelectedColor] = useState("bg-gradient-to-br from-pink-400 to-purple-500");
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">分享书摘</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="mb-6">
          <div
            ref={cardRef}
            className={`${selectedColor} w-full min-h-[200px] rounded-lg p-8 flex flex-col justify-between`}
            style={{ minHeight: 'max-content' }}
          >
            <div className={`text-white space-y-4 ${selectedFont}`}>
              <div className="text-lg leading-relaxed break-words whitespace-pre-wrap">{note.markText}</div>
              <div className="text-sm opacity-80">
                /{note.bookName}
                <br />
                {note.chapterName}
              </div>
            </div>
            <div className="text-white/70 text-sm mt-4">
              - Created by Readecho -
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">背景颜色</label>
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
                  className={`${color} w-8 h-8 rounded-full ${
                    selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">字体</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {[
                "寒蝉活楷体",
                "思源黑体",
                "霞鹜文楷",
                "得意黑",
              ].map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-black text-white rounded-md hover:bg-black/90 transition"
          >
            下载图片
          </button>
        </div>
      </div>
    </div>
  );
};

// 示例数据
const sampleNotes: Note[] = [
  {
    reviewId: "1",
    bookName: "少有人走的路",
    chapterName: "自律篇",
    noteContent: "生活中的很多不适都源于我们的懒惰和放纵。自律不是束缚，而是通向自由的道路。",
    markText: "最好的药物是忙碌，最好的医生是睡眠，最好的疗愈是读书，最好的爱情是自爱，最好的自爱是自律。",
    noteTime: dayjs().unix(),
  },
  {
    reviewId: "2",
    bookName: "认知觉醒",
    chapterName: "深度思考",
    noteContent: "深度思考是一种能力，也是一种习惯。它能帮助我们看清事物的本质，做出更好的决策。",
    markText: "人与人最大的差距不是知识，而是认知。认知决定了我们看待世界的方式，也决定了我们的选择和行动。",
    noteTime: dayjs().unix(),
  },
  {
    reviewId: "3",
    bookName: "原则",
    chapterName: "生活原则",
    noteContent: "拥抱现实，直面问题。只有这样，我们才能找到真正的解决方案。",
    markText: "痛苦 + 反思 = 进步。每一次失败都是一次学习的机会，关键是要从中吸取教训并改进。",
    noteTime: dayjs().unix(),
  }
];

const ReviewPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get('bookId');
      
      if (!bookId) {
        // 如果没有bookId，使用示例数据
        setNotes(sampleNotes);
        setCurrentNote(sampleNotes[Math.floor(Math.random() * sampleNotes.length)]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/notes?bookId=${bookId}`, {
          method: "GET",
        });
        
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error('Failed to fetch notes');
        }
        
        const { code, rows } = await response.json();
        if (code === 200) {
          const filteredNotes = rows.filter((item: any) => item.markText);
          if (filteredNotes.length > 0) {
            setNotes(filteredNotes);
            const randomIndex = Math.floor(Math.random() * filteredNotes.length);
            setCurrentNote(filteredNotes[randomIndex]);
          } else {
            // 如果没有笔记，使用示例数据
            setNotes(sampleNotes);
            setCurrentNote(sampleNotes[Math.floor(Math.random() * sampleNotes.length)]);
          }
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        // 发生错误时使用示例数据
        setNotes(sampleNotes);
        setCurrentNote(sampleNotes[Math.floor(Math.random() * sampleNotes.length)]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleRandomNote = () => {
    if (notes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * notes.length);
    setCurrentNote(notes[randomIndex]);
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
        <div className="h-8 w-8 rounded-lg bg-stone-200/50"></div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowShareDialog(true)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition"
          >
            <Share2 className="w-5 h-5" />
            <span>分享</span>
          </button>
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition"
          >
            <Mail className="w-5 h-5" />
            <span>邮箱回顾<span className="text-[#ff6b24] ml-1">(Pro)</span></span>
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
                &ldquo;{currentNote.markText}&rdquo;
              </blockquote>
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
    </div>
  );
};

export default ReviewPage;
