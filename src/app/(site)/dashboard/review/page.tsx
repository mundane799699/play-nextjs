"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Shuffle, X, Copy, Check, Brain } from "lucide-react";
import dayjs from "dayjs";
import { getRandomReview } from "@/services/notes";
import Modal from "@/components/DashBoard/Modal";

import ShareDialog from "@/components/DashBoard/ShareDialog";
import AIInsightModal from "@/components/Modal/AIInsightModal";
import { Note } from "@/types/note";

const ReviewPage = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAIInsightModal, setShowAIInsightModal] = useState(false);
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

    const textToCopy = `${currentNote.markText || ""}\n${currentNote.noteContent || ""}\n${currentNote.chapterName || ""}\n${currentNote.bookName || ""}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
        <div className="text-center text-gray-500">暂无笔记</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f2] p-6">
      <div className="mx-auto max-w-4xl">
        {/* 顶部工具栏 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              回顾进度：{readCount}/{totalCount}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {currentNote && (
              <button
                onClick={() => setShowAIInsightModal(true)}
                className="relative px-3 py-1.5 text-sm text-gray-500 bg-white/50 transition-colors hover:bg-white/70 hover:text-gray-700 rounded-lg"
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
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/50 hover:text-gray-700"
              title="复制笔记"
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/50 hover:text-gray-700"
              title="分享笔记"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 主要内容区 */}
        <div className="flex items-center justify-center">
          <div className="w-full">
            {/* 内容卡片 */}
            <div className="rounded-lg bg-white p-8 shadow-sm min-h-[480px] flex flex-col">
              <div className="flex-1 space-y-6">
                {/* 标记的文本 */}
                {currentNote.markText && (
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
                    <blockquote className="text-sm sm:text-lg font-medium text-gray-700">
                      {currentNote.markText}
                    </blockquote>
                  </div>
                )}

                {/* 笔记内容 */}
                <div className="text-sm sm:text-base leading-relaxed text-gray-800">
                  {currentNote.noteContent}
                </div>
              </div>

              {/* 书籍信息 */}
              <div className="flex items-center justify-between pt-6 text-sm border-t border-gray-100 mt-6">
                <span className="font-medium text-gray-900">
                  {currentNote.chapterName
                    ? `${currentNote.bookName} / ${currentNote.chapterName}`
                    : currentNote.bookName}
                </span>
                <span className="text-gray-500">
                  {currentNote.noteTime &&
                    dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </div>
            </div>

            {/* 随机按钮 */}
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
        </div>
      </div>

      {/* 弹窗 */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        note={currentNote}
      />
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

export default ReviewPage;
