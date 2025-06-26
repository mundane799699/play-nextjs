"use client";

import { useEffect } from "react";
import BookList from "@/components/DashBoard/BookList";

const DashBoardPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <BookList />
    </div>
  );
};

export default DashBoardPage;
