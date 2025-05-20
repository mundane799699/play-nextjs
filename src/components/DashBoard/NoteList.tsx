import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

import { useDebounce } from "use-debounce";

import { ChevronDown, X, ArrowRightLeft, Shuffle, Mail } from "lucide-react";

import { exportNotesService, exportNotesMdService } from "@/services/notes";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Link from "next/link";
import RandomReviewModal from "../Modal/RandomReviewModal";
import SettingsDialog from "./SettingsDialog";



const NoteList = ({ initialBookId }: { initialBookId: string }) => {

  const [notes, setNotes] = useState([]);

  const [bookId, setBookId] = useState(initialBookId);

  const [bookName, setBookName] = useState("");

  const [totalNotes, setTotalNotes] = useState(0);

  const [exportFormat, setExportFormat] = useState<"excel" | "markdown">(

    "excel",

  );
  
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
      setBookName(bookName);
      setTotalNotes(total || filteredRows.length);
    }

  }, []);



  useEffect(() => {
    getNotes(bookId);
  }, []);



  const handleExport = async () => {

    if (exportFormat === "excel") {

      await exportNotesService(bookId);

    } else if (exportFormat === "markdown") {

      await exportNotesMdService(bookId);

    }

  };



  return (

    <div className="py-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-2">

          <span className="text-gray-600">
            {bookName ? `${bookName}：` : '全部笔记：'}
            <span className="font-medium">{totalNotes}条</span>
          </span>

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
          <div className="flex items-center">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-gray-600 transition duration-300 hover:text-gray-800"
            >
              导出{exportFormat === "excel" ? "Excel" : "Markdown"}
            </button>
            <button
              onClick={() => setExportFormat(exportFormat === "excel" ? "markdown" : "excel")}
              className="px-2 py-2 text-gray-500 transition duration-300 hover:text-gray-700"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      <ul className="mt-4 space-y-6">

        {notes.map((note: any) => (

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
                <span className="font-medium text-gray-900">
                  {note.chapterName
                    ? `${note.bookName} / ${note.chapterName}`
                    : note.bookName}
                </span>
                <span className="text-gray-500">
                  {note.noteTime &&
                    dayjs.unix(note.noteTime).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          </div>

        ))}

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
    </div>

  );

};



export default NoteList;
