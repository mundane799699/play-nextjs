import { Note } from "@/types/note";
import { useRef } from "react";
import { X } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

// Share Dialog Component
const ShareDialog = ({
  isOpen,
  onClose,
  note,
}: {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}) => {
  const [selectedTheme, setSelectedTheme] = useState("theme");
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: selectedTheme === "theme" ? "#fdfcfb" : selectedTheme === "elegant" ? "#F5F2F0" : "#1A1A1A",
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 320,
          height: 480,
        });
        
        // 复制到剪贴板
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ]);
              toast.success('已复制图片到剪切板');
            } catch (err) {
              console.error('复制图片失败:', err);
              // 如果复制失败，尝试下载
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `${note.bookName}-笔记.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
              toast.success('图片已下载');
            }
          }
        }, 'image/png');
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error('生成图片失败');
      }
    }
  };

  const getThemeStyles = () => {
    if (selectedTheme === "theme") {
      return {
        background: "#fdfcfb",
        containerClass: "bg-[#fdfcfb]",
        titleColor: "#ff725f",
        contentColor: "#333333",
        bookColor: "#666666",
        brandColor: "#ff725f",
        borderColor: "#f4f1ec",
        accentColor: "#f4f1ec"
      };
    } else if (selectedTheme === "elegant") {
      return {
        background: "#F5F2F0",
        containerClass: "bg-[#F5F2F0]",
        titleColor: "#8B4513",
        contentColor: "#2C1810",
        bookColor: "#6B4423",
        brandColor: "#8B4513",
        borderColor: "#D4C4B0"
      };
    } else {
      return {
        background: "linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)",
        containerClass: "bg-gradient-to-br from-gray-900 to-gray-800",
        titleColor: "#D4AF37",
        contentColor: "#F5F5DC",
        bookColor: "#DAA520",
        brandColor: "#D4AF37",
        borderColor: "#4A4A4A"
      };
    }
  };

  const themeStyles = getThemeStyles();

  // 获取当前日期
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = currentDate.getFullYear();
  const weekday = currentDate.toLocaleDateString('zh-CN', { weekday: 'long' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium">分享书摘</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview Card - 高端设计 */}
        <div className="mb-6 flex justify-center">
          <div
            ref={cardRef}
            className="w-[320px] h-[480px] relative overflow-hidden"
            style={{ 
              background: selectedTheme === "theme" ? "#fdfcfb" : selectedTheme === "elegant" ? "#F5F2F0" : "linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)",
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {selectedTheme === "theme" ? (
              // 主题风格
              <>
                {/* 主要内容区域 */}
                <div className="px-8 pt-16 pb-20 h-full flex flex-col justify-center">
                  {/* 笔记内容 */}
                  <div className="space-y-6 mb-12 relative pl-4" id="content-area">
                    {/* 左侧竖线 - 与字体顶部对齐 */}
                    <div 
                      className="absolute left-0 w-1 rounded-full"
                      style={{ 
                        backgroundColor: "#ff725f",
                        top: "1.75rem",
                        bottom: "0.5rem"
                      }}
                    ></div>
                    
                    {/* 标记文本 */}
                    {note.markText && (
                      <div 
                        className="text-base leading-relaxed font-medium break-words"
                        style={{ color: themeStyles.contentColor }}
                      >
                        {note.markText.length > 200 ? note.markText.substring(0, 200) + '...' : note.markText}
                      </div>
                    )}
                    
                    {/* 笔记内容 */}
                    {note.noteContent && (
                      <div 
                        className="text-sm leading-relaxed opacity-80 break-words"
                        style={{ color: themeStyles.contentColor }}
                      >
                        {note.noteContent.length > 200 ? note.noteContent.substring(0, 200) + '...' : note.noteContent}
                      </div>
                    )}
                  </div>
                  
                  {/* 书籍信息和日期 */}
                  <div className="flex items-end justify-between">
                                         <div className="space-y-1">
                       <div 
                         className="text-sm font-medium break-words"
                         style={{ color: themeStyles.bookColor }}
                       >
                         {(note.bookName.length > 12 ? note.bookName.substring(0, 12) + '...' : note.bookName)}{note.chapterName ? ` / ${note.chapterName}` : ''}
                       </div>
                      <div 
                        className="text-xs opacity-70"
                        style={{ color: themeStyles.bookColor }}
                      >
                        威廉·8.政文
                      </div>
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: themeStyles.bookColor }}
                    >
                      {year}-{String(currentDate.getMonth() + 1).padStart(2, '0')}-{String(day).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* 底部文字 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="text-sm font-medium"
                    style={{ 
                      color: "#ff725f"
                    }}
                  >
                    ReadEcho丨随机回顾
                  </div>
                </div>
              </>
            ) : selectedTheme === "elegant" ? (
              // 优雅浅色主题
              <>
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: themeStyles.titleColor }}></div>
                
                {/* 右侧日期区域 */}
                <div className="absolute top-8 right-6 text-right">
                  <div className="text-3xl font-bold mb-2" style={{ color: themeStyles.titleColor }}>
                    {day}
                  </div>
                  <div className="text-xs tracking-wider" style={{ color: themeStyles.bookColor }}>
                    {month} {year}
                  </div>
                </div>

                {/* 主要内容区域 - 自适应高度 */}
                <div className="px-8 pt-24 pb-16 h-full flex flex-col justify-between">
                  {/* 笔记内容 */}
                  <div className="flex-1 flex items-center overflow-hidden">
                    <div className="space-y-4 w-full pr-16">
                      {/* 标记文本 */}
                      {note.markText && (
                        <div 
                          className="text-base leading-relaxed font-medium break-words"
                          style={{ color: themeStyles.contentColor }}
                        >
                          {note.markText.length > 200 ? note.markText.substring(0, 200) + '...' : note.markText}
                        </div>
                      )}
                      
                      {/* 笔记内容 */}
                      {note.noteContent && (
                        <div 
                          className="text-sm leading-relaxed opacity-80 break-words"
                          style={{ color: themeStyles.contentColor }}
                        >
                          {note.noteContent.length > 200 ? note.noteContent.substring(0, 200) + '...' : note.noteContent}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 书籍信息 */}
                  <div className="space-y-2 mt-6">
                    <div 
                      className="text-sm font-medium break-words"
                      style={{ color: themeStyles.bookColor }}
                    >
                      《{note.bookName}》
                    </div>
                    {note.chapterName && (
                      <div 
                        className="text-xs opacity-70 break-words"
                        style={{ color: themeStyles.bookColor }}
                      >
                        {note.chapterName}
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部品牌信息 */}
                <div className="absolute bottom-0 left-0 right-0 px-8 py-4">
                  <div 
                    className="text-center text-xs tracking-wider border-t pt-3"
                    style={{ 
                      color: themeStyles.brandColor,
                      borderColor: themeStyles.borderColor
                    }}
                  >
                    ReadEcho丨回顾你的读书笔记
                  </div>
                </div>
              </>
            ) : (
              // 黑金主题
              <>
                {/* 主要内容区域 - 自适应高度 */}
                <div className="px-8 pt-12 pb-16 flex-1 flex items-center overflow-hidden">
                  <div className="space-y-4 w-full">
                    {/* 标记文本 */}
                    {note.markText && (
                      <div 
                        className="text-base leading-relaxed font-medium break-words"
                        style={{ color: themeStyles.contentColor }}
                      >
                        {note.markText.length > 200 ? note.markText.substring(0, 200) + '...' : note.markText}
                      </div>
                    )}
                    
                    {/* 笔记内容 */}
                    {note.noteContent && (
                      <div 
                        className="text-sm leading-relaxed opacity-90 break-words"
                        style={{ color: themeStyles.contentColor }}
                      >
                        {note.noteContent.length > 200 ? note.noteContent.substring(0, 200) + '...' : note.noteContent}
                      </div>
                    )}
                    
                    {/* 书籍信息 */}
                    <div className="pt-4 space-y-1">
                      <div 
                        className="text-sm font-medium break-words"
                        style={{ color: themeStyles.bookColor }}
                      >
                        / {note.bookName}
                      </div>
                      {note.chapterName && (
                        <div 
                          className="text-xs opacity-70 break-words"
                          style={{ color: themeStyles.bookColor }}
                        >
                          {note.chapterName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 底部品牌信息 */}
                <div className="absolute bottom-0 left-0 right-0 px-8 py-6">
                  <div 
                    className="text-xs text-center"
                    style={{ color: themeStyles.brandColor }}
                  >
                    ReadEcho丨回顾你的读书笔记
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 主题选择 */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium">选择主题</label>
          <div className="flex gap-3 justify-center">
            {/* 主题风格 */}
            <button
              className={`w-20 h-12 rounded-lg transition-all relative overflow-hidden ${
                selectedTheme === "theme"
                  ? "ring-2 ring-[#ff725f] ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: "#fdfcfb" }}
              onClick={() => setSelectedTheme("theme")}
            >
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded-full bg-[#ff725f]"></div>
              <span className="text-[#ff725f] text-xs font-medium">主题</span>
            </button>
            
            {/* 优雅主题 */}
            <button
              className={`w-20 h-12 rounded-lg transition-all relative overflow-hidden ${
                selectedTheme === "elegant"
                  ? "ring-2 ring-[#8B4513] ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: "#F5F2F0" }}
              onClick={() => setSelectedTheme("elegant")}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#8B4513]"></div>
              <span className="text-[#8B4513] text-xs font-medium">优雅</span>
            </button>
            
            {/* 黑金主题 */}
            <button
              className={`w-20 h-12 rounded-lg transition-all ${
                selectedTheme === "blackGold"
                  ? "ring-2 ring-gray-800 ring-offset-2"
                  : ""
              }`}
              style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)" }}
              onClick={() => setSelectedTheme("blackGold")}
            >
              <span className="text-yellow-400 text-xs font-medium">黑金</span>
            </button>
          </div>
        </div>

        {/* 复制按钮 */}
        <button
          onClick={handleDownload}
          className="w-full rounded-md bg-[#FF725F] py-3 text-white transition hover:bg-[#FF8F7F]"
        >
          复制图片
        </button>
      </div>
    </div>
  );
};

export default ShareDialog;
