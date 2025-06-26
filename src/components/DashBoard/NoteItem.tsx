import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export interface Note {
  reviewId: string;
  bookId: string;
  markText?: string;
  noteContent?: string;
  bookName?: string;
  chapterName?: string;
  noteTime?: number;
}

interface NoteItemProps {
  note: Note;
  copiedNoteId: string | null;
  onCopyNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  copiedNoteId,
  onCopyNote,
  onDeleteNote,
}) => {
  return (
    <div className="rounded-lg bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
      <div className="flex flex-col">
        {/* 标记的文本 */}
        {note.markText && (
          <div className="relative mb-6 pl-4">
            <div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-primary"></div>
            <blockquote className="text-sm font-medium text-gray-700 sm:text-lg">
              {note.markText}
            </blockquote>
          </div>
        )}

        {/* 笔记内容 */}
        {note.noteContent && (
          <div>
            <div className="text-sm leading-relaxed text-gray-800 sm:text-base">
              {note.noteContent}
            </div>
          </div>
        )}

        {/* 书籍信息 */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
          <Link
            href={`/reader/${note.bookId}`}
            className="font-medium text-gray-900 transition-colors hover:text-primary"
          >
            {note.chapterName
              ? `${note.bookName} / ${note.chapterName}`
              : note.bookName}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              {note.noteTime && dayjs.unix(note.noteTime).format("YYYY-MM-DD")}
            </span>
            <button
              onClick={() => onCopyNote(note)}
              className={`rounded-md p-1.5 opacity-60 transition-all duration-200 hover:opacity-100 ${
                copiedNoteId === note.reviewId
                  ? "bg-green-50 text-green-600"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              }`}
              title={copiedNoteId === note.reviewId ? "已复制!" : "复制笔记"}
              aria-label="复制笔记"
            >
              {copiedNoteId === note.reviewId ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => onDeleteNote(note.reviewId)}
              className="rounded-md p-1.5 text-gray-400 opacity-60 transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:opacity-100"
              title="删除笔记"
              aria-label="删除笔记"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
