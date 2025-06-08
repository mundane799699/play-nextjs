import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

import { useDebounce } from "use-debounce";

import { ChevronDown, X, ArrowRightLeft, Shuffle, Mail, Search, Download, SortDesc } from "lucide-react";

import { exportNotesService, exportNotesMdService } from "@/services/notes";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Link from "next/link";
import RandomReviewModal from "../Modal/RandomReviewModal";
import SettingsDialog from "./SettingsDialog";
import ExportModal from "../Modal/ExportModal";

type SortOption = "time" | "bookName" | "timeAsc" | "random";

const NoteList = ({ initialBookId }: { initialBookId: string }) => {

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const [bookId, setBookId] = useState(initialBookId);

  const [bookName, setBookName] = useState("");

  const [totalNotes, setTotalNotes] = useState(0);

  const [sortOption, setSortOption] = useState<SortOption>("time");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

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
    let sorted = [...notes];
    
    // 先应用搜索过滤
    if (debouncedSearchTerm) {
      sorted = sorted.filter((note: any) => 
        note.markText?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        note.noteContent?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // 应用排序
    if (sortOption === "time") {
      sorted.sort((a: any, b: any) => (b.noteTime || 0) - (a.noteTime || 0));
    } else if (sortOption === "bookName") {
      sorted.sort((a: any, b: any) => {
        const bookNameA = a.bookName?.toLowerCase() || '';
        const bookNameB = b.bookName?.toLowerCase() || '';
        return bookNameA.localeCompare(bookNameB);
      });
    } else if (sortOption === "timeAsc") {
      sorted.sort((a: any, b: any) => (a.noteTime || 0) - (b.noteTime || 0));
    } else if (sortOption === "random") {
      sorted = sorted.sort(() => 0.5 - Math.random());
    }
    
    setFilteredNotes(sorted);
  }, [debouncedSearchTerm, notes, sortOption]);



  const handleExport = async (format: "excel" | "markdown") => {
    if (format === "excel") {
      await exportNotesService(bookId);
    } else if (format === "markdown") {
      await exportNotesMdService(bookId);
    }
  };
  
  const getSortLabel = () => {
    switch (sortOption) {
      case "time":
        return "按时间降序";
      case "bookName":
        return "按书名降序";
      case "timeAsc":
        return "按时间升序";
      case "random":
        return "随机";
      default:
        return "按时间降序";
    }
  };



  return (

    <div className="py-4 px-2 sm:px-4">

      <div className="flex items-center justify-between gap-2">

        <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
          <span className="text-gray-600 text-xs sm:text-base whitespace-nowrap">
            {bookName ? `${bookName}：` : '共'}
            <span className="font-medium">{filteredNotes.length}/{totalNotes}条</span>
          </span>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center text-gray-500 text-sm transition duration-300 hover:text-gray-700 p-1"
            title="导出"
          >
            <Download className="h-4 w-4" />
            <span className="ml-1 hidden lg:inline">导出</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center text-gray-500 text-sm transition duration-300 hover:text-gray-700 p-1"
              title={`排序：${getSortLabel()}`}
            >
              <SortDesc className="h-4 w-4" />
              <span className="ml-1 hidden lg:inline">排序：{getSortLabel()}</span>
              <span className="ml-1 hidden sm:inline lg:hidden">排序</span>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </button>
            
            {sortDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-10">
                <button
                  onClick={() => {
                    setSortOption("time");
                    setSortDropdownOpen(false);
                  }}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "time" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  按时间降序
                </button>
                <button
                  onClick={() => {
                    setSortOption("bookName");
                    setSortDropdownOpen(false);
                  }}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "bookName" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  按书名降序
                </button>
                <button
                  onClick={() => {
                    setSortOption("timeAsc");
                    setSortDropdownOpen(false);
                  }}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "timeAsc" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  按时间升序
                </button>
                <button
                  onClick={() => {
                    setSortOption("random");
                    setSortDropdownOpen(false);
                  }}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "random" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  随机
                </button>
              </div>
            )}
          </div>
        </div>



        <div className="flex items-center space-x-1 flex-shrink min-w-0">
            <button
            onClick={() => setIsSettingsDialogOpen(true)}
            className="group relative flex items-center p-1 sm:px-2 text-gray-600 transition duration-300 hover:text-gray-800 flex-shrink-0"
            title="邮箱回顾"
            >
            <Mail className="h-4 w-4" />
            <span className="relative ml-1 hidden lg:inline whitespace-nowrap">
              邮箱回顾
              <span className="ml-0.5 inline-block translate-y-[-3px] rounded-sm bg-primary/80 px-0.5 text-[6px] font-normal uppercase leading-3 text-white opacity-80">pro</span>
            </span>
            </button>
            <button
            onClick={() => setIsRandomReviewOpen(true)}
            className="flex items-center p-1 sm:px-2 text-gray-600 transition duration-300 hover:text-gray-800 flex-shrink-0"
            title="随机回顾"
          >
            <Shuffle className="h-4 w-4" />
            <span className="ml-1 hidden lg:inline whitespace-nowrap">随机回顾</span>
          </button>
          <div className="relative w-24 sm:w-32 md:w-48 lg:w-64 min-w-0">
            <input
              type="text"
              placeholder="搜索笔记"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 text-sm text-gray-700 focus:border-primary focus:outline-none"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
                <X className="h-3 w-3" />
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

      {/* 点击页面其他地方关闭排序下拉菜单 */}
      {sortDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setSortDropdownOpen(false)}
        />
      )}

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
