import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";

import { useDebounce } from "use-debounce";

import { ChevronDown, X } from "lucide-react";

import { exportNotesService, exportNotesMdService } from "@/services/notes";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import Link from "next/link";



const NoteList = ({ initialBookId }: { initialBookId: string }) => {

  const [notes, setNotes] = useState([]);

  const [bookId, setBookId] = useState(initialBookId);

  const [bookName, setBookName] = useState("");

  const [exportFormat, setExportFormat] = useState<"excel" | "markdown">(

    "excel",

  );



  const getNotes = useCallback(async (bookId: string) => {

    const response = await fetch(`/api/notes?bookId=${bookId}`, {

      method: "GET",

    });

    if (!response.ok) {

      console.log(response.statusText);

      return;

    }

    const { code, rows, bookName } = await response.json();

    if (code === 200) {

      const filteredRows = rows.filter((item: any) => item.markText);

      setNotes(filteredRows);

      setBookName(bookName);

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

          {bookName && (

            <span className="font-medium text-primary">书名:{bookName}</span>

          )}

        </div>



        <div className="flex items-center space-x-2">

          <button

            onClick={handleExport}

            className="rounded-md border border-primary px-4 py-2 text-primary transition duration-300 hover:bg-gray-50"

          >

            导出

          </button>

          <DropdownMenu.Root>

            <DropdownMenu.Trigger asChild>

              <button className="flex w-36 items-center justify-center rounded-md border border-primary px-4 py-2 text-primary outline-none transition duration-300">

                <span>{exportFormat}</span>

                <ChevronDown className="ml-2" size={16} />

              </button>

            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>

              <DropdownMenu.Content className="min-w-[120px] rounded-md bg-white p-1 shadow-md">

                <DropdownMenu.Item

                  className="cursor-pointer rounded px-2 py-1 text-primary outline-none hover:bg-gray-100"

                  onSelect={() => setExportFormat("excel")}

                >

                  excel

                </DropdownMenu.Item>

                <DropdownMenu.Item

                  className="cursor-pointer rounded px-2 py-1 text-primary outline-none hover:bg-gray-100"

                  onSelect={() => setExportFormat("markdown")}

                >

                  markdown

                </DropdownMenu.Item>

              </DropdownMenu.Content>

            </DropdownMenu.Portal>

          </DropdownMenu.Root>

        </div>

      </div>

      <ul className="mt-4 space-y-4">

        {notes.map((note: any) => (

          <div

            key={note.reviewId}

            className="rounded-lg border border-[#b4b2a7] bg-white p-4 hover:bg-[#f8f9fa]"

          >

            <h3 className="mb-2 text-lg font-semibold">{note.noteContent}</h3>

            <div className="flex">

              <div className="mr-3 w-1 bg-gray-300"></div>

              <p className="flex-1 text-sm text-gray-600">{note.markText}</p>

            </div>

            <div className="mt-16 flex justify-between">

              <p className="text-[#545247]">

                {note.chapterName

                  ? `${note.bookName}/${note.chapterName}`

                  : note.bookName}

              </p>

              <p className="text-[#545247]">

                {note.noteTime &&

                  dayjs.unix(note.noteTime).format("YYYY-MM-DD HH:mm:ss")}

              </p>

            </div>

          </div>

        ))}

      </ul>

    </div>

  );

};



export default NoteList;
