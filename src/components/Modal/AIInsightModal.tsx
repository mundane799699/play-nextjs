import React, { useState, useEffect } from "react";
import { X, Brain, Copy, Check, RefreshCw } from "lucide-react";
import { Note } from "@/types/note";
import { getAIInsightStream, getAIInsight } from "@/services/ai";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [insight, setInsight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      loadAIInsight();
    }
  }, [isOpen, note]);

  // 生成缓存键
  const getCacheKey = (note: Note): string => {
    const content = `${note.bookName || ""}-${note.chapterName || ""}-${note.markText || ""}-${note.noteContent || ""}`;
    return `ai-insight-${btoa(encodeURIComponent(content)).slice(0, 50)}`;
  };

  // 从缓存加载或重新获取
  const loadAIInsight = async () => {
    if (!note) return;
    
    const cacheKey = getCacheKey(note);
    
    // 先尝试从缓存加载
    try {
      const cachedInsight = localStorage.getItem(cacheKey);
      if (cachedInsight) {
        const cached = JSON.parse(cachedInsight);
        // 检查缓存是否过期（24小时）
        const isExpired = Date.now() - cached.timestamp > 24 * 60 * 60 * 1000;
        
        if (!isExpired) {
          setInsight(cached.content);
          setIsFromCache(true);
          setError("");
          return;
        } else {
          // 清除过期缓存
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.error("读取缓存失败:", e);
    }
    
    // 缓存不存在或已过期，重新获取
    setIsFromCache(false);
    await fetchAIInsight();
  };

  const fetchAIInsight = async () => {
    if (!note) return;
    
    setIsLoading(true);
    setError("");
    setInsight("");
    
    try {
      // 先尝试简单的非流式API
      const response = await getAIInsight(note);
      if (response.error) {
        setError(response.error);
      } else {
        setInsight(response.content);
        
        // 保存到缓存
        const cacheKey = getCacheKey(note);
        try {
          const cacheData = {
            content: response.content,
            timestamp: Date.now(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
          console.error("保存缓存失败:", e);
        }
      }
    } catch (err) {
      console.error("AI洞察错误:", err);
      setError(err instanceof Error ? err.message : "获取AI洞察失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!insight) return;
    await navigator.clipboard.writeText(insight);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRetry = () => {
    fetchAIInsight();
  };

  const handleRefresh = async () => {
    if (!note) return;
    
    // 清除缓存
    const cacheKey = getCacheKey(note);
    try {
      localStorage.removeItem(cacheKey);
    } catch (e) {
      console.error("清除缓存失败:", e);
    }
    
    // 重新获取
    setIsFromCache(false);
    await fetchAIInsight();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-lg bg-white shadow-xl dark:bg-dark-2 flex flex-col">
        {/* 标题栏 */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                AI洞察
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {insight && (
                <>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 disabled:opacity-50"
                    title="重新分析"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="复制洞察内容"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* 当前笔记内容 */}
          {note && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <div>
                  <span className="font-medium">当前笔记：</span>
                  {note.chapterName
                    ? `${note.bookName} / ${note.chapterName}`
                    : note.bookName}
                </div>
                {isFromCache && insight && (
                  <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                    已缓存
                  </span>
                )}
              </div>
              {note.markText && (
                <div className="relative pl-3 mb-2">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"></div>
                  <blockquote className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {note.markText}
                  </blockquote>
                </div>
              )}
              {note.noteContent && (
                <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {note.noteContent}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">AI正在分析中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-4">
                <Brain className="h-12 w-12" />
              </div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                重试
              </button>
            </div>
          ) : insight ? (
            <MarkdownRenderer 
              content={insight} 
              className="text-gray-800 dark:text-gray-200 leading-relaxed"
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">暂无洞察内容</p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AIInsightModal; 