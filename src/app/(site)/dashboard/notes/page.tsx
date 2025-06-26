"use client";

import NoteList from "@/components/DashBoard/NoteList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const NotesPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <NoteList initialBookId={bookId || ""} />
    </div>
  );
};

export default NotesPage;
