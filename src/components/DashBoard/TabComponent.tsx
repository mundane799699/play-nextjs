"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabComponentProps {
  onAIChatToggle?: () => void;
  isAIChatOpen?: boolean;
}

const TabComponent = ({ onAIChatToggle, isAIChatOpen }: TabComponentProps) => {
  const pathname = usePathname();

  return (
    <div className={`flex justify-between items-center border-b border-[#b4b2a7] transition-all duration-300 ${isAIChatOpen ? 'mr-[320px]' : ''}`}>
      <div className={`flex-1 ${isAIChatOpen ? 'max-w-[100px]' : ''}`}></div>
      <div className={`flex gap-4 transition-all duration-300 ${isAIChatOpen ? 'transform -translate-x-[80px]' : ''}`}>
        <Link
          href="/dashboard"
          className={`px-4 py-2 ${
            pathname === "/dashboard"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          书架
        </Link>
        <Link
          href="/dashboard/notes"
          className={`px-4 py-2 ${
            pathname === "/dashboard/notes"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          笔记
        </Link>
      </div>
      <div className="flex-1 flex justify-end">
        {!isAIChatOpen && (
          <button
            onClick={onAIChatToggle}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            AI问书
          </button>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
