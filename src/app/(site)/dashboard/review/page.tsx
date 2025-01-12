"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Mail, Shuffle, Settings, X, Copy, Check } from "lucide-react";
import dayjs from "dayjs";
import { getRandomReview } from "@/services/notes";
import Modal from "@/components/DashBoard/Modal";
import SettingsDialog from "@/components/DashBoard/SettingsDialog";
import ShareDialog from "@/components/DashBoard/ShareDialog";
import { Note } from "@/types/note";

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
          <div className="text-xs text-gray-500 sm:text-sm">
            回顾进度：{readCount}/{totalCount}
          </div>
        </div>
        <div className="flex gap-2 sm:gap-2">
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="flex items-center p-1 text-gray-600 transition hover:text-gray-900 md:p-2"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-1 hidden sm:inline">邮箱回顾</span>
          </button>
          <button
            onClick={() => setShowShareDialog(true)}
            className="group relative inline-flex items-center justify-center rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:p-2"
            aria-label="分享"
          >
            <Share2 className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute -left-3 -top-8 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
              分享笔记
            </span>
          </button>
          <button
            onClick={handleCopy}
            className="group relative inline-flex items-center justify-center rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:p-2"
            aria-label={isCopied ? "已复制" : "复制内容"}
          >
            {isCopied ? (
              <Check className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Copy className="h-5 w-5" strokeWidth={1.5} />
            )}
            <span className="absolute -left-3 -top-8 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
              {isCopied ? "已复制!" : "复制内容"}
            </span>
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-1 items-center justify-center px-1 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto w-full max-w-5xl">
          {/* 内容卡片 */}
          <div className="flex h-[360px] flex-col overflow-auto rounded-lg bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <div className="flex flex-1 flex-col">
              {/* 标记的文本 */}
              {currentNote.markText && (
                <div className="relative mb-4 pl-4 sm:mb-6">
                  <div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-primary"></div>
                  <blockquote className="text-sm font-medium text-gray-700 sm:text-lg">
                    {currentNote.markText}
                  </blockquote>
                </div>
              )}

              {/* 笔记内容 */}
              <div>
                <div className="text-xs leading-relaxed text-gray-800 sm:text-base">
                  {currentNote.noteContent}
                </div>
                {currentNote.chapterName && (
                  <div className="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-sm">
                    {currentNote.chapterName}
                  </div>
                )}
              </div>
            </div>

            {/* 书籍信息 */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs sm:mt-6 sm:pt-4 sm:text-sm">
              <span className="font-medium text-gray-900">
                {currentNote.bookName}
              </span>
              <span className="text-gray-500">
                {dayjs.unix(currentNote.noteTime).format("YYYY-MM-DD")}
              </span>
            </div>
          </div>

          {/* 随机按钮 */}
          <div className="mt-4 flex items-center justify-center sm:mt-6">
            <button
              onClick={handleRandomNote}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-2 text-xs shadow-sm transition-all hover:bg-white sm:text-sm"
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
