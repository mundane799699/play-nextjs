"use client";

import Sidebar from "@/components/DashBoard/Sidebar";
import { useState } from "react";
import AIChatSidebar from "@/components/DashBoard/AIChatSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardProvider } from "@/context/DashboardContext";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const pathname = usePathname();

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  useEffect(() => {
    // 设置dashboard页面的body背景色
    document.body.style.backgroundColor = '#faf6f2';
    
    // 清理函数，组件卸载时恢复默认背景色
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <DashboardProvider onAIChatToggle={toggleAIChat} isAIChatOpen={isAIChatOpen}>
      <div className="min-h-screen bg-[#faf6f2] pt-16 lg:pt-20 relative" style={{backgroundColor: '#faf6f2'}}>
        <div className="flex h-screen">
          {/* 左侧边栏 - 固定定位，在顶部导航下面，移动端隐藏 */}
          <div className="hidden lg:block fixed left-0 top-16 lg:top-20 w-48 h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] z-30 shadow-sm">
            <Sidebar />
          </div>
          
          {/* 主内容区 - 桌面端左侧留出sidebar空间，移动端全宽，右侧根据AI聊天状态调整 */}
          <div className={`flex-1 lg:ml-48 transition-all duration-300 ${isAIChatOpen ? 'lg:mr-[400px]' : ''}`}>
            <div className="px-6 py-4 pb-20 lg:pb-4">
              {children}
            </div>
          </div>
          
          {/* AI问书悬浮侧边栏 - 固定定位在右侧，在顶部导航下面 */}
          {isAIChatOpen && (
            <div className="fixed top-16 lg:top-20 right-0 w-full lg:w-[400px] h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] z-50 bg-white border-l border-gray-200 shadow-lg" data-ai-panel>
              <AIChatSidebar onClose={() => setIsAIChatOpen(false)} />
            </div>
          )}
        </div>
        
        {/* 移动端底部导航栏 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#faf6f2] border-t border-[#e5e5e5] z-40">
          <div className="flex justify-around items-center py-3">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center py-2 px-6 rounded-lg transition-colors duration-200 ${
                pathname === "/dashboard"
                  ? "text-[#d97b53]"
                  : "text-[#7a6f5d] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
              </svg>
              <span className="text-sm font-medium">书架</span>
            </Link>
            <Link
              href="/dashboard/notes"
              className={`flex flex-col items-center py-2 px-6 rounded-lg transition-colors duration-200 ${
                pathname.startsWith("/dashboard/notes")
                  ? "text-[#d97b53]"
                  : "text-[#7a6f5d] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm font-medium">笔记</span>
            </Link>
            <button
              onClick={toggleAIChat}
              className={`flex flex-col items-center py-2 px-6 rounded-lg transition-colors duration-200 ${
                isAIChatOpen
                  ? "text-[#4a90e2]"
                  : "text-[#7a6f5d] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">AI问书</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
