"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, BarChart2 } from "lucide-react";
import StatsDialog from "./StatsDialog";

const BookList = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    getBooks();
    getNotes();
  }, []);

  useEffect(() => {
    // 当books或searchQuery变化时，过滤书籍
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter((book: any) => 
        book.bookName.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [books, searchQuery]);

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
      setFilteredBooks(rows);
    }
  };

  const getNotes = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "GET",
      });
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const { code, data } = await response.json();
      if (code === 200) {
        setNotes(data || []);
      }
    } catch (error) {
      console.error("获取笔记失败:", error);
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/dashboard/notes?bookId=${bookId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* 顶部区域：书籍数量和搜索框 */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm sm:text-base">
            共<span className="font-medium">{filteredBooks.length}本</span>
          </span>
          <button
            onClick={() => setShowStats(true)}
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2 sm:px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 relative"
            title="查看统计分析"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">统计</span>
            <span className="absolute -top-1.5 -right-1.5 text-[9px] text-primary">beta</span>
          </button>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-32 sm:w-full rounded-md border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="输入书籍名称"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((item: any) => (
        <li
          key={item.bookId}
          className="group flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          onClick={() => handleBookClick(item.bookId)}
            title="点击查看相关笔记"
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
                  {item.lastReadTime && (
                <p className="mt-2 text-sm text-gray-500">
                      最后阅读时间：{item.lastReadTime}
                </p>
                  )}
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

        {/* 没有结果时显示提示 */}
        {filteredBooks.length === 0 && (
          <li className="col-span-full py-8 text-center text-gray-500">
            未找到匹配的书籍
          </li>
        )}
    </ul>
      
      {/* 统计分析弹窗 */}
      <StatsDialog 
        isOpen={showStats} 
        onClose={() => setShowStats(false)}
        books={books}
        notes={notes}
      />
    </div>
  );
};

export default BookList;
