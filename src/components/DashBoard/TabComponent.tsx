"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TabComponent = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center border-b border-gray-200">
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
      <div className="w-4"></div>
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
  );
};

export default TabComponent;
