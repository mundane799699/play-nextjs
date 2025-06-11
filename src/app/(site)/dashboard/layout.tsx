"use client";

import TabComponent from "@/components/DashBoard/TabComponent";
import { useState } from "react";
import AIChatSidebar from "@/components/DashBoard/AIChatSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
  };

  return (
    <div className="min-h-screen bg-[#faf6f2] pb-10 pt-20 lg:pb-20 lg:pt-[120px] relative">
      <div className="container">
        <TabComponent onAIChatToggle={toggleAIChat} isAIChatOpen={isAIChatOpen} />
        {/* 主内容区 - 根据侧边栏状态调整宽度和布局 */}
        <div className={`transition-all duration-300 ${isAIChatOpen ? 'mr-[320px]' : ''}`}>
          {children}
        </div>
      </div>
      
      {/* AI问书侧边栏 - 固定定位，占据右侧全部高度 */}
      {isAIChatOpen && (
        <div className="fixed top-0 right-0 w-[400px] h-full z-40 bg-white border-l border-gray-200" data-ai-panel>
          <AIChatSidebar onClose={() => setIsAIChatOpen(false)} />
        </div>
      )}
    </div>
  );
}
