import React, { useState, useEffect } from "react";
import { X, Shuffle, Share2, Copy, Check, Brain } from "lucide-react";
import { Note } from "@/types/note";
import { getRandomReview } from "@/services/notes";
import dayjs from "dayjs";
import ShareDialog from "@/components/DashBoard/ShareDialog";
import AIInsightModal from "./AIInsightModal";

interface RandomReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RandomReviewModal: React.FC<RandomReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAIInsightModal, setShowAIInsightModal] = useState(false);

  // 解决闪烁问题：使用独立的 useEffect 来设置 isLoading，确保初次渲染时保持稳定
  useEffect(() => {
    if (isOpen && !currentNote) {
      setIsLoading(true);
    }
  }, [isOpen, currentNote]);

  // 解决闪烁问题：在组件挂载后以及每次打开弹窗时获取笔记
  useEffect(() => {
    if (isOpen) {
      fetchRandomNote();
    }
  }, [isOpen]);

  const fetchRandomNote = async () => {
    try {
      const response = await getRandomReview();
      const { code, data } = response;
      if (code === 200) {
        const { note, readCount, totalCount } = data;
        if (note) {
          setCurrentNote(note);
          setReadCount(readCount || 0);
          setTotalCount(totalCount || 0);
        }
      }
    } catch (error) {
      console.error("获取随机笔记失败", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomNote = async () => {
    setIsLoading(true);
    await fetchRandomNote();
  };

  const handleCopy = async () => {
    if (!currentNote) return;
    const textToCopy = `${currentNote.markText || ""}\n${currentNote.noteContent || ""}\n${currentNote.chapterName || ""}\n${currentNote.bookName || ""}`;
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2">
        {/* 标题栏 - 移除标题，只保留进度和操作按钮 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              回顾进度：{readCount}/{totalCount}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {currentNote && (
              <button
                onClick={() => setShowAIInsightModal(true)}
                className="relative px-3 py-1.5 text-sm text-gray-500 bg-gray-100 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200 rounded-lg"
                title="AI洞察分析"
              >
                AI洞察
                <span className="absolute -top-1 -right-1 px-0.5 py-0.5 text-xs bg-red-400 text-white rounded-full text-[8px] leading-none">
                  Beta
                </span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="复制笔记"
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {currentNote && (
              <button
                onClick={() => setShowShareDialog(true)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="分享笔记"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 内容区域：固定高度并纵向居中，但内容位置上移 */}
        <div className="h-[360px] overflow-auto flex">
          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : currentNote ? (
            <div className="w-full space-y-6 pt-6">
              {/* 标记的文本 */}
              {currentNote.markText && (
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
                  <blockquote className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {currentNote.markText}
                  </blockquote>
                </div>
              )}

              {/* 笔记内容 */}
              <div className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                {currentNote.noteContent}
              </div>

              {/* 书籍信息 */}
              <div className="flex items-center justify-between pt-4 text-sm border-t border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {currentNote.chapterName
                    ? `${currentNote.bookName} / ${currentNote.chapterName}`
                    : currentNote.bookName}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {currentNote.noteTime &&
                    dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full py-12 text-center text-gray-500 dark:text-gray-400">
              暂无笔记
            </div>
          )}
        </div>

        {/* 底部按钮 - 文字改为"随机回顾" */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRandomNote}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-opacity hover:opacity-90"
          >
            <Shuffle className="h-4 w-4" />
            随机回顾
          </button>
        </div>
      </div>

      {/* 分享对话框 */}
      {currentNote && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          note={currentNote}
        />
      )}

      {/* AI洞察弹窗 */}
      <AIInsightModal
        isOpen={showAIInsightModal}
        onClose={() => setShowAIInsightModal(false)}
        note={currentNote}
      />
    </div>
  );
};

export default RandomReviewModal; 