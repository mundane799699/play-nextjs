"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, BarChart2, SortDesc, ChevronDown } from "lucide-react";
import StatsDialog from "./StatsDialog";
import { useDashboard } from "@/context/DashboardContext";

type SortOption = "default" | "bookName" | "updateTime";

const BookList = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { onAIChatToggle } = useDashboard();

  useEffect(() => {
    getBooks();
    getNotes();
  }, []);

  // 点击外部关闭排序下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (sortDropdownOpen && !target.closest('.sort-dropdown')) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  useEffect(() => {
    // 当books、searchQuery或sortOption变化时，过滤和排序书籍
    let filtered = [...books];
    
    // 先应用搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((book: any) => 
        book.bookName.toLowerCase().includes(query)
      );
    }
    
    // 应用排序
    if (sortOption === "bookName") {
      filtered.sort((a: any, b: any) => {
        const bookNameA = a.bookName?.toLowerCase() || '';
        const bookNameB = b.bookName?.toLowerCase() || '';
        return bookNameB.localeCompare(bookNameA); // 降序
      });
    } else if (sortOption === "updateTime") {
      filtered.sort((a: any, b: any) => {
        const timeA = a.updateTime || a.updatedAt || 0;
        const timeB = b.updateTime || b.updatedAt || 0;
        return timeB - timeA; // 降序，最新的在前
      });
    }
    // default 保持原始顺序
    
    setFilteredBooks(filtered);
  }, [books, searchQuery, sortOption]);

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

  const handleSearchButtonClick = () => {
    setIsSearchExpanded(true);
    // 使用 setTimeout 确保 DOM 更新后再聚焦
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchBlur = () => {
    // 如果搜索框为空，则收起搜索框
    if (!searchQuery.trim()) {
      setIsSearchExpanded(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case "default":
        return "默认";
      case "bookName":
        return "按书名降序";
      case "updateTime":
        return "按同步时间降序";
      default:
        return "默认";
    }
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
          
          <div className="relative sort-dropdown">
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
              <div className="absolute left-0 top-full mt-1 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-10">
                <button
                  onClick={() => {
                    setSortOption("default");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "default" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  默认
                </button>
                <button
                  onClick={() => {
                    setSortOption("bookName");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "bookName" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  按书名降序
                </button>
                <button
                  onClick={() => {
                    setSortOption("updateTime");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded px-3 py-1 text-xs transition-colors ${
                    sortOption === "updateTime" ? "bg-gray-100 text-[#d97b53]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  按同步时间降序
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 移动端搜索展开时的全宽搜索框 */}
        {isSearchExpanded && (
          <div className="relative sm:hidden w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="输入书籍名称"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              onFocus={handleSearchFocus}
            />
          </div>
        )}
        
        {/* 移动端非搜索状态和桌面端的按钮组 */}
        <div className={`flex items-center gap-2 ${isSearchExpanded ? 'hidden sm:flex' : 'flex'}`}>
          {/* 移动端搜索按钮 */}
          <div className="relative sm:hidden">
            <button
              onClick={handleSearchButtonClick}
              className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              title="搜索书籍"
            >
              <Search className="h-3.5 w-3.5" />
              <span>搜索</span>
            </button>
          </div>
          
          {/* 桌面端搜索框 */}
          <div className="relative hidden sm:block">
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
          
          {/* <button
            onClick={onAIChatToggle}
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2 sm:px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            title="AI问书"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">AI问书</span>
          </button> */}
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
