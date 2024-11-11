"use client";

import NoteList from "@/components/DashBoard/NoteList";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const NotesPage = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  return (
    <div className="py-4">
      <NoteList initialBookId={bookId || ""} />
    </div>
  );
};

export default NotesPage;
