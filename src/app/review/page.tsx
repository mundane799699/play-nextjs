"use client";

import { useState, useEffect } from "react";
import ShareDialog from "@/components/DashBoard/ShareDialog";
import { fetchUserInfoService } from "@/services/login";
import { getRandomReview } from "@/services/notes";
import { Note } from "@/types/note";
import Link from "next/link";
import {
  Share2,
  Copy,
  Check,
  Shuffle,
  Image,
  Settings,
  ArrowUp,
  Brain,
} from "lucide-react";
import dayjs from "dayjs";
import Modal from "@/components/DashBoard/Modal";
import SettingsDialog from "@/components/DashBoard/SettingsDialog";
import AIInsightModal from "@/components/Modal/AIInsightModal";

const backgrounds = [
  "/images/backgrounds/bg1.png",
  "/images/backgrounds/bg2.png",
  "/images/backgrounds/bg3.png",
  "/images/backgrounds/bg4.png",
  "/images/backgrounds/bg5.jpg",
  "/images/backgrounds/bg6.jpg",
];

console.log("Available backgrounds:", backgrounds);

const Page = () => {
  const [user, setUser] = useState(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteHistory, setNoteHistory] = useState<Note[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [readCount, setReadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAIInsightModal, setShowAIInsightModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(() => {
    const savedBackground = localStorage.getItem("background_index");
    return savedBackground ? parseInt(savedBackground, 10) : 0;
  });
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    console.log("Current background index:", currentBackgroundIndex);
    console.log("Current background URL:", backgrounds[currentBackgroundIndex]);
  }, [currentBackgroundIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("background_index", currentBackgroundIndex.toString());
  }, [currentBackgroundIndex]);

  // 处理登录状态和数据获取
  useEffect(() => {
    handleRandomNote();
  }, []);

  const handleRandomNote = async () => {
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

  const handlePreviousNote = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCurrentNote(noteHistory[historyIndex - 1]);
    }
  };

  const handleNextNote = () => {
    if (historyIndex < noteHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCurrentNote(noteHistory[historyIndex + 1]);
    }
  };

  const handleCopy = async () => {
    if (!currentNote) return;
    const textToCopy = `${currentNote.markText || ""}\n${currentNote.noteContent || ""}\n${currentNote.chapterName || ""}\n${currentNote.bookName || ""}`;
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSwitchBackground = () => {
    setCurrentBackgroundIndex((prev) => {
      const nextIndex = (prev + 1) % backgrounds.length;
      return nextIndex;
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
      className="relative flex h-screen items-center justify-center bg-stone-100"
      style={{
        backgroundImage:
          currentBackgroundIndex === 0
            ? `linear-gradient(rgba(245, 242, 236, 0.9), rgba(245, 242, 236, 0.9)), url("${backgrounds[currentBackgroundIndex]}")`
            : currentBackgroundIndex === 5
              ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("${backgrounds[currentBackgroundIndex]}")`
              : currentBackgroundIndex === 2
                ? `url("${backgrounds[currentBackgroundIndex]}")`
                : currentBackgroundIndex === 3
                  ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("${backgrounds[currentBackgroundIndex]}")`
                  : currentBackgroundIndex === 4
                    ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("${backgrounds[currentBackgroundIndex]}")`
                    : `url("${backgrounds[currentBackgroundIndex]}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 主容器：固定宽度和高度 */}
      <div className="flex h-[580px] w-[1000px] flex-col">
        {/* 内容区：使用 flex-1 自动占据剩余空间 */}
        <div className="flex flex-1 flex-col">
          {/* 内容卡片区域 */}
          <div className="group relative flex flex-1 flex-col items-center justify-center">
            {/* 左上角进度 */}
            <div
              className={`absolute left-1 top-[60px] text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                currentBackgroundIndex === 0
                  ? "text-gray-500"
                  : currentBackgroundIndex === 2
                    ? "text-[#006D11]/90"
                    : currentBackgroundIndex === 3
                      ? "text-white/80"
                      : currentBackgroundIndex === 4
                        ? "text-[#2C3333]"
                        : currentBackgroundIndex === 5
                          ? "text-[#006D11]/90"
                          : "text-white/90"
              }`}
            >
              回顾进度：{readCount}/{totalCount}
            </div>

            {/* 右上角按钮组 */}
            <div
              className={`absolute right-1 top-[40px] flex items-center space-x-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                currentBackgroundIndex === 0
                  ? "text-gray-500"
                  : currentBackgroundIndex === 2
                    ? "text-[#006D11]/90"
                    : currentBackgroundIndex === 3
                      ? "text-white/80"
                      : currentBackgroundIndex === 4
                        ? "text-[#2C3333]"
                        : currentBackgroundIndex === 5
                          ? "text-[#006D11]/90"
                          : "text-white/90"
              }`}
            >
              {currentNote && (
                <button
                  onClick={() => setShowAIInsightModal(true)}
                  className="relative rounded-lg p-2 transition-colors hover:bg-black/10"
                  title="AI洞察分析"
                >
                  <Brain className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 px-0.5 py-0.5 text-xs bg-red-400 text-white rounded-full text-[8px] leading-none">
                    AI
                  </span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="rounded-lg p-2 transition-colors hover:bg-black/10"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setShowShareDialog(true)}
                className="rounded-lg p-2 transition-colors hover:bg-black/10"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* 内容卡片 */}
            {currentBackgroundIndex === 0 ? (
              // 默认背景下的卡片样式
              <div className="mt-8 h-[360px] w-full overflow-auto rounded-lg bg-white/80 p-8 shadow-sm backdrop-blur-sm">
                <div className="flex h-full flex-col">
                  {/* 笔记内容区：flex-1 自动占据剩余空间 */}
                  <div className="flex-1">
                    {isLoading ? (
                      <div className="flex h-48 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[#FF725F]"></div>
                      </div>
                    ) : currentNote ? (
                      <div className="space-y-4">
                        {currentNote.markText &&
                          currentNote.markText.trim() !== "" && (
                            <div className="text-sm sm:text-base text-gray-600">
                              {currentNote.markText}
                            </div>
                          )}
                        <div className="text-sm sm:text-lg leading-relaxed text-gray-800">
                          {currentNote.noteContent}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currentNote.chapterName}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        暂无笔记
                      </div>
                    )}
                  </div>

                  {/* 书籍信息 */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#F0F0F0]/60 pt-4 text-sm">
                    <div className="flex flex-col space-y-2">
                      <a
                        href="https://readecho.cn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-['Noto Serif SC',serif] cursor-pointer tracking-wide text-[#262626] transition-colors hover:text-[#FF725F]"
                      >
                        {currentNote?.bookName}
                        {currentNote?.bookAuthor
                          ? ` / ${currentNote.bookAuthor}`
                          : ""}
                      </a>
                    </div>
                    <span className="font-light tracking-wider text-[#8F8F8F]">
                      {currentNote?.noteTime
                        ? dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // 其他背景下的简洁样式
              <div className="group relative w-full max-w-5xl">
                {/* 时钟显示 - 只在bg4下显示 */}
                {currentBackgroundIndex === 3 && (
                  <div className="absolute -top-40 left-0 right-0 flex justify-center">
                    <div className="font-['Noto Serif SC',serif] text-8xl tracking-widest text-white/70">
                      {currentTime}
                    </div>
                  </div>
                )}

                <div className="space-y-8 px-8">
                  {currentNote?.markText && (
                    <div
                      className={`line-clamp-5 text-center text-xl md:text-3xl ${
                        currentBackgroundIndex === 2
                          ? "font-['Noto Serif SC',serif] text-shadow-green text-[#006D11]"
                          : currentBackgroundIndex === 3
                            ? "font-['Noto Serif SC',serif] text-shadow-light text-white/80"
                            : currentBackgroundIndex === 4
                              ? "font-['Noto Serif SC',serif] text-shadow-dark text-[#2C3333]"
                              : currentBackgroundIndex === 5
                                ? "font-['Georgia','Cambria','Times New Roman','Times',serif] text-shadow-forest text-[#006D11]/90"
                                : "font-['Noto Serif SC',serif] text-shadow-light text-white/90"
                      } tracking-wide`}
                      style={{
                        lineHeight: "1.8em",
                        textShadow:
                          currentBackgroundIndex === 0
                            ? "none"
                            : currentBackgroundIndex === 5
                              ? "0 1px 1px rgba(255,255,255,0.6)"
                              : "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {currentNote.markText}
                    </div>
                  )}

                  {currentNote?.noteContent && (
                    <div
                      className={`line-clamp-5 text-center text-lg md:text-2xl ${
                        currentBackgroundIndex === 2
                          ? "font-['Noto Serif SC',serif] text-shadow-green text-[#006D11]/90"
                          : currentBackgroundIndex === 3
                            ? "font-['Noto Serif SC',serif] text-shadow-light text-white/70"
                            : currentBackgroundIndex === 4
                              ? "font-['Noto Serif SC',serif] text-shadow-dark text-[#2C3333]/90"
                              : currentBackgroundIndex === 5
                                ? "font-['Georgia','Cambria','Times New Roman','Times',serif] text-shadow-forest text-[#006D11]/80"
                                : "font-['Noto Serif SC',serif] text-shadow-light text-white/80"
                      } tracking-wide`}
                      style={{
                        lineHeight: "1.8em",
                        textShadow:
                          currentBackgroundIndex === 0
                            ? "none"
                            : currentBackgroundIndex === 5
                              ? "0 1px 1px rgba(255,255,255,0.6)"
                              : "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {currentNote.noteContent}
                    </div>
                  )}

                  <div className="flex flex-col items-center space-y-2">
                    <a
                      href="https://readecho.cn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-base ${
                        currentBackgroundIndex === 2
                          ? "font-['Noto Serif SC',serif] text-[#006D11]/80 hover:text-[#006D11]"
                          : currentBackgroundIndex === 3
                            ? "font-['Noto Serif SC',serif] text-white/70 hover:text-white/90"
                            : currentBackgroundIndex === 4
                              ? "font-['Noto Serif SC',serif] text-[#2C3333]/80 hover:text-[#2C3333]"
                              : currentBackgroundIndex === 5
                                ? "font-['Georgia','Cambria','Times New Roman','Times',serif] text-[#006D11]/80 hover:text-[#006D11]"
                                : "font-['Noto Serif SC',serif] text-white/80 hover:text-white"
                      } tracking-wide transition-all duration-300 hover:underline`}
                      style={{
                        textShadow:
                          currentBackgroundIndex === 0
                            ? "none"
                            : currentBackgroundIndex === 5
                              ? "0 1px 1px rgba(255,255,255,0.6)"
                              : "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {currentNote?.bookName}
                      {currentNote?.bookAuthor
                        ? ` / ${currentNote.bookAuthor}`
                        : ""}
                    </a>
                    <span
                      className={
                        currentBackgroundIndex === 2
                          ? "text-[#006D11]/60"
                          : currentBackgroundIndex === 3
                            ? "text-white/50"
                            : currentBackgroundIndex === 4
                              ? "text-[#2C3333]/60"
                              : currentBackgroundIndex === 5
                                ? "text-[#4A7856]/60"
                                : "text-white/60"
                      }
                    >
                      {currentNote?.noteTime
                        ? dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部工具栏 */}
          <div
            className={`flex h-[80px] items-center justify-center ${
              currentBackgroundIndex !== 0 ? "-mt-12" : ""
            }`}
          >
            <div className="group relative">
              {historyIndex > 0 && (
                <button
                  onClick={handlePreviousNote}
                  className={`absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 translate-y-2 transform items-center gap-2 whitespace-nowrap rounded-lg px-6 py-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 ${
                    currentBackgroundIndex === 0
                      ? "border border-[#FF725F] bg-white text-[#FF725F] hover:bg-[#FF725F]/5"
                      : currentBackgroundIndex === 3
                        ? "bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10"
                        : currentBackgroundIndex === 4
                          ? "bg-[#2C3333]/5 text-[#2C3333] backdrop-blur-sm hover:bg-[#2C3333]/10"
                          : currentBackgroundIndex === 5
                            ? "bg-[#2D5A27]/5 text-[#2D5A27] backdrop-blur-sm hover:bg-[#2D5A27]/10"
                            : "bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  上一个
                </button>
              )}
              <div className="mt-1 flex flex-col items-center space-y-4">
                <button
                  onClick={handleRandomNote}
                  className={`px-6 py-3 ${
                    currentBackgroundIndex === 5
                      ? "bg-white bg-opacity-20 text-[#4CAF50] backdrop-blur-md"
                      : currentBackgroundIndex === 0
                        ? "bg-[#FF725F] text-white hover:bg-[#FF8F7F]"
                        : "bg-white bg-opacity-20 text-white backdrop-blur-md hover:bg-opacity-30"
                  } flex items-center gap-2 rounded-full transition-all duration-300`}
                >
                  <Shuffle className="h-4 w-4" />
                  随机回顾
                </button>
              </div>
            </div>
          </div>

          {/* 切换背景按钮：固定在右下角 */}
          <button
            onClick={handleSwitchBackground}
            className={`absolute bottom-6 right-6 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              currentBackgroundIndex === 0
                ? "text-[#595959] hover:bg-[#F5F5F5] hover:text-[#262626]"
                : currentBackgroundIndex === 3
                  ? "text-white/70 hover:bg-white/10"
                  : currentBackgroundIndex === 4
                    ? "text-[#2C3333] hover:bg-[#2C3333]/10"
                    : currentBackgroundIndex === 5
                      ? "text-[#2D5A27] hover:bg-[#2D5A27]/10"
                      : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Image className="h-4 w-4" />
            切换背景 {currentBackgroundIndex + 1}/{backgrounds.length}
          </button>
        </div>
      </div>

      {/* 分享对话框 */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        note={currentNote}
      />

      {/* AI洞察弹窗 */}
      <AIInsightModal
        isOpen={showAIInsightModal}
        onClose={() => setShowAIInsightModal(false)}
        note={currentNote}
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

export default Page;
