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
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  useEffect(() => {
    // 设置dashboard页面的body背景色
    document.body.style.backgroundColor = '#faf6f2';
    
    // 滚动监听函数
    const controlBottomNav = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // 向下滚动且超过100px，隐藏底部导航
          setIsBottomNavVisible(false);
        } else {
          // 向上滚动，显示底部导航
          setIsBottomNavVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', controlBottomNav);
    
    // 清理函数
    return () => {
      document.body.style.backgroundColor = '';
      window.removeEventListener('scroll', controlBottomNav);
    };
  }, [lastScrollY]);

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
            <div className="fixed top-16 lg:top-20 right-0 w-full lg:w-[400px] h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] z-50 bg-white border-l border-gray-200" data-ai-panel>
              <AIChatSidebar onClose={() => setIsAIChatOpen(false)} />
            </div>
          )}
        </div>
        
        {/* 移动端底部导航栏 */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-[#faf6f2] border-t border-[#e5e5e5] z-40 transition-transform duration-300 ${
          isBottomNavVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex justify-around items-center py-2 px-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "bg-[#d97b53] text-white shadow-sm"
                  : "text-[#7a6f5d] hover:bg-[#f0ebe5] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className={`w-4 h-4 transition-colors duration-200 ${
                pathname === "/dashboard" ? "text-white" : "text-[#a89888]"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-xs font-medium">书架</span>
            </Link>
            <Link
              href="/dashboard/notes"
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                pathname.startsWith("/dashboard/notes")
                  ? "bg-[#d97b53] text-white shadow-sm"
                  : "text-[#7a6f5d] hover:bg-[#f0ebe5] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className={`w-4 h-4 transition-colors duration-200 ${
                pathname.startsWith("/dashboard/notes") ? "text-white" : "text-[#a89888]"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              <span className="text-xs font-medium">笔记</span>
            </Link>
            <Link
              href="/dashboard/review"
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                pathname.startsWith("/dashboard/review")
                  ? "bg-[#d97b53] text-white shadow-sm"
                  : "text-[#7a6f5d] hover:bg-[#f0ebe5] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className={`w-4 h-4 transition-colors duration-200 ${
                pathname.startsWith("/dashboard/review") ? "text-white" : "text-[#a89888]"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="text-xs font-medium">回顾</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg transition-all duration-200 ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-[#d97b53] text-white shadow-sm"
                  : "text-[#7a6f5d] hover:bg-[#f0ebe5] hover:text-[#5a4e3a]"
              }`}
            >
              <svg className={`w-4 h-4 transition-colors duration-200 ${
                pathname.startsWith("/dashboard/settings") ? "text-white" : "text-[#a89888]"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">设置</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
