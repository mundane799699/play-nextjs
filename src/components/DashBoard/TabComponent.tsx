"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TabComponent = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center border-b border-[#b4b2a7]">
      <div className="flex flex-1 justify-end">
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
      </div>
      <div className="w-4"></div>
      <div className="flex flex-1 justify-between">
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
        <Link
          href="/dashboard/review"
          className={`px-4 py-2 ${
            pathname === "/dashboard/review"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          回顾(开发中)
        </Link>
      </div>
    </div>
  );
};

export default TabComponent;
