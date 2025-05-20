import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

import { useDebounce } from "use-debounce";

import { ChevronDown, X, ArrowRightLeft, Shuffle, Mail, Search, Download } from "lucide-react";

import { exportNotesService, exportNotesMdService } from "@/services/notes";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Link from "next/link";
import RandomReviewModal from "../Modal/RandomReviewModal";
import SettingsDialog from "./SettingsDialog";
import ExportModal from "../Modal/ExportModal";



const NoteList = ({ initialBookId }: { initialBookId: string }) => {

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [bookId, setBookId] = useState(initialBookId);

  const [bookName, setBookName] = useState("");

  const [totalNotes, setTotalNotes] = useState(0);

  const [exportFormat, setExportFormat] = useState<"excel" | "markdown">("excel");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const [isRandomReviewOpen, setIsRandomReviewOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);



  const getNotes = useCallback(async (bookId: string) => {
    const response = await fetch(`/api/notes?bookId=${bookId}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const { code, rows, bookName, total } = await response.json();
    if (code === 200) {
      const filteredRows = rows.filter((item: any) => item.markText);
      setNotes(filteredRows);
      setFilteredNotes(filteredRows);
      setBookName(bookName);
      setTotalNotes(total || filteredRows.length);
    }

  }, []);



  useEffect(() => {
    getNotes(bookId);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = notes.filter((note: any) => 
        note.markText?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        note.noteContent?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [debouncedSearchTerm, notes]);



  const handleExport = async (format: "excel" | "markdown") => {
    if (format === "excel") {
      await exportNotesService(bookId);
    } else if (format === "markdown") {
      await exportNotesMdService(bookId);
    }
  };



  return (

    <div className="py-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {bookName ? `${bookName}：` : '共'}
            <span className="font-medium">{filteredNotes.length}/{totalNotes}条</span>
          </span>
          
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center text-gray-500 text-sm transition duration-300 hover:text-gray-700"
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            导出
          </button>
        </div>



        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSettingsDialogOpen(true)}
            className="group relative flex items-center px-4 py-2 text-gray-600 transition duration-300 hover:text-gray-800"
          >
            <Mail className="mr-1 h-4 w-4" />
            <span className="relative">
              邮箱回顾
              <span className="ml-0.5 inline-block translate-y-[-3px] rounded-sm bg-primary/80 px-0.5 text-[6px] font-normal uppercase leading-3 text-white opacity-80">pro</span>
            </span>
          </button>
          <button
            onClick={() => setIsRandomReviewOpen(true)}
            className="flex items-center px-4 py-2 text-gray-600 transition duration-300 hover:text-gray-800"
          >
            <Shuffle className="mr-1 h-4 w-4" />
            随机回顾
          </button>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="输入笔记内容或书名"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-primary focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      <ul className="mt-4 space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: any) => (
            <div
              key={note.reviewId}
              className="rounded-lg bg-white/80 p-6 md:p-8 shadow-sm backdrop-blur-sm"
            >
              <div className="flex flex-col">
                {/* 标记的文本 */}
                <div className="relative pl-4 mb-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
                  <blockquote className="text-lg font-medium text-gray-700">
                    {note.markText}
                  </blockquote>
                </div>

                {/* 笔记内容 */}
                <div>
                  <div className="text-base leading-relaxed text-gray-800">
                    {note.noteContent}
                  </div>
                </div>

                {/* 书籍信息 */}
                <div className="flex items-center justify-between mt-6 pt-4 text-sm border-t border-gray-100">
                  <Link
                    href={`/reader/${note.bookId}`}
                    className="font-medium text-gray-900 hover:text-primary transition-colors"
                  >
                    {note.chapterName
                      ? `${note.bookName} / ${note.chapterName}`
                      : note.bookName}
                  </Link>
                  <span className="text-gray-500">
                    {note.noteTime &&
                      dayjs.unix(note.noteTime).format("YYYY-MM-DD")}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">未找到匹配的笔记</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "请尝试使用其他关键词搜索" : "当前书籍没有笔记"}
            </p>
          </div>
        )}
      </ul>

      {/* 随机回顾弹窗 */}
      <RandomReviewModal
        isOpen={isRandomReviewOpen}
        onClose={() => setIsRandomReviewOpen(false)}
      />

      {/* 邮箱回顾设置弹窗 */}
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />

      {/* 导出选项弹窗 */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>

  );

};



export default NoteList;
