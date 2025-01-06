"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BookList = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  useEffect(() => {
    getBooks();
  }, []);
  const getBooks = async () => {
    const response = await fetch("/api/books", {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const { code, rows } = await response.json();
    if (code === 200) {
      setBooks(rows);
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/dashboard/notes?bookId=${bookId}`);
  };

  return (
    <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((item: any) => (
        <li
          key={item.bookId}
          className="group flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          onClick={() => handleBookClick(item.bookId)}
        >
          <div className="flex">
            <img
              className="mr-4 h-32 w-24 rounded object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
              src={item.cover}
              alt={item.bookName}
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h2 className="line-clamp-2 text-base font-medium text-gray-900">
                  {item.bookName}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  最后阅读时间：{item.lastReadTime || '未开始阅读'}
                </p>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="mr-1">划线</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">{item.markCount}</span>
                </span>
                <span className="flex items-center">
                  <span className="mr-1">想法</span>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-600">{item.noteCount}</span>
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
