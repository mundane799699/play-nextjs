"use client";

import { useEffect, useState } from "react";

interface BookListProps {
  onBookSelect: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ onBookSelect }) => {
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

  const handleBookClick = (bookName: string) => {
    onBookSelect(bookName);
  };

  return (
    <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4">
      {books.map((item: any) => (
        <li
          key={item.bookId}
          className="flex cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          onClick={() => handleBookClick(item.bookName)}
        >
          <img
            className="mr-4 h-28 w-20 object-cover"
            src={item.cover}
            alt={item.bookName}
          />
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col justify-between">
              <h2 className="line-clamp-2 overflow-hidden overflow-ellipsis text-left text-sm font-medium">
                {item.bookName}
              </h2>
              <h2 className="text-left text-xs text-gray-500">
                划线 ({`${item.markCount}) | 想法 (${item.noteCount})`}
              </h2>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
