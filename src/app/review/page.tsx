'use client';

import { useState, useEffect } from "react";
import ShareDialog from "@/components/dashboard/ShareDialog";
import { fetchUserInfoService } from "@/services/login";
import { getRandomReview } from "@/services/notes";
import { Note } from "@/types/note";
import { Share2, Copy, Check, Shuffle, Image, Settings, ArrowUp } from "lucide-react";
import dayjs from "dayjs";
import Modal from "@/components/dashboard/Modal";
import SettingsDialog from "@/components/dashboard/SettingsDialog";

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
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(() => {
    // 从 localStorage 加载上次保存的背景设置
    const savedBackground = localStorage.getItem("background_index");
    return savedBackground ? parseInt(savedBackground, 10) : 0;
  });

  // 更新背景
  const handleBackgroundChange = (index: number) => {
    setCurrentBackgroundIndex(index);
    localStorage.setItem("background_index", index.toString());
  };

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

  useEffect(() => {
    // 获取用户信息
    fetchUserInfoService().then((res) => {
      const { user, code } = res;
      if (code === 200) {
        setUser(user);
        handleRandomNote();
      }
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只有在有用户且加载完成时才处理键盘事件
      if (!user || isLoading) return;
      
      // 右方向键触发随机回顾
      if (event.key === 'ArrowRight') {
        handleRandomNote();
      }
      // 左方向键触发上一个（如果有历史记录）
      else if (event.key === 'ArrowLeft' && historyIndex > 0) {
        handlePreviousNote();
      }
    };

    // 添加键盘事件监听
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, isLoading, historyIndex]); // 依赖项包含所有需要的状态

  const signIn = () => {
    browser.tabs.create({
      url: `${import.meta.env.VITE_BASE_WEB}/signin`,
      active: true,
    });
  };

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
            // 添加到历史记录
            setNoteHistory(prev => [...prev, note]);
            setHistoryIndex(prev => prev + 1);
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
      const previousNote = noteHistory[historyIndex - 1];
      setCurrentNote(previousNote);
      setHistoryIndex(prev => prev - 1);
      setReadCount(prev => prev - 1);
    }
  };

  const handleCopy = async () => {
    if (!currentNote) return;

    const textToCopy = `${currentNote.markText ? currentNote.markText + "\n\n" : ""}${currentNote.noteContent}\n\n${currentNote.chapterName || ""}\n${currentNote.bookName}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSwitchBackground = () => {
    setCurrentBackgroundIndex((prev) => {
      const nextIndex = (prev + 1) % backgrounds.length;
      return nextIndex;
    });
  };

  if (!user) {
    return (
      <div className="bg-orange-100 flex flex-col justify-center items-center h-screen">
        <button
          onClick={signIn}
          className="w-40 text-lg font-bold text-white bg-orange-400 hover:bg-orange-500 rounded-lg border p-4 mt-10"
        >
          去登录
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-40 text-lg font-bold text-white bg-orange-400 hover:bg-orange-500 rounded-lg border p-4"
        >
          刷新页面
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>;
  }

  if (!currentNote) {
    return <div className="p-8 text-center text-gray-500">暂无笔记</div>;
  }

  return (
    <div
      className="bg-stone-100 h-screen flex justify-center items-center relative"
      style={{
        backgroundImage:
          currentBackgroundIndex === 0
            ? `linear-gradient(rgba(245, 242, 236, 0.9), rgba(245, 242, 236, 0.9)), url("${backgrounds[currentBackgroundIndex]}")`
            : currentBackgroundIndex === 5
            ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url("${backgrounds[currentBackgroundIndex]}")`
            : `url("${backgrounds[currentBackgroundIndex]}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 主容器：固定宽度和高度 */}
      <div className="w-[1000px] h-[580px] flex flex-col">
        {/* 内容区：使用 flex-1 自动占据剩余空间 */}
        <div className="flex-1 flex flex-col">
          {/* 内容卡片区域 */}
          <div className="flex-1 flex flex-col items-center justify-center relative group">
            {/* 左上角进度 */}
            <div className={`absolute top-[60px] left-8 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
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
            }`}>
              回顾进度：{readCount}/{totalCount}
            </div>

            {/* 右上角按钮组 */}
            <div className={`absolute top-[50px] right-8 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
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
            }`}>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setShowShareDialog(true)}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* 内容卡片 */}
            {currentBackgroundIndex === 0 ? (
              // 默认背景下的卡片样式
              <div className="w-full h-[360px] overflow-auto rounded-lg bg-white/80 p-12 shadow-sm backdrop-blur-sm">
                <div className="h-full flex flex-col">
                  {/* 笔记内容区：flex-1 自动占据剩余空间 */}
                  <div className="flex-1">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF725F]"></div>
                      </div>
                    ) : currentNote ? (
                      <div className="space-y-4">
                        {currentNote.markText && currentNote.markText.trim() !== "" && (
                          <div className="text-gray-600 italic">{currentNote.markText}</div>
                        )}
                        <div className="text-gray-800 text-lg leading-relaxed">
                          {currentNote.noteContent}
                        </div>
                        <div className="text-gray-500 text-sm space-y-1">
                          <div>{currentNote.chapterName}</div>
                          <div>{currentNote.bookName}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">暂无笔记</div>
                    )}
                  </div>

                  {/* 书籍信息 */}
                  <div className="flex items-center justify-between mt-6 pt-4 text-sm border-t border-[#F0F0F0]/60">
                    <a
                      href={`https://readecho.cn/dashboard/notes?bookId=${currentNote?.bookId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-['Noto Serif SC',serif] text-[#262626] hover:text-[#FF725F] transition-colors cursor-pointer tracking-wide"
                    >
                      {currentNote?.bookName}{currentNote?.bookAuthor ? ` / ${currentNote.bookAuthor}` : ''}
                    </a>
                    <span className="text-[#8F8F8F] font-light tracking-wider">
                      {currentNote?.noteTime
                        ? dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // 其他背景下的简洁样式
              <div className="w-full max-w-5xl group relative">
                {/* 时钟显示 - 只在bg4下显示 */}
                {currentBackgroundIndex === 3 && (
                  <div className="absolute -top-40 left-0 right-0 flex justify-center">
                    <div className="text-8xl font-['Noto Serif SC',serif] text-white/70 tracking-widest">
                      {currentTime}
                    </div>
                  </div>
                )}

                <div className="space-y-8 px-8">
                  {currentNote?.markText && (
                    <div
                      className={`line-clamp-5 text-center text-xl md:text-3xl ${
                        currentBackgroundIndex === 2
                          ? "font-['Noto Serif SC',serif] text-[#006D11] text-shadow-green"
                          : currentBackgroundIndex === 3
                          ? "font-['Noto Serif SC',serif] text-white/80 text-shadow-light"
                          : currentBackgroundIndex === 4
                          ? "font-['Noto Serif SC',serif] text-[#2C3333] text-shadow-dark"
                          : currentBackgroundIndex === 5
                          ? "font-['Georgia','Cambria','Times New Roman','Times',serif] text-[#006D11]/90 text-shadow-forest"
                          : "font-['Noto Serif SC',serif] text-white/90 text-shadow-light"
                      } tracking-wide`}
                      style={{ 
                        lineHeight: '1.8em',
                        textShadow: currentBackgroundIndex === 0 
                          ? 'none' 
                          : currentBackgroundIndex === 5
                          ? '0 1px 1px rgba(255,255,255,0.6)'
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentNote.markText}
                    </div>
                  )}

                  {currentNote?.noteContent && (
                    <div
                      className={`line-clamp-5 text-center text-lg md:text-2xl ${
                        currentBackgroundIndex === 2
                          ? "font-['Noto Serif SC',serif] text-[#006D11]/90 text-shadow-green"
                          : currentBackgroundIndex === 3
                          ? "font-['Noto Serif SC',serif] text-white/70 text-shadow-light"
                          : currentBackgroundIndex === 4
                          ? "font-['Noto Serif SC',serif] text-[#2C3333]/90 text-shadow-dark"
                          : currentBackgroundIndex === 5
                          ? "font-['Georgia','Cambria','Times New Roman','Times',serif] text-[#006D11]/80 text-shadow-forest"
                          : "font-['Noto Serif SC',serif] text-white/80 text-shadow-light"
                      } tracking-wide`}
                      style={{ 
                        lineHeight: '1.8em',
                        textShadow: currentBackgroundIndex === 0 
                          ? 'none' 
                          : currentBackgroundIndex === 5
                          ? '0 1px 1px rgba(255,255,255,0.6)'
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentNote.noteContent}
                    </div>
                  )}

                  <div className="flex flex-col items-center space-y-2">
                    <a
                      href={`https://readecho.cn/dashboard/notes?bookId=${currentNote?.bookId}`}
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
                      } tracking-wide hover:underline transition-all duration-300`}
                      style={{ 
                        textShadow: currentBackgroundIndex === 0 
                          ? 'none' 
                          : currentBackgroundIndex === 5
                          ? '0 1px 1px rgba(255,255,255,0.6)'
                          : '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentNote?.bookName}{currentNote?.bookAuthor ? ` / ${currentNote.bookAuthor}` : ''}
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
            className={`h-[80px] flex items-center justify-center ${
              currentBackgroundIndex !== 0 ? "-mt-12" : ""
            }`}
          >
            <div className="relative group">
              {historyIndex > 0 && (
                <button
                  onClick={handlePreviousNote}
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap ${
                    currentBackgroundIndex === 0
                      ? "bg-white text-[#FF725F] border border-[#FF725F] hover:bg-[#FF725F]/5"
                      : currentBackgroundIndex === 3
                      ? "bg-white/5 text-white/70 hover:bg-white/10 backdrop-blur-sm"
                      : currentBackgroundIndex === 4
                      ? "bg-[#2C3333]/5 text-[#2C3333] hover:bg-[#2C3333]/10 backdrop-blur-sm"
                      : currentBackgroundIndex === 5
                      ? "bg-[#2D5A27]/5 text-[#2D5A27] hover:bg-[#2D5A27]/10 backdrop-blur-sm"
                      : "bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  上一个
                </button>
              )}
              <button
                onClick={handleRandomNote}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
                  currentBackgroundIndex === 0
                    ? "bg-[#FF725F] text-white hover:bg-[#FF725F]/90"
                    : currentBackgroundIndex === 3
                    ? "bg-white/5 text-white/70 hover:bg-white/10 backdrop-blur-sm"
                    : currentBackgroundIndex === 4
                    ? "bg-[#2C3333]/10 text-[#2C3333] hover:bg-[#2C3333]/20 backdrop-blur-sm"
                    : currentBackgroundIndex === 5
                    ? "bg-[#2D5A27]/10 text-[#2D5A27] hover:bg-[#2D5A27]/20 backdrop-blur-sm"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                <Shuffle className="h-4 w-4" />
                随机回顾
              </button>
            </div>
          </div>

          {/* 切换背景按钮：固定在右下角 */}
          <button
            onClick={handleSwitchBackground}
            className={`absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentBackgroundIndex === 0
                ? "text-[#595959] hover:text-[#262626] hover:bg-[#F5F5F5]"
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
